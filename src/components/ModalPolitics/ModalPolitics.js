import React from "react";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { ReactComponent as Close } from "../../assets/icons/winnerCup/close.svg";
import s from "./ModalPolitics.module.css";
import localization from "../../utils/localization";

const ModalPolitics = ({ onClose, language }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <div className={s.content}>
        <Close onClick={onClose} className={s.close} />
        <h2 className={s.modalMainTitle}>
          {language === "ru"
            ? localization.ModalPolitics.title.ru
            : localization.ModalPolitics.title.ua}
        </h2>
        <p className={s.text}>
          {language === "ru"
            ? localization.ModalPolitics.text.ru
            : localization.ModalPolitics.text.ua}
        </p>

        <h3 className={s.title}>
          {language === "ru"
            ? localization.ModalPolitics.subtitle1.ru
            : localization.ModalPolitics.subtitle1.ua}
        </h3>
        <p className={s.text}>
          {language === "ru"
            ? localization.ModalPolitics.text1_1.ru
            : localization.ModalPolitics.text1_1.ua}
        </p>
        <p className={s.text}>
          {language === "ru"
            ? localization.ModalPolitics.text1_2.ru
            : localization.ModalPolitics.text1_2.ua}
        </p>
        <p className={s.text}>
          {language === "ru"
            ? localization.ModalPolitics.text1_3.ru
            : localization.ModalPolitics.text1_3.ua}
        </p>

        <h3 className={s.title}>
          {language === "ru"
            ? localization.ModalPolitics.subtitle2.ru
            : localization.ModalPolitics.subtitle2.ua}
        </h3>
        <p className={s.text}>
          {language === "ru"
            ? localization.ModalPolitics.text2_1.ru
            : localization.ModalPolitics.text2_1.ua}
        </p>

        <h3 className={s.title}>
          {language === "ru"
            ? localization.ModalPolitics.subtitle3.ru
            : localization.ModalPolitics.subtitle3.ua}
        </h3>
        <p className={s.text}>
          {language === "ru"
            ? localization.ModalPolitics.text3_1.ru
            : localization.ModalPolitics.text3_1.ua}
        </p>
      </div>
    </ModalWrapper>
  );
};

export default ModalPolitics;
