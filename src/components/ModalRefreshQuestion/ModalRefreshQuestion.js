import React from "react";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import s from "./ModalRefreshQuestion.module.css";
import localization from "../../utils/localization";

const ModalRefreshQuestion = ({
  onClose,
  refreshCurrentQuestion,
  language,
}) => {
  return (
    <ModalWrapper onClose={onClose}>
      <div className={s.wrapper}>
        <h2 className={s.title}>
          {language === "ru"
            ? localization.ModalRefreshQuestion.title.ru
            : localization.ModalRefreshQuestion.title.ua}
        </h2>
        <div className={s.wrapperButton}>
          <button
            className={s.button}
            onClick={() => {
              refreshCurrentQuestion();
              onClose();
            }}
          >
            {language === "ru"
              ? localization.ModalRefreshQuestion.yes.ru
              : localization.ModalRefreshQuestion.yes.ua}
          </button>
          <button className={s.button} onClick={onClose}>
            {language === "ru"
              ? localization.ModalRefreshQuestion.no.ru
              : localization.ModalRefreshQuestion.no.ua}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ModalRefreshQuestion;
