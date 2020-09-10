import React from "react";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import s from "./CongratsModal.module.css";
import { ReactComponent as Close } from "../../assets/icons/winnerCup/close.svg";
import { ReactComponent as WinnerCup } from "../../assets/icons/cup.svg";
import localization from "../../utils/localization";

const CongratsModal = ({ onClose, language, blockTasksArr }) => {
  const tasksCount = blockTasksArr.length;
  return (
    <ModalWrapper
      onClose={() => {
        onClose();
      }}
      hideCloseButton
    >
      <section className={s.wrapper}>
        <WinnerCup className={s.winnerCup} width="118" />
        <h2 className={s.modalTitle}>
          {language === "ru"
            ? localization.CongratsModal.title.ru
            : localization.CongratsModal.title.ua}
        </h2>
        <Close
          className={s.close}
          onClick={() => {
            onClose();
          }}
        />
        <div className={s.contentWrapper}>
          <p className={s.text}>
            {language === "ru"
              ? localization.CongratsModal.text1_1.ru
              : localization.CongratsModal.text1_1.ua}
            <span className={s.fatText}>
              {language === "ru"
                ? localization.CongratsModal.text1_2.ru
                : localization.CongratsModal.text1_2.ua}
            </span>
          </p>

          <p className={s.result}>
            <span className={s.countTasks}>{tasksCount}</span>
            {language === "ru"
              ? localization.CongratsModal.text2.ru
              : localization.CongratsModal.text2.ua}
          </p>

          <div className={s.button_container}>
            <button onClick={onClose} className={s.button}>
              {language === "ru"
                ? localization.CongratsModal.button.ru
                : localization.CongratsModal.button.ua}
            </button>
          </div>
        </div>
      </section>
    </ModalWrapper>
  );
};

export default CongratsModal;
