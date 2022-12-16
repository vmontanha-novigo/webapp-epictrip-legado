import styled from "@emotion/styled";
import React from "react";
import { useTranslation } from "react-i18next";
import obaLogo from "../assets/oba-logo.png";

const Title = styled.h2`
  margin-top: 3rem;
  text-align: left;
  color: #777;
  text-shadow: -1px 0 #fff, 0 1px #fff, 1px 0 #fff, 0 -1px #fff;
`;

const PrimaryButton = styled.button`
  color: #fff;
  background-color: #00b0a5;
  border-color: #000;
  border: 1px solid;
  border-radius: 10px;
  font-size: 20px;
  box-shadow: -1px 2px 1px #777;
  font-weight: bold;
  padding: 1rem 6rem;
`;
const TextArea = styled.textarea`
  resize: none;
  background-image: -webkit-linear-gradient(left, white 10px, transparent 10px),
    -webkit-linear-gradient(right, white 10px, transparent 10px),
    -webkit-linear-gradient(white 30px, #ccc 30px, #ccc 31px, white 31px);
  background-image: -moz-linear-gradient(left, white 10px, transparent 10px),
    -moz-linear-gradient(right, white 10px, transparent 10px),
    -moz-linear-gradient(white 30px, #ccc 30px, #ccc 31px, white 31px);
  background-image: -ms-linear-gradient(left, white 10px, transparent 10px),
    -ms-linear-gradient(right, white 10px, transparent 10px),
    -ms-linear-gradient(white 30px, #ccc 30px, #ccc 31px, white 31px);
  background-image: -o-linear-gradient(left, white 10px, transparent 10px),
    -o-linear-gradient(right, white 10px, transparent 10px),
    -o-linear-gradient(white 30px, #ccc 30px, #ccc 31px, white 31px);
  background-image: linear-gradient(left, white 10px, transparent 10px),
    linear-gradient(right, white 10px, transparent 10px),
    linear-gradient(white 30px, #ccc 30px, #ccc 31px, white 31px);
  background-size: 100% 100%, 100% 100%, 100% 31px;
  border: 2px solid #777;
  border-radius: 8px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  line-height: 31px;
  font-family: Arial, Helvetica, Sans-serif;
  padding: 8px;
  margin-bottom: 10px;
`;

const Box = styled.div`
  border: 2px solid #777;
  padding: 2rem 4rem;
  border-radius: 10px;
  position: relative;
  margin-top: 10px;
  margin-bottom: 10px;
`;
export default function Sports() {
  const { t } = useTranslation();
  return (
    <>
      <div style={{ height: "100vh" }}>
        <img src="/assets/soccer.png" />
        <Title> Sports</Title>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box>
            <div
              style={{
                position: "absolute",
                top: -10,
                left: 30,
                backgroundColor: "#fff",
              }}
            >
              <p style={{ color: "#777" }}>{t("how_many_tickets")}</p>
            </div>
            <div style={{ display: "flex" }}>
              <label htmlFor="adult_ticket">{t("adult_ticket")}(10+)</label>
              <input
                className="adult_ticket"
                type="text"
                style={{ border: "none", borderBottom: "1px solid #888" }}
              />
            </div>

            <div style={{ display: "flex" }}>
              <label htmlFor="child_ticket">{t("child_ticket")}(3-9)</label>
              <input
                className="child_ticket"
                type="text"
                style={{ border: "none", borderBottom: "1px solid #888" }}
              />
            </div>
          </Box>

          <TextArea rows={5} cols={50} />
          <PrimaryButton>{t("submit")}</PrimaryButton>
        </div>

        <img
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          src={obaLogo}
        />
      </div>
    </>
  );
}
