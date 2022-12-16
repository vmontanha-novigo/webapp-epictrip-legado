import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import backButton from "../assets/back-button.png";
import lineTop from "../assets/line.png";
import logoTop from "../assets/logo-coin.png";

interface IMyProps {
  backgroundTopImage: string;
  canGoBack?: boolean;
}

const Header: React.FC<IMyProps> = (props: IMyProps) => {
  const { backgroundTopImage, canGoBack = true } = props;
  const history = useHistory();

  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <header>
      <img
        src={backgroundTopImage}
        alt="Plano de fundo"
        className="planodefundo"
      />
      {canGoBack && (
        <img
          src={backButton}
          alt="Go back button"
          className="back-button"
          onClick={handleGoBack}
        />
      )}
      <img src={lineTop} alt="Dividing line" className="line" />
      
      <img src={logoTop} alt="Logo image" className="logo-top" />
     
    </header>
  );
};

export default Header;
