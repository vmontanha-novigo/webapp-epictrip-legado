import React, { useCallback } from 'react';
import { useHistory } from "react-router-dom";
import "./popup.css";
import { useTranslation } from "react-i18next";


export default function Popup(props: any) {

    const history = useHistory();
    const { t } = useTranslation();  
    
    const handleOnClick = useCallback(() => {
        props.setTrigger(false);
        history.goBack();
      }, [history]);

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                {props.children}
                <button className="close-btn" onClick={handleOnClick}>
                    {t('back')}
                </button>
            </div>
        </div>
    ) : null;
}
