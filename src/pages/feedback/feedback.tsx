import React, { useState, useCallback, useEffect } from "react";
import backgroundTopImage from "../../assets/feedback-top.jpg";
import Header from "../../components/header";
import Popup from "../../components/popup/popup";
import api from "../../services/api";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { getBooking } from "../../services/booking.service";
import { BookingType } from "../types/booking.type";
import { useToast } from "../../contexts/ToastContext";
import Loader from "../../components/loader";
import subImage from "../../assets/feedback-image.jpg";
import "./feedback.css";

export default function Feedback() {
  const { t } = useTranslation();
  const [fieldDescription, setFieldDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingType>({} as BookingType);
  const [buttonPopup, setButtonPopup] = useState(false);
  const {
    user: { idUser },
  } = useAuth();
  const { addToast } = useToast();

  const handleChangeDescription = useCallback((event) => {
    setFieldDescription(event.target.value);
  }, []);

  useEffect(() => {
    getBooking(idUser).then(setBooking);
  }, [idUser]);

  const handleKeyPress = useCallback((event) => {
    if (event.charCode == 13) {
      event.preventDefault();
    }
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);
    api
      .post("/feedback", {
        idUser: idUser,
        description: fieldDescription,
      })
      .then(() => setButtonPopup(true))
      .catch((error) => {
        if (error) {
          addToast({ type: "error", title: t("error_occurred") });
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="feedback-container page">
      <Header backgroundTopImage={backgroundTopImage} canGoBack={true} />
      <main className="main-with-header">
        <h1 className="h1-title">{t("feedback")}</h1>

        <img src={subImage} alt="" className="subImage" />
        <h2 className="notes-title">{t("trip_experience")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="notes">
            <textarea
              name="sports-request"
              id="sports-request"
              required
              value={fieldDescription}
              onChange={handleChangeDescription}
              onKeyPress={handleKeyPress}
              placeholder="___________________________________________________________________________________________________________________________________________________________________________________________________________________________________"
            ></textarea>
          </div>
          {fieldDescription ? (
            <button type="submit" className="green-button">
              {loading ? <Loader /> : t("submit")}
            </button>
          ) : (
            <button type="submit" className="green-button disabled">
              {t("submit")}
            </button>
          )}
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            <h4>{t("feedback_sent")}</h4>
          </Popup>
        </form>
      </main>
      <footer>
        <img src={booking.locatorIcon} alt="Locator Icon" className="logo" />
      </footer>
    </div>
  );
}
