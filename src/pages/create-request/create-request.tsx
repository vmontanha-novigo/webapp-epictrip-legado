import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCircle, FaTimesCircle } from "react-icons/fa";
import attachIcon from "../../assets/attachment.png";

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
import "./create-request.css";
import { getCurrentLanguageForBackend } from "../utils/language.utils";

export default function CreateRequest() {
  const { t } = useTranslation();
  const { state } = useLocation<any>();
  const history = useHistory();
  const {
    user: { idUser },
  } = useAuth();
  const [booking, setBooking] = useState<BookingType>({} as BookingType);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const category = state.category as Category;
  const [fieldDescription, setFieldDescription] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([] as any);

  const { addToast } = useToast();

  const handleChangeDescription = useCallback((event) => {
    setFieldDescription(event.target.value);
  }, []);

  const handleKeyPress = useCallback((event) => {
    if(event.charCode == 13) {
      event.preventDefault();
    };
  }, []);

  
  const handleFile = useCallback(
    (e) => {
      const fileList = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const inputFile = e.target.files[i];
        const fileObj = {
          fileName: inputFile.name,
          inputFile: inputFile,
          file: "base64",
        };
        encodeFileBase64(fileObj);
        fileList.push(fileObj);
      }
      setAttachedFiles(fileList);
    },
    [attachedFiles]
  );

  const encodeFileBase64 = (fileObj: any) => {
    let reader = new FileReader();
    if (fileObj?.inputFile) {
      reader.readAsDataURL(fileObj.inputFile);
      reader.onload = () => {
        const base64 = reader.result;
        fileObj.file = base64;
      };
      reader.onerror = (error) => console.log("error:", error);
    }
  };

  const clearFiles = () => {
    setAttachedFiles([]);
  };

  useEffect(() => {
    getBooking(idUser).then(setBooking);
  }, [idUser]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);
    if (fieldDescription) {
      const attachments = attachedFiles.map(({ fileName, file }: any) => {
        return { fileName, file };
      });
      api
        .post("/request", {
          // idUser: user.idUser,
          idBooking: booking.idBooking,
          idCategory: category.idCategory,
          description: fieldDescription,
        attachments: attachments,
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
      <main className={"main-with-header" + (category.parentId == 5 ? " double-button" : "")}>
        {/* <h1 className="h1-title">{category.title}</h1> */}
        {category.subImage == "null" || category.subImage == "" ? null : <><img src={category.subImage} className="subImage" alt="" /></>}
        {category.description == "null" || category.description == "" || category.description == " " ? null : <><h2 className="notes-title">{category.subDescription == "null" ? "" : category.subDescription}</h2><div className="notes description-request">{category.description}</div></>}

        <h2 className="notes-title">
          {category.parentId == 5 ? (
            t("describe_problem")
          ) : (
            <>
              {t("notes")} <FaCircle size="10" /> {t("explain")}
            </>
          )}
        </h2>
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

          {category.parentId == 5 ? (
            <>
              <div className="attachment">
                <label htmlFor="file-request">
                  {attachedFiles.length == 0 && (
                    <>
                      <img src={attachIcon} alt="attach icon" />
                      {t("attach")}
                      <input
                        type="file"
                        name="file-request"
                        id="file-request"
                        onChange={handleFile}
                      />
                    </>
                  )}
                </label>
                {attachedFiles.map((fileObj: any) => {
                  return (
                    <div className="file-group">
                      <span className="file-name">{fileObj.fileName}</span>
                      <FaTimesCircle size={18} onClick={clearFiles} />
                    </div>
                  );
                })}
              </div>

              {fieldDescription ? (
                <div className="left-button">
                  <button type="submit" className="small-button left">
                    {loading ? <Loader /> : t("submit")}
                  </button>
                </div>
              ) : (
                <div className="left-button">
                  <button type="submit" className="small-button disabled left">
                    {loading ? <Loader /> : t("submit")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {fieldDescription ? (
                <button type="submit" className="green-button">
                  {loading ? <Loader /> : t("submit")}
                </button>
              ) : (
                <button type="submit" className="green-button disabled">
                  {t("submit")} 
                </button>
              )}
            </>
          )}
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            <h4>{t("request_created")}</h4>
          </Popup>
        </form>
        {category.parentId == 5 && (
          <div className="right-button">
            <a href={`tel:${booking.phoneEmergency}`}>
              <button className="small-button right">
                {t("emergency_call")}
              </button>
            </a>
          </div>
        )}
      </main>
      <footer>
        <img src={booking.locatorIcon} alt="Locator Icon" className="logo" />
      </footer>
    </div>
  );
}
