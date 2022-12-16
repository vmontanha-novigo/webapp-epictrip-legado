import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { LOGIN } from "../../routes";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import logoImg from "../../assets/logo.svg";
import bkgHomeTop from "../../assets/bkg-home-top.png";
import bkgHome from "../../assets/bkg-home.jpg";
import bkgHomeBottom from "../../assets/bkg-home-bottom.png";
import "../global.css";

const Container = styled.div`
  background: url(${bkgHome}) no-repeat 45.5% 10px;
  background-size: cover;
  position: relative;
  text-align: center;
  height: 100%;
  overflow: hidden;
`;
const Top = styled.div`
  background: url(${bkgHomeTop}) no-repeat;
  position: absolute;
  top: -60px;
  width: 100%;
  height: 400px;
  overflow: hidden;
`;
const Logo = styled.div`
  width: 100%;
  z-index: 10;
  position: relative;
  top: 65px;
  cursor: pointer;
  text-align: center;
`;
const Img = styled.img`
  width: 220px;
  height: auto;
  vertical-align: middle;
`;
const Bottom = styled.div`
  background: url(${bkgHomeBottom}) no-repeat;
  background-position-y: bottom;
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 337px;
  overflow: hidden;
`;
const Button = styled.button`
  z-index: 11;
  position: absolute;
  background: none;
  border: none;
  bottom: 1.5rem; 
  font-size: 2rem;
  left: 50%;
  margin-left: -58px;
  color: #fff;
  text-shadow: 0 0px 3px #000;
`;
//const Container = styled.div`
//  height: 100vh;
//  background-image: url(${backgroundImage});
//  background-size: cover;
//`;
export default function Home(): JSX.Element {
  const { t } = useTranslation();
  const history = useHistory();
  const handleGoToHome = useCallback(() => {
    history.push(LOGIN);
  }, [history]);
  return (
    <Container>
      <Logo>
        <Img src={logoImg} />
      </Logo>
      <Top />
      <Bottom />
      <Button onClick={handleGoToHome}>{t("enter")}</Button>
    </Container>
  );
}
