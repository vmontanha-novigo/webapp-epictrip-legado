import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCircle } from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../components/header";
import Popup from "../../components/popup/popup";
import { useAuth } from "../../contexts/AuthContext";
import "../../global.css";
import api from "../../services/api";
import { getBooking } from "../../services/booking.service";
import { BookingType } from "../types/booking.type";
import { Category } from "../types/category.type";
import Loader from "../../components/loader";
import { useToast } from "../../contexts/ToastContext";
import "./create-request-management.css";

export default function CreateRequestManagement() {
  const { t } = useTranslation();
  const { state } = useLocation<any>();
  const history = useHistory();
  const {
    user: { idUser },
  } = useAuth();
  const [booking, setBooking] = useState<BookingType>({} as BookingType);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const category = state.category as Category;
  const [fieldDescription, setFieldDescription] = useState("");

  const handleChangeDescription = useCallback((event) => {
    setFieldDescription(event.target.value);
  }, []);

  useEffect(() => {
    getBooking(idUser).then(setBooking);
  }, [idUser]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);
    if (fieldDescription) {
      api
        .post("/request", {
          // idUser: user.idUser,
          idBooking: booking.idBooking,
          idCategory: category.idCategory,
          description: fieldDescription,
        })
        .then(() => setButtonPopup(true))
        .catch((error) => {
          if (error) {
            addToast({ type: "error", title: t("error_occurred") });
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="sports-request-container page">
      <Header backgroundTopImage={category.image} />
      <main>
        <h1 className="h1-title">{category.title}</h1>
        <p>{category.description}</p>

        <h2 className="notes-title">
          {t("notes")} <FaCircle size="10" /> {t("explain")}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="notes">
            <textarea
              name="sports-request"
              id="sports-request"
              required
              value={fieldDescription}
              onChange={handleChangeDescription}
            ></textarea>
          </div>
          <button type="submit" className="green-button">
            {loading ? <Loader /> : t("submit")}
          </button>
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            <h4>{t("request_created")}</h4>
          </Popup>
        </form>
      </main>
      <footer>
        <img src={booking.locatorIcon} alt="Locator Icon" className="logo" />
      </footer>
    </div>
  );
}
