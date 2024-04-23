import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import addIcon from "../../assets/addbutton.png";
import backgroundTopImage from "../../assets/schedule-top.jpg";
import Header from "../../components/header";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { getBooking } from "../../services/booking.service";
import { BookingType } from "../types/booking.type";
import { getCurrentLanguage } from "../utils/language.utils";
import { iconByTitle } from "../utils/schedule-list.utils";
import PageLoader from "../../components/PageLoader/pageloader";
import axios from "axios";

import "./schedule.css";

type ScheduleType = {
  idSchedule: number;
  idUser: number;
  title: string;
  description: string;
  eventDate: string;
  icon: string;
  hour: string;
};

export default function Schedule() {
  const { t } = useTranslation();
  const {
    user: { idUser },
  } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const colors = ["green", "red", "yellow", "purple", "blue"];
  let colorPos = 0;
  const getNextColor = () => {
    let color = colors[colorPos++];
    if (colorPos >= colors.length) {
      colorPos = 0;
    }
    return color;
  };
  moment.locale(getCurrentLanguage());

  const [booking, setBooking] = useState<any>("");

  let availableDates: Array<any> = [];

  events.forEach((event: ScheduleType) =>
    availableDates.push(moment(event.eventDate).toDate())
  );

  const filterEvents = (allEvents: Array<ScheduleType>) => {
    return allEvents.filter((event: ScheduleType) => {
      return (
        moment(event.eventDate).format("YYYYMMDD") ===
        moment(selectedDate).format("YYYYMMDD")
      );
    });
  };

  async function getBookingAndEventSimple(){
    const token = localStorage.getItem("@MyEpicTrip:token");
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', 
    }
    var userId = localStorage.getItem('@MyEpicTrip:user');
    // const response = await axios.get('https://api.tropicaltecnologia.com.br:8082/booking',  { headers })
    // URL com ID User
    const response = await axios.get(`https://api.tropicaltecnologia.com.br:8082/booking/user/${userId}`,  { headers })
    let bookingId;
    if(response.status === 200) {
      setBooking(response.data)
      bookingId = response.data.idBooking
      const responseEvent = await axios.get(`https://api.tropicaltecnologia.com.br:8082/schedule/${bookingId}`, { headers })
      if (responseEvent.status === 200){
        setEvents(responseEvent.data)
        setLoading(false)
        return
      }
    }

  }

  useEffect(() => {
    getBookingAndEventSimple()
  }, []);

  const filteredEvents = filterEvents(events);

  useEffect(() => {
    if (booking?.idBooking) {
      api
        .get(`/schedule/${booking.idBooking}`)
        .then((res) => {
          let eventList = res.data;

          eventList.forEach((event: any) => {
            event["hour"] = moment(event.eventDate).format("HH:mm");
            event["icon"] = iconByTitle[event.title];
          });
          const orderedList = eventList.sort((a: any, b: any) =>
            a.hour.localeCompare(b.hour)
          );
          setEvents(orderedList);
        })
        .finally(() => setLoading(false));
    }
  }, [booking]);

  let selectedDateMoment = moment(selectedDate);
  const currentLanguage = window.localStorage.getItem("i18nextLng") || "en";

  let momentMonth = selectedDateMoment.format("MMMM");
  let momentDay = selectedDateMoment.format("DD");
  let momentMonthTranslate = t(`${momentMonth}`);

  return (
    <div className="schedule-container page">
      <Header backgroundTopImage={backgroundTopImage} />
      <main className="main-with-header">
        <div className="subheader">
          <label>
            <div className="calendar-div">
              <p className="month">{momentMonthTranslate}</p>
              <p className="day">{momentDay}</p>
            </div>
            <DatePicker
              className="date-picker"
              selected={selectedDate}
              locale={getCurrentLanguage()}
              onChange={(date: Date) => setSelectedDate(date)}
              includeDates={availableDates}
              dateFormat={"LLLL"}
            />
          </label>
          {/* <div className="cards-top">
            <img src={groupIcon} alt="" />
            <p>Group</p>
          </div>
          <div className="cards-top">
            <img src={personalIcon} alt="" />
            <p>Personal</p>
          </div> */}
          <div className="cards-top plus">
            <Link to="/create_schedule">
              <img src={addIcon} alt="include event in schedule" />
            </Link>
          </div>
        </div>

        {loading ? (
          <>
            <PageLoader/>
          </>
        ) : (
          <>
            <section>
              {events.map((event: ScheduleType) => {
                let color = getNextColor();
                return (
                  <div key={event?.idSchedule} className={`event-container ${color}`}>
                    <div className={`event`}>
                      <div className="event-img">
                        <img src="https://epic-trip-images-dev.s3.amazonaws.com/icons/Soccer.jpg" alt="" />
                      </div>
                      <div className="event-description">
                        <h2>{t(event?.title)}</h2>
                        <p>{event?.description}</p>
                      </div>
                      <div className={`event-hour ${color}`}>
                        <span>{event?.hour}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredEvents?.length == 0 ? (
                <div className="no-events">
                  <h1></h1>
                </div>
              ) : (
                ""
              )}
            </section>
          </>
        )}
      </main>
      <footer>
        <img src={booking?.locatorIcon} alt="Locator Icon" className="logo" />
      </footer>
    </div>
  );
}
