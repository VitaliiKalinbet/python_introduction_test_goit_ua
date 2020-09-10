import React from "react";
import s from "./ErrorServerStub.module.css";
import logo from "../../assets/images/logo.png";
import localization from "../../utils/localization";

const ErrorServerStub = ({ language }) => {
  return (
    <div className={s.container}>
      <img src={logo} alt="logo" />
      <p className={s.text}>
        {language === "ru"
          ? localization.ErrorServerStub.text.ru
          : localization.ErrorServerStub.text.ua}
      </p>
    </div>
  );
};

export default ErrorServerStub;
