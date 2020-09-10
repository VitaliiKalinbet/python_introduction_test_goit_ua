import React from "react";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { ReactComponent as Close } from "../../assets/icons/winnerCup/close.svg";
import localization from "../../utils/localization";
import s from "./ModalInfo.module.css";

const ModalInfo = ({ onClose, language }) => {
  return (
    <ModalWrapper onClose={onClose} hideCloseButton>
      <section className={s.wrapper}>
        <Close className={s.close} onClick={onClose} />
        <h2 className={s.modalTitle}>
          {language === "ru"
            ? localization.ModalInfo.title.ru
            : localization.ModalInfo.title.ua}
        </h2>
        <div className={s.contentWrapper}>
          <p className={s.text}>
            {language === "ru"
              ? localization.ModalInfo.text1.ru
              : localization.ModalInfo.text1.ua}
            &#128522;
          </p>
        </div>
      </section>
    </ModalWrapper>
  );
};

export default ModalInfo;
