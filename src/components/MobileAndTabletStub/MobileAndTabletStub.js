import React from "react";
import s from "./MobileAndTabletStub.module.css";
import logo from "../../assets/images/logo.png";
import localization from "../../utils/localization";

const MobileAndTabletStub = ({ language }) => {
  return (
    <div className={s.container}>
      <img src={logo} alt="logo" />
      <p className={s.text}>
        {language === "ru"
          ? localization.MobileAndTabletStub.text.ru
          : localization.MobileAndTabletStub.text.ua}
      </p>
    </div>
  );
};

export default MobileAndTabletStub;
