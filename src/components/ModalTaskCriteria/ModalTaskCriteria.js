import React from "react";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import s from "./ModalTaskCriteria.module.css";
import { ReactComponent as Close } from "../../assets/icons/winnerCup/close.svg";

const ModalTaskCriteria = ({
  onClose,
  successConditions,
  failedConditions,
  taskSuccessfullyPassed,
  // getTask,
  getNextTask,
  // openCongratsModal,
  // эти два пропа чтобы понять крайний ли это вопрос
  blockTasksArr,
  currentTaskId,
}) => {
  // const addFunctionOpenCongratsModal =
  // blockTasksArr.indexOf(currentTaskId) === blockTasksArr.length - 1
  //   ? false
  //   : true;

  const showButtonNextQuestion =
    blockTasksArr.indexOf(currentTaskId) === blockTasksArr.length - 1
      ? false
      : true;
  return (
    <ModalWrapper onClose={onClose}>
      <div className={s.wrapper}>
        <Close onClick={onClose} className={s.close} />
        <h2 className={s.modalTitle}>Результат: </h2>
        <div className={s.content}>
          {successConditions.length > 0 && (
            <p className={s.successTitle}>Успішно: </p>
          )}
          <ol>
            {successConditions.map((element) => (
              <li key={element}>{element}</li>
            ))}
          </ol>
          {!taskSuccessfullyPassed && <p className={s.errorTitle}>Помилки:</p>}
          {!taskSuccessfullyPassed && (
            <ol>
              {failedConditions.map((element) => (
                <li key={element}>{element}</li>
              ))}
            </ol>
          )}

          <div className={s.buttons_container}>
            {!taskSuccessfullyPassed && (
              <button
                type="button"
                className={s.button}
                onClick={() => {
                  onClose();
                }}
              >
                Продовжити
              </button>
            )}

            {taskSuccessfullyPassed && showButtonNextQuestion && (
              <button
                type="button"
                className={s.button}
                onClick={() => {
                  onClose();
                  getNextTask();
                }}
              >
                Перейти до наступного питання
              </button>
            )}

            {!showButtonNextQuestion && taskSuccessfullyPassed && (
              <button
                type="button"
                className={s.button}
                onClick={() => {
                  onClose();
                  // openCongratsModal();
                }}
              >
                Ок
              </button>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ModalTaskCriteria;
