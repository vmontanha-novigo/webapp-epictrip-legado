import React from 'react';
import obaLogo from "../../assets/logo-oba.png";
import backgroundTopImage from "../../assets/sports-top.png";
import basketballIcon from "../../assets/basketball.png";
import footballIcon from "../../assets/football.png";
import soccerIcon from "../../assets/soccer.png";
import baseballIcon from "../../assets/baseball.png";
import speedwayIcon from "../../assets/speedway.png";
import Header from "../../components/header";

import './styles.css';

export default function Request () {
    return (
        <div className="request-container">
        <Header backgroundTopImage={backgroundTopImage} />
        <main>
            <h1>Sports Games and Events</h1>
            <div className="requests">
                <div className="requests-cards">
                    <img src={basketballIcon} alt="" />
                    <h2>Basketball</h2>
                    <p>Orlando Magic is our American professional basketball team. The Magic competes in the NBA.</p>
                </div>
                <div className="requests-cards">
                    <img src={footballIcon} alt="" />
                    <h2>Football</h2>
                    <p>The Super Bowl LV Champions. Watch the Buccaners, at Raymond James Stadium.</p>
                </div>
                <div className="requests-cards">
                    <img src={soccerIcon} alt="" />
                    <h2>Soccer</h2>
                    <p>Orlando City Soccer Club! Watch the Lions in action at Exploria Stadium.</p>
                </div>
                <div className="requests-cards">
                    <img src={baseballIcon} alt="" />
                    <h2>Baseball</h2>
                    <p>UCF Knights Baseball! Watch a NCAA Basebakk Game and visit one of the biggest US universities.
                    </p>
                </div>
                <div className="requests-cards">
                    <img src={speedwayIcon} alt="" />
                    <h2>Speedway</h2>
                    <p>Daytona international speedway NASCAR Cup Series. Daytona 500. Event that you desire!</p>
                </div>
            </div>
        </main>
        <footer>
            <img src={obaLogo} alt="Logo Oba Vacation" className="logo" />
        </footer>
        </div>
    );
}