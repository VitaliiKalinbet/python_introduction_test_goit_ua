import React from "react";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import s from "./ModalAutotranslator.module.css";
import localization from "../../utils/localization";

const ModalAutotranslator = ({ onClose, refreshCurrentQuestion, language }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <div className={s.wrapper}>
        <h2 className={s.title}>
          {language === "ru"
            ? localization.ModalAutotranslator.title.ru
            : localization.ModalAutotranslator.title.ua}
        </h2>
        <p className={s.text}>
          {language === "ru"
            ? localization.ModalAutotranslator.text.ru
            : localization.ModalAutotranslator.text.ua}
        </p>
        {/* <p className={s.text}>
          <a
            href="https://www.youtube.com/watch?v=DNjeGQ3DqKk&feature=youtu.be"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ссылка на видео где рассказывается как отключить автопереводчик
          </a>
        </p> */}
      </div>
    </ModalWrapper>
  );
};

export default ModalAutotranslator;
