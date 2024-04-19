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
import axios from "axios";

export default function Booking() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [booking, setBooking] = useState("")
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  let showExtendStay = user.idUserType === "2"; //is locator 2

  async function getBookingSimple(){
    const token = localStorage.getItem("@MyEpicTrip:token");
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', 
    }

    var userId = localStorage.getItem('@MyEpicTrip:user');

    if(userId)
    setUserId(userId);
    
    // const response = await axios.get('http://192.168.68.140:8082/booking',  { headers })
    // URL com ID User
    const response = await axios.get(`http://192.168.68.140:8082/booking/user/${userId}`,  { headers })

    console.log(response)

    
    if(response.status === 200) {

      setBooking(response.data)
      setLoading(false);
      return
    }


  }



  useEffect(() => {
    getBookingSimple();
  }, [userId]);

  return (
    <div className="booking-container page">
      <Header backgroundTopImage={backgroundTopImage} />

      <main className="main-with-header">
        <h1 className="h1-title">{t("My Booking")}</h1>

        {loading ? (
          <>
            <PageLoader />
          </>
        ) : (
          <>
            <div className="wrapper">

              <h2 className="booking-info-title" onClick={() => getBookingSimple()}>{t("Booking Details")}</h2>
                  <div className="detalhes-reserva margin-bottom">
                    <div className="linha">
                      <div className="titulo"><h3>{t("Booking Number")}</h3></div>
                      <div className="valor">
                      {booking?.idBooking}
                      </div>
                    </div>
                    <div className="linha">
                      <div className="titulo"><h3>{t("Check In")}</h3></div>
                      <div className="valor">{booking?.dateCheckIn}</div>
                    </div>
                    <div className="linha">
                      <div className="titulo checkout"><h3>{t("Check Out")}</h3></div>
                      <div className="valor">{booking?.dateCheckOut}</div>
                    </div>
                  </div>

              {showExtendStay && (
                <>
                  {booking.extendStayRequest ? (
                    <button className="large-button-disabled" disabled>
                      {t("Extend Stay")}
                    </button>
                  ) : (
                    <Link to="/extend_booking">
                      <button className="large-button">
                        {t("Extend Stay")}
                      </button>
                    </Link>
                  )}
                </>
              )}
              {showExtendStay ? (
                <section>
                  <h2 className="booking-info-title ">{t("Access Data")}</h2>
                  <div className="detalhes-reserva margin-bottom">
                    <div className="linha">
                      <div className="titulo"><h3>{t("Condo Gate Code")}:</h3></div>
                      <div className="valor">{booking?.condoGateCode}</div>
                    </div>
                    <div className="linha">
                      <div className="titulo"><h3>{t("Home Access Code")}:</h3></div>
                      <div className="valor">{booking?.homeAccessCode}</div>
                    </div>
                    <div className="linha">
                      <div className="titulo"><h3>{t("Network Name")}:</h3></div>
                      <div className="valor">{booking?.networkName}</div>
                    </div>
                    <div className="linha">
                      <div className="titulo"><h3>{t("Wifi Access Code")}:</h3></div>
                      <div className="valor">{booking?.wifiAccessCode}</div>
                    </div>
                  </div>

                  <h2 className="booking-info-title ">{t("Sharing Data")}</h2>
                  <div className="detalhes-reserva margin-bottom">
                    <div className="linha">
                      <div className="titulo"><h3>{t("Number")}:</h3></div>
                      <div className="valor">
                        {booking?.sharingNumberBooking}
                      </div>
                    </div>
                    <div className="linha">
                      <div className="titulo"><h3>{t("Password")}:</h3></div>
                      <div className="valor">{booking?.codeAccessBooking}</div>
                    </div>
                  </div>

                  <h2 className="booking-info-title">{t("Useful Phones")}</h2>
                  <div className="booking-info useful-phones">
                    <h3>{booking?.locatorName}</h3> <p>{booking?.phoneCall}</p>
                    <h3>{t("Emergency")}</h3> <p>{booking?.phoneEmergency}</p>
                  </div>
                </section>
              ) : (
                <>
                  <h2 className="booking-info-title ">{t("Access Data")}</h2>
                  <div className="booking-info margin-bottom">
                    <h3>{t("Condo Gate Code")}:</h3>
                    <p>{booking?.condoGateCode}</p>
                    <h3>{t("Home Access Code")}:</h3>
                    <p>{booking?.homeAccessCode}</p>
                    <h3>{t("Network Name")}:</h3>
                    <p>{booking?.networkName}</p>
                    <h3>{t("Wifi Access Code")}:</h3>
                    <p>{booking?.wifiAccessCode}</p>
                  </div>

                  <h2 className="booking-info-title ">{t("Sharing Data")}</h2>
                  <div className="booking-info margin-bottom">
                    <h3>{t("Number")}:</h3>{" "}
                    <p>{booking?.sharingNumberBooking}</p>
                    <h3>{t("Password")}:</h3> <p>{booking?.codeAccessBooking}</p>
                  </div>

                  <h2 className="booking-info-title">{t("Useful Phones")}</h2>
                  <div className="booking-info useful-phones">
                    <h3>{booking?.locatorName}</h3> <p>{booking?.phoneCall}</p>
                    <h3>{t("Emergency")}</h3> <p>{booking?.phoneEmergency}</p>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>

      <footer>
        {booking && Object.keys(booking).length ? (
          <>
            <img
              src={booking?.locatorIcon}
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
