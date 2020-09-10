import React from "react";
import s from "./ErrorInvalidTokenOrBlock.module.css";
import logo from "../../assets/images/logo.png";
import localization from "../../utils/localization";

const ErrorInvalidTokenOrBlock = ({ language }) => {
  return (
    <div className={s.container}>
      <img src={logo} alt="logo" />
      <p className={s.text}>
        {language === "ru"
          ? localization.ErrorInvalidTokenOrBlock.text.ru
          : localization.ErrorInvalidTokenOrBlock.text.ua}
      </p>
    </div>
  );
};

export default ErrorInvalidTokenOrBlock;
