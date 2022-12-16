import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import backgroundTopImageHome from "../../assets/home-logged-top.png";
import backgroundTopImageSchedule from "../../assets/schedulepage-top.png";
import backgroundTopImageBooking from "../../assets/top-mybooking.jpg";
import backgroundTopImageRequests from "../../assets/requests-status-top.png";
import lineTop from "../../assets/line.png";
import logoImg from "../../assets/logo-coin.png";
import requestsIcon from "../../assets/requests.png";
import scheduleIcon from "../../assets/schedule.png";
import addIcon from "../../assets/addbutton.png";
import "../../global.css";
import { LOGIN } from "../../routes";
import api, { userApi } from "../../services/api";
import { getAllCategories, getCategory } from "../../services/category.service";
import { Category } from "../types/category.type";
import "./home2.css";

export default function Home2() {
  const { t } = useTranslation();
  const history = useHistory();
  const [categories, setCategories] = useState([] as Category[]);

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, []);

  useEffect(() => {
    api.get("/healthCheck");
  }, []);

  useEffect(() => {
    userApi.post("/auth/login", "").catch(() => {});
  }, []);

  const handleGoToHome = useCallback(() => {
    history.push(LOGIN);
  }, [history]);

  // useEffect(() => {
  //   getCategory(null, true).then(setCategories)
  // }, []);


  return (
    <div className="container">
      <div className="top" />
      <div className="flex">
        <div className="logo-home">
          <img src={logoImg} />{" "}
        </div>
        <button className="button-home clickMeButton" onClick={handleGoToHome}>
          {t("enter")}
        </button>
      </div>
      <div className="bottom" />
      <div className="categories">
        {categories.map((category: Category) => {
          return (
            <div key={category.idCategory} className="cards">
              <img src={category.icon} />
              <p>{category.title}</p>
            </div>
          );
        })}
        <img src="https://epic-trip-images.s3.amazonaws.com/icons/MyBooking.png" />
        <img src={scheduleIcon} />
        <img src={requestsIcon} />
        <img src={addIcon} />
        <img src={backgroundTopImageHome} />
        <img src={backgroundTopImageSchedule} />
        <img src={backgroundTopImageBooking} />
        <img src={backgroundTopImageRequests} />
        <img src={lineTop} />
      </div>
    </div>
  );
}
