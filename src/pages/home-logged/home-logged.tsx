import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCircle } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import backgroundTopImage from "../../assets/teste-home.jpg";
import requestsIcon from "../../assets/requests.png";
import scheduleIcon from "../../assets/schedule.png";
import feedbackIcon from "../../assets/feedback.png";
import rewardsIcon from "../../assets/rewards.png";
import lineTop from "../../assets/line-home2.png";
import logoTop from "../../assets/logo-coin.png";
import { useAuth } from "../../contexts/AuthContext";
import "../../global.css";
import { getBooking } from "../../services/booking.service";
import { getCategory, getAllCategories } from "../../services/category.service";
import { BookingType } from "../types/booking.type";
import { Category } from "../types/category.type";
import PageLoader from "../../components/PageLoader/pageloader";

import "./home-logged.css";

export default function HomeLogged() {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    user: { idUser },
  } = useAuth();

  const [categories, setCategories] = useState([] as Category[]);
  const [booking, setBooking] = useState<BookingType>({} as BookingType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategory().then(setCategories);
  }, []);

  // useEffect(() => {
  //   getAllCategories().then(setCategories);
  // }, []);

  useEffect(() => {
    getBooking(idUser)
      .then(setBooking)
      .finally(() => setLoading(false));
  }, [idUser]);

  const handleCategoryClick = useCallback((category: Category) => {
    return () => {
      if (category.hasChild == "true" || category.hasChild == "1") {
        history.push({ pathname: "/categories_detail", state: { category } });
      } else {
        history.push({ pathname: "/create_request", state: { category } });
      }
    };
  }, []);

  return (
    <div className="home-logged-container page">
      <header>
        <img
          src={backgroundTopImage}
          alt="Background Image"
          className="planodefundo"
          />
        <img src={lineTop} alt="Dividing line" className="line" />
        <img src={logoTop} alt="Logo image" className="logo-top" />
      </header>
      <main className="main-with-header">
        <div className="subheader">
          <h1>
            {Object.keys(booking).length ? (
              <>
                <FaCircle size="8" color="#009cbe" />{" "}
                {booking.nameBookingTravel}{" "}
                <FaCircle size="8" color="#009cbe" />
              </>
            ) : (
              ""
            )}
          </h1>
        </div>
        <div className="main-cards">
          <div className="cards-top">
            <Link to="/schedule">
              <img src={scheduleIcon} alt="Ícone de cronograma" />
              <p>{t("schedule")}</p>
            </Link>
          </div>
          <div className="cards-top">
            <Link to="/requests_status">
              <img src={requestsIcon} alt="Ícone para fazer uma solicitação" />
              <p>{t("requests")}</p>
            </Link>
          </div>
          <div className="cards-top">
            <img src={rewardsIcon} alt="Ícone para as recompensas" />
            <p>{t("rewards")}</p>
          </div>
          <div className="cards-top">
            <Link to="/feedback">
              <img src={feedbackIcon} alt="Ícone para dar feedback" />
              <p>{t("feedback")}</p>
            </Link>
          </div>
        </div>

        <hr />
        {loading ? (
          <>
            <PageLoader />
          </>
        ) : (
          <>
            <div className="dynamic-cards">
              <div className="cards">
                <Link to="/booking">
              
                    <img
                      src="https://epic-trip-images.s3.amazonaws.com/icons/MyBooking.png"
                      alt="Ícone de booking"
                    />
                
                  <div className="cards-p">
                    <p>{t("my_booking")}</p>
                  </div>
                </Link>
              </div>
              {categories.map((category: Category) => {
                return (
                  <div
                    key={category.idCategory}
                    className="cards"
                    onClick={handleCategoryClick(category)}
                  >
                    
                      <img src={category.icon} />
                    
                    <div className="p-img">
                      <p>{category.title}</p>
                    </div>
                  </div>
                );
              })}
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
