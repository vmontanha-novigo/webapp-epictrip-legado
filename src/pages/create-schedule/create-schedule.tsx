import moment from "moment";
import "moment/min/locales";
import React, { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import { FaCircle } from "react-icons/fa"
import backgroundImage from "../../assets/schedule-top.jpg";
import Header from "../../components/header";
import Popup from "../../components/popup/popup";
import { useAuth } from "../../contexts/AuthContext";
import "../../global.css";
import api from "../../services/api";
import { getBooking } from "../../services/booking.service";
import { BookingType } from "../types/booking.type";
import { getCurrentLanguage } from "../utils/language.utils";
import { itemList } from "../utils/schedule-list.utils";
import { useToast } from "../../contexts/ToastContext";
import "./create-schedule.css";

export default function CreateSchedule() {
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [selectedItem, setSelectedItem] = useState(null as any);
  const [fieldDescription, setFieldDescription] = useState("");
  const [buttonPopup, setButtonPopup] = useState(false);
  const {
    user: { idUser },
  } = useAuth();

  const handleCardSelect = useCallback((item) => {
    return () => {
      setSelectedItem(item);
    };
  }, []);

  const [selectedDate, setSelectedDate] = useState(new Date());
  let selectedDateMoment = moment(selectedDate);

  const [booking, setBooking] = useState<BookingType>({} as BookingType);
  const filterPassedTime = (time: any) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  useEffect(() => {
    getBooking(idUser).then(setBooking);
  }, [idUser]);

  const handleChangeDescription = useCallback((event) => {
    setFieldDescription(event.target.value);
  }, []);

  let momentMonth = selectedDateMoment.format("MMMM");
  let momentDay = selectedDateMoment.format("DD");
  let momentMonthTranslate = t(`${momentMonth}`);

  const [errors, setErrors] = useState({ description: "", item: "" });

  const isFormValid = () => {
    const errors = {} as any;

    let formIsValid = true;
    if (!fieldDescription) {
      errors.description = t("fill");
      formIsValid = false;
    }

    if (!selectedItem) {
      errors.item = t("select");
      formIsValid = false;
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleOnSubmit = useCallback(
    (event: any) => {
      event.preventDefault();
      if (isFormValid()) {
        api.post(`/schedule/${booking.idBooking}`, {
          eventDate: selectedDateMoment.format("YYYY-MM-DD HH:mm"),
          title: selectedItem.title,
          description: fieldDescription,
          idUser: idUser
        }).then(() => setButtonPopup(true)).catch((error) => {
          if (error) {
            addToast({type: "error", title: t("error_occurred")})
          }
        });
        
        
      }
    },
    [errors, fieldDescription, selectedItem]
  );

  return (
    <div className="create-schedule-container page">
      <Header backgroundTopImage={backgroundImage}></Header>
      <main className="main-with-header">
      <h1 className="h1-title">{t('schedule')} <FaCircle size={9}/> {t('add_event')}</h1>
      <div className="teste">
      <h2 className="create-title">{selectedItem ? <>{t('title')} - {t(selectedItem.title)}</>: ''}</h2>
      </div>
        <div className="main-row">
          <label onChange={(e) => e.preventDefault()}>
            <div className="calendar-day">
              <p>{t("day")}</p>
              <span className="month">{momentMonthTranslate}</span>
              <span className="day">{momentDay}</span>
            </div>
            <DatePicker
              className="date-picker"
              selected={selectedDate}
              locale={getCurrentLanguage()}
              onChange={(date: Date) => setSelectedDate(date)}
              dateFormat={"MMM dd"}
              minDate={new Date()}
            />
          </label>

          <label>
            <div className="calendar-hours">
              <p>{t("hours")}</p>
              <span className="hours">
                {selectedDateMoment.format("HH:mm")}
              </span>
            </div>
            <DatePicker
              className="date-picker"
              selected={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption={t("hours")}
              timeFormat="HH:mm"
              filterTime={filterPassedTime}
            />
          </label>

          <div className="schedule-card top-card">
            {selectedItem ? <img src={selectedItem.icon}></img> : ''}
          </div>

          {/*  <div className="group">  ------- FASE 2 ------
                    <img src={groupIcon} alt="Grupo" />
                    </div> */}
        </div>
        <div className="schedule-group-cards">
          {itemList.map((item) => {
            return (
              <div
                key={item.id}
                className={
                  "schedule-card " +
                  (selectedItem?.id === item?.id ? "selected" : "")
                }
                onClick={handleCardSelect(item)}
              >
                <img src={item.icon} alt="" />
                <p>{t(item.title)}</p>
              </div>
            );
          })}
        </div>
        {errors.item && <p className="error">{errors.item}</p>}
        <section>
          <form onSubmit={handleOnSubmit}>
            <h2 className="notes-title">{t("notes")}</h2>
            <div className="notes">
              <textarea
                name="create-schedule"
                id="create-schedule"
                value={fieldDescription}
                onChange={handleChangeDescription}
              ></textarea>
            </div>
            {errors.description && (
              <p className="error"> {errors.description}</p>
            )}

            <button type="submit" className="green-button">
              {t("submit")}
            </button>
            <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
              <h4>{t("event_created")}</h4>
            </Popup>
          </form>
        </section>
      </main>
      <footer>
        <img src={booking.locatorIcon} alt="Locator Icon" className="logo" />
      </footer>
    </div>
  );
}
