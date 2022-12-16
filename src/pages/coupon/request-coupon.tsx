import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Category } from "../types/category.type";
import { getBooking } from "../../services/booking.service";
import { BookingType } from "../types/booking.type";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/header";
import { useHistory } from "react-router-dom";
import './request-coupon.css';
import { useTranslation } from "react-i18next";
import { addLanguageOnURL } from "../utils/url.utils";

const RequestCoupon = () => {
  const { state } = useLocation<any>();
  const category = state.category as Category;   
  const {t} = useTranslation();
  const history = useHistory();
  
  useEffect(() => {
    category.subImageLang = addLanguageOnURL(category.subImage);
  }, [])

  const {
    user: { idUser },
  } = useAuth();
  const [booking, setBooking] = useState<BookingType>({} as BookingType);

  useEffect(() => {
    getBooking(idUser).then(setBooking);
  }, [idUser]);

  return (
    <div className="request-coupon-container">
      <Header backgroundTopImage={category.image} />
      <main className="main-with-header">
          <h1 className="h1-title">{category.title}</h1>
          <img src={category.subImageLang} alt="" className="request-coupon-image" />
          <button className="green-button" onClick={() => history.push({ pathname: "/coupon_code", state: { category } })}>{t("coupon")}</button>
      </main>
      <footer>
        <img src={booking.locatorIcon} alt="Locator Icon" className="logo" />
      </footer>
    </div>
  );
};

export default RequestCoupon;
