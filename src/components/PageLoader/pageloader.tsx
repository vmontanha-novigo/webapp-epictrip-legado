import React from 'react';
import Spinner from "../../assets/loader.gif";
import "../../global.css";

const PageLoader = () => {
    return (
        // <div className="loader-container">
        //     <img src={Spinner} className="loader" alt="loading"/>
        // </div>
        <div className="dots">
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default PageLoader
