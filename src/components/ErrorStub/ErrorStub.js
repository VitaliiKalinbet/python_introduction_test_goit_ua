import React from "react";
import s from "./ErrorStub.module.css";
import logo from "../../assets/images/logo.png";
import localization from "../../utils/localization";

const ErrorStub = ({ language }) => {
  return (
    <div className={s.container}>
      <img src={logo} alt="logo" />
      <p className={s.text}>
        {language === "ru"
          ? localization.ErrorStub.text.ru
          : localization.ErrorStub.text.ua}
      </p>
    </div>
  );
};

export default ErrorStub;
