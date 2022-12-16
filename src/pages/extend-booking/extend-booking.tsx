import React, { useEffect, useState, useCallback } from "react";
import backgroundTopImage from "../../assets/top-mybooking.jpg";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/header";
import moment from "moment";
import { getBooking } from "../../services/booking.service";
import { BookingType } from "../types/booking.type";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import subDays from "date-fns/subDays";
import api from "../../services/api";
import Popup from "../../components/popup/popup";
import Loader from "../../components/loader";
import { useToast } from "../../contexts/ToastContext";
import { getCurrentLanguage } from "../utils/language.utils";
import PageLoader from "../../components/PageLoader/pageloader";

import "./extend-booking.css";

export default function ExtendBooking() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const {
    user: { idUser },
  } = useAuth();
  const [booking, setBooking] = useState<BookingType>({} as BookingType);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [guests, setGuests] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLoader, setLoadingLoader] = useState(true);

  useEffect(() => {
    getBooking(idUser)
      .then(setBooking)
      .finally(() => setLoadingLoader(false));
  }, [idUser]);

  const handleGuestChange = useCallback(
    (e: any) => {
      let guests = e.target.value;
      setGuests(guests);
    },
    [guests]
  );

  const handleBedroomsChange = useCallback(
    (e: any) => {
      let bedrooms = e.target.value;
      setBedrooms(bedrooms);
    },
    [bedrooms]
  );

  const handleDateChangeRaw = (e: any) => {
    e.preventDefault();
  };

  const currentCheckoutFormated = moment(booking.dateCheckOut).format(
    "yyy/MM/DD"
  );
  let selectedDateMoment = moment(selectedDate).format("yyy/MM/DD");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);
    api
      .post("/request", {
        idBooking: booking.idBooking,
        idCategory: 999999,
        description: `Current Checkout: ${currentCheckoutFormated}; New Checkout: ${selectedDateMoment}; Guests: ${guests}; Bedrooms: ${bedrooms}`,
      })
      .then(() => getBooking(idUser, true))
      .then(() => setButtonPopup(true))
      .catch((error) => {
        if (error) {
          addToast({ type: "error", title: t("error_occurred") });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="extend-booking-container page">
      <Header backgroundTopImage={backgroundTopImage} />
      <main className="main-with-header">
        <h1 className="h1-title">{t("extend_stay")}</h1>

        {loadingLoader ? (
          <>
            <PageLoader/>
          </>
        ) : (
          <>
            <section>
              <div className="booking-info details">
                <h2 className="booking-info-title-absolute">
                  {t("booking_details")}
                </h2>
                <h3>{t("booking_number")}</h3> <p>{booking.idBookingStr}</p>
                <h3>{t("check_in")}</h3> <p>{booking.dateCheckInStr}</p>
                <h3 className="last-h3">{t("check_out")}</h3> <p>{booking.dateCheckOutStr}</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="booking-info extend">
                  <h2 className="booking-info-title-absolute">
                    {t("extend_your_stay")}
                  </h2>
                  <h3>{t("extend_checkout")}:</h3>{" "}
                  <div className="right-block">
                    <DatePicker
                      className="date-picker"
                      selected={selectedDate}
                      locale={getCurrentLanguage()}
                      onChange={(date: Date) => setSelectedDate(date)}
                      minDate={subDays(new Date(booking.dateCheckOut), -1)}
                      dateFormat="dd/MM/yyyy"
                      required
                      onChangeRaw={handleDateChangeRaw}
                      popperPlacement="bottom-end"
                    />
                  </div>
                  <h3>{t("guests")}:</h3>{" "}
                  <div className="right-block">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      name="guests-extension"
                      id="guests-extension"
                      required
                      onChange={handleGuestChange}
                      value={guests}
                    />
                  </div>
                  <h3 className="last-h3">{t("bedrooms")}:</h3>{" "}
                  <div className="right-block">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      name="bedrooms-extension"
                      id="bedrooms-extension"
                      required
                      onChange={handleBedroomsChange}
                      value={bedrooms}
                    />
                  </div>
                </div>
                <button type="submit" className="green-button">
                  {loading ? <Loader /> : t("submit")}
                </button>
                <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                  <h4>{t("request_created")}</h4>
                </Popup>
              </form>
            </section>
          </>
        )}
      </main>
      <footer>
        <img src={booking.locatorIcon} alt="Locator Icon" className="logo" />
      </footer>
    </div>
  );
}
