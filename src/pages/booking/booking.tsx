import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import backgroundTopImage from "../../assets/top-mybooking.jpg";
import Header from "../../components/header";
import { useAuth } from "../../contexts/AuthContext";
import "../../global.css";
import { getBooking } from "../../services/booking.service";
import { BookingType } from "../types/booking.type";
import "./booking.css";
import PageLoader from "../../components/PageLoader/pageloader";

export default function Booking() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [booking, setBooking] = useState<BookingType>({} as BookingType);
  const [loading, setLoading] = useState(true);

  let showExtendStay = user.idUserType === "2"; //is locator 2

  useEffect(() => {
    getBooking(user.idUser, true)
      .then(setBooking)
      .finally(() => setLoading(false));
  }, [user.idUser]);

  return (
    <div className="booking-container page">
      <Header backgroundTopImage={backgroundTopImage} />

      <main className="main-with-header">
        <h1 className="h1-title">{t("my_booking")}</h1>

        {loading ? (
          <>
            <PageLoader />
          </>
        ) : (
          <>
            <div className="wrapper">

              <h2 className="booking-info-title">{t("booking_details")}</h2>
                  <div className="detalhes-reserva margin-bottom">
                    <div className="linha">
                      <div className="titulo"><h3>{t("booking_number")}</h3></div>
                      <div className="valor">
                      {booking.idBookingStr}
                      </div>
                    </div>
                    <div className="linha">
                      <div className="titulo"><h3>{t("check_in")}</h3></div>
                      <div className="valor">{booking.dateCheckInStr}</div>
                    </div>
                    <div className="linha">
                      <div className="titulo checkout"><h3>{t("check_out")}</h3></div>
                      <div className="valor">{booking.dateCheckOutStr}</div>
                    </div>
                  </div>

              {showExtendStay && (
                <>
                  {booking.extendStayRequest ? (
                    <button className="large-button-disabled" disabled>
                      {t("extend_stay")}
                    </button>
                  ) : (
                    <Link to="/extend_booking">
                      <button className="large-button">
                        {t("extend_stay")}
                      </button>
                    </Link>
                  )}
                </>
              )}
              {showExtendStay ? (
                <section>
                  <h2 className="booking-info-title ">{t("access_data")}</h2>
                  <div className="detalhes-reserva margin-bottom">
                    <div className="linha">
                      <div className="titulo"><h3>{t("condo_gate_code")}:</h3></div>
                      <div className="valor">{booking.condoGateCode}</div>
                    </div>
                    <div className="linha">
                      <div className="titulo"><h3>{t("home_access_code")}:</h3></div>
                      <div className="valor">{booking.homeAccessCode}</div>
                    </div>
                    <div className="linha">
                      <div className="titulo"><h3>{t("network_name")}:</h3></div>
                      <div className="valor">{booking.networkName}</div>
                    </div>
                    <div className="linha">
                      <div className="titulo"><h3>{t("wifi_access_code")}:</h3></div>
                      <div className="valor">{booking.wifiAccessCode}</div>
                    </div>
                  </div>

                  <h2 className="booking-info-title ">{t("sharing_data")}</h2>
                  <div className="detalhes-reserva margin-bottom">
                    <div className="linha">
                      <div className="titulo"><h3>{t("number")}:</h3></div>
                      <div className="valor">
                        {booking.sharingNumberBooking}
                      </div>
                    </div>
                    <div className="linha">
                      <div className="titulo"><h3>{t("password")}:</h3></div>
                      <div className="valor">{booking.codeAccessBooking}</div>
                    </div>
                  </div>

                  <h2 className="booking-info-title">{t("useful_phones")}</h2>
                  <div className="booking-info useful-phones">
                    <h3>{booking.locatorName}</h3> <p>{booking.phoneCall}</p>
                    <h3>{t("emergency")}</h3> <p>{booking.phoneEmergency}</p>
                  </div>
                </section>
              ) : (
                <>
                  <h2 className="booking-info-title ">{t("access_data")}</h2>
                  <div className="booking-info margin-bottom">
                    <h3>{t("condo_gate_code")}:</h3>
                    <p>{booking.condoGateCode}</p>
                    <h3>{t("home_access_code")}:</h3>
                    <p>{booking.homeAccessCode}</p>
                    <h3>{t("network_name")}:</h3>
                    <p>{booking.networkName}</p>
                    <h3>{t("wifi_access_code")}:</h3>
                    <p>{booking.wifiAccessCode}</p>
                  </div>

                  <h2 className="booking-info-title ">{t("sharing_data")}</h2>
                  <div className="booking-info margin-bottom">
                    <h3>{t("number")}:</h3>{" "}
                    <p>{booking.sharingNumberBooking}</p>
                    <h3>{t("password")}:</h3> <p>{booking.codeAccessBooking}</p>
                  </div>

                  <h2 className="booking-info-title">{t("useful_phones")}</h2>
                  <div className="booking-info useful-phones">
                    <h3>{booking.locatorName}</h3> <p>{booking.phoneCall}</p>
                    <h3>{t("emergency")}</h3> <p>{booking.phoneEmergency}</p>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>

      <footer>
        {Object.keys(booking).length ? (
          <>
            <img
              src={booking.locatorIcon}
              alt="Locator Icon"
              className="logo"
            />
          </>
        ) : (
          ""
        )}
      </footer>
    </div>
  );
}
