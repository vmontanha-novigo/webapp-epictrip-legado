import React, { useCallback, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { HOME_LOGGED, REGISTER } from "../../routes";
import api, {userApi} from "../../services/api";
import styled from "@emotion/styled";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.svg";
import bkgLogin from "../../assets/bkg-login.jpg";
import { useToast } from "../../contexts/ToastContext";
import { keyframes } from "@emotion/react";
import Loader from "../../components/loader";
import backButton from "../../assets/back-button-blue.png";
import eyeIcon from "../../assets/eye.png";
import eyeClosedIcon from "../../assets/eye-closed.png";
import getHash from "../../services/hash.service";
import { getAllCategories, getCategory } from "../../services/category.service";
import { Category } from "../types/category.type";
import requestsIcon from "../../assets/requests.png";
import scheduleIcon from "../../assets/schedule.png";
import addIcon from "../../assets/addbutton.png";
import backgroundTopImageHome from "../../assets/home-logged-top.png";
import backgroundTopImageSchedule from "../../assets/schedulepage-top.png";
import backgroundTopImageBooking from "../../assets/top-mybooking.jpg";
import backgroundTopImageRequests from "../../assets/requests-status-top.png";
import lineTop from "../../assets/line.png";
import "../../global.css";

const Container = styled.div`
  background: url(${bkgLogin});
  min-height: 100%;
  overflow: hidden;
  padding: 0 2rem;
  position: relative;
`;
const PrimaryButton = styled.button`
  color: #fff;
  background: #509bbb;
  border: 1px solid #fff;
  border-radius: 15px;
  box-shadow: -1px 2px 1px #7c7a7b;
  padding: 5px;
  height: 43px;
  font-size: 1.4rem;
  width: 40%;
`;
const DisabledButton = styled(PrimaryButton)`
  background: #afb1b0;
`;
const Span = styled.span`
  left: 0.5rem;
  top: 0.3rem;
  text-shadow: -2px 0 #fff, 0 2px #fff, 2px 0 #fff, 0 -2px #fff;
  font-size: 0.9rem;
  font-weight: 700;
`;
const Title = styled.h2`
  margin: 6rem 0 0.5rem 1rem;
  font-size: 1.4rem;
  text-align: left;
  color: #7c7a7b;
  text-shadow: -1px 0 #fff, 0 1px #fff, 1px 0 #fff, 0 -1px #fff;
`;
const Input = styled.input`
  border-radius: 15px;
  border: 2px solid #7c7a7b;
  color: #7c7a7b;
  width: 20em;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  z-index: -1;
  &:focus {
    outline: 0;
    border: 3px solid #7c7a7b;
  }
  ::placeholder {
    color: #7c7a7b;
    opacity: 1;
  }

  :-ms-input-placeholder {
    color: #7c7a7b;
  }

  ::-ms-input-placeholder {
    color: #7c7a7b;
  }
`;
const BounceAnimation = keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: 15px }
  100% { margin-bottom: 0 }
`;
const Dot = styled.div<{ delay: string }>`
  background-color: #fff;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin: 0 3px;
  /* Animation */
  animation: ${BounceAnimation} 0.5s linear infinite;
  animation-delay: ${(props) => props.delay};
`;

const Button = styled.img`
  width: 10%;
  position: absolute;
  top: 2.5rem;
  left: 1rem;
`;

const Logo = styled.div`
  width: 100%;
  position: relative;
  top: 73px;
  cursor: pointer;
  text-align: center;
`;
const Img = styled.img`
  width: 250px;
  height: auto;
  vertical-align: middle;
`;
const Row = styled.div`
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  display: flex;
  flex-wrap: wrap;
  margin-top: calc(var(--bs-gutter-y) * -1);
  margin-right: calc(var(--bs-gutter-x) * -0.5);
  margin-left: calc(var(--bs-gutter-x) * -0.5);
  > * {
    flex-shrink: 0;
    width: 100%;
    max-width: 100%;
    padding-right: calc(var(--bs-gutter-x) * 0.5);
    padding-left: calc(var(--bs-gutter-x) * 0.5);
    margin-top: var(--bs-gutter-y);
  }
`;
const FormGroup = styled.div`
  label {
    position: relative;
    left: 2rem;
    text-shadow: -2px 0 #fff, 0 2px #fff, 2px 0 #fff, 0 -2px #fff;
    font-size: 0.9rem;
    top: 0.5rem;
    font-weight: 700;
    z-index: 10;
  }
  input {
    border-radius: 15px;
    border: 2px solid #7c7a7b;
    width: 98%;
    margin: auto;
  }
`;
const FormControl = styled.input`
  min-height: calc(1.5em + 1rem + 7px);
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  border-radius: 0.3rem;
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
`;
const Col = styled.div`
  flex: 1 0 0%;
`;
const PasswordButton = styled.img`
  width: 30px;
  position: absolute;
  top: 25px;
  right: 10px;
`;

const PasswordButtonClosed = styled.img`
  width: 30px;
  position: absolute;
  top: 25px;
  right: 10px;
`;

const PasswordWrapper = styled.div`
  width: 100%;
  position: relative;
`;

export default function Login() {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [sharingNumber, setConfirmationCode] = useState("");
  const [password, setPassword] = useState("");
  const { addToast } = useToast();
  const { login } = useAuth();
  const [categories, setCategories] = useState([] as Category[]);
  

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, []);

  useEffect(() => {
    api.get('/healthCheck');
  }, []);

  useEffect(() => {
    userApi.post("/auth/login", "").catch(() => {});
  }, []);

  const inputPassword = document.getElementById("password");
  const eyeImg = document.getElementById("eye");
  const eyeImgClosed = document.getElementById("eyeclosed");
  let visible = false;
  
  eyeImg?.addEventListener("click", () => {
    if (!visible) {
      visible = true;
      inputPassword?.setAttribute("type", "text");
      eyeImg.style.display = "none";
      eyeImgClosed!.style.display = "inline";
    }
  });

  eyeImgClosed?.addEventListener("click", () => {
    if (visible) {
      visible = false;
      inputPassword?.setAttribute("type", "password");
      eyeImgClosed.style.display = "none";
      eyeImg!.style.display = "inline";
    }
  });

  const handleSubmit = useCallback(
    async (e: any) => {
      setLoading(true);
      e.preventDefault();
      if (!email && !sharingNumber) {
        addToast({ type: "error", title: t("without_email") });
        return setLoading(false);
      }
      if (!password) {
        addToast({ type: "error", title: t("without_password") });
        return setLoading(false);
      }
      if (!sharingNumber && !email) {
        addToast({
          type: "error",
          title: t("without_confirmation_code"),
        });

        return setLoading(false);
      }
      //fazer hash da senha se for email e senha
      let passwordHash = password
      if (email && password) {
        passwordHash = getHash(password);
      }

      const response = await login({
        email,
        password: passwordHash,
        sharingNumber,
      });

     
      if (typeof response === "string") {
        setLoading(false);
        history.push(HOME_LOGGED);
        return;
      } else if (
        typeof response === "object" &&
        response.pendingRegister === true &&
        response.locator === true
      ) {
        history.push({
          pathname: REGISTER,
          state: { sharingNumber, passwordHash, data: response.data },
        });
      } else if (
        typeof response === "object" &&
        response.pendingRegister === true &&
        response.guest === true
      ) {
        history.push({
          pathname: REGISTER,
          state: { sharingNumber, passwordHash, data: response.data },
        });
      } else {
        setLoading(false);
        if (
          typeof response === "object" &&
          response.error === "invalid_email_or_password"
        ) {
          addToast({
            type: "error",
            title: t(response.error),
          });
          return;
        } else {
          addToast({
            type: "error",
            title: t("invalid_sharing_or_password"),
          });
          return;
        }
      }
    },
    [email, password, history, sharingNumber, t, addToast]
  );
  const handleGoToNewAccount = useCallback(() => {
    history.push(REGISTER);
  }, [history]);
  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);
  return (
    <Container>
      <Button onClick={handleGoBack} src={backButton} />
      <Logo>
        <Img src={logo} />
      </Logo>
      <Title>Login</Title>
      <Row>
        <Col>
          <FormGroup>
            <label htmlFor="email">{t("email")}</label>
            <FormControl
              id="email"
              type="email"
              value={email}
              disabled={sharingNumber != ""}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup style={{ position: "relative" }}>
            <Span style={{ position: "absolute" }}>{t("or")}</Span>
          </FormGroup>
          <FormGroup style={{ marginTop: "12px" }}>
            <label htmlFor="confirmation_code">{t("sharing_number")}</label>
            <FormControl
              id="confirmation_code"
              value={sharingNumber}
              disabled={email != ""}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
          </FormGroup>
          <PasswordWrapper>
            <FormGroup style={{ marginTop: "12px" }}>
              <label htmlFor="password">{t("password")}</label>
              <FormControl
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <PasswordButtonClosed src={eyeClosedIcon} id="eyeclosed" style={{display: "none"}}/>
              <PasswordButton src={eyeIcon} id="eye"  />
            </FormGroup>
          </PasswordWrapper>
        </Col>
      </Row>
      <Row>
        <Col>
          <div style={{ textAlign: "center",  marginTop: "1.5rem" }}>
            {(email && password) || (sharingNumber && password) ? (
              <PrimaryButton onClick={handleSubmit}>
                {loading ? <Loader /> : t("done")}
              </PrimaryButton>
            ) : (
              <DisabledButton>{t("done")}</DisabledButton>
            )}
          </div>
        </Col>
      </Row>
      <Row
        style={{
          position: "absolute",
          bottom: "2rem",
          width: "100%",
          left: "10px",
        }}
      >
        {/* <Col>
          <div style={{ textAlign: "center" }}>
            <PrimaryButton onClick={handleGoToNewAccount}>
              {t("new_account")}
            </PrimaryButton>
          </div>
        </Col> */}
      </Row>
      <div className="categories" style={{display: "none"}}>
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
    </Container>
  );
}
