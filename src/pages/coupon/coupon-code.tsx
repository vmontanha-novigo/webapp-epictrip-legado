import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { BookingType } from "../types/booking.type";
import { useAuth } from "../../contexts/AuthContext";
import { getBooking } from "../../services/booking.service";
import { Category } from "../types/category.type";
import backButton from "../../assets/back-button.png";
import api from "../../services/api";
import "./coupon-code.css";
import { addLanguageOnURL } from "../utils/url.utils";

const CouponCode = () => {
  const { state } = useLocation<any>();
  const category = state.category as Category;
  const [coupon, setCoupon] = useState<any>();
  const history = useHistory();

  const {
    user: { idUser },
  } = useAuth();
  const [booking, setBooking] = useState<BookingType>({} as BookingType);

  useEffect(() => {
    getBooking(idUser).then(setBooking);
  }, [idUser]);

 
  useEffect(() => {
    async function getUrlCoupon() {
      const { data } = await api.get("/coupon/" + category.idCategory);
      setCoupon(addLanguageOnURL(data.urlCoupon));
    }
    getUrlCoupon();
  }, []);

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <div className="coupon-container">
      <img
        src={backButton}
        alt="Go back button"
        className="back-button"
        onClick={handleGoBack}
      />
      <main>
        <img src={coupon} alt="" />
      </main>
      <footer>
        <img src={booking.locatorIcon} alt="Locator Icon" className="logo" />
      </footer>
    </div>
  );
};

export default CouponCode;
