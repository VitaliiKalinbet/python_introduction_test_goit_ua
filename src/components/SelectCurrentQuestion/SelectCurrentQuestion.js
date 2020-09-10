import React, { useEffect } from "react";
import localization from "../../utils/localization";
import s from "./SelectCurrentQuestion.module.css";

const SelectCurrentQuestion = ({
  closeSelect,
  passedTasks,
  getSpecificTask,
  blockTasksArr,
  language,
}) => {
  useEffect(() => {
    document.body.addEventListener("click", closeSelect);

    return () => {
      document.body.removeEventListener("click", closeSelect);
    };
  }, [closeSelect]);

  //the next two lines are the solution to the backend bug, which consists in the fact that the resolved tasks come in the wrong order:
  let rightPassedTasks = [];
  passedTasks.forEach(
    (el) => (rightPassedTasks[blockTasksArr.indexOf(el)] = el)
  );

  return (
    <div className={s.selectContent}>
      <ul className={s.list}>
        {rightPassedTasks.length !== 0 ? (
          rightPassedTasks.map((el, index) => (
            <li
              key={el}
              className={s.listItem}
              onClick={() => getSpecificTask(el)}
            >
              {language === "ru"
                ? localization.SelectCurrentQuestion.text.ru
                : localization.SelectCurrentQuestion.text.ua}{" "}
              {index + 1}
            </li>
          ))
        ) : (
          <li
            key={blockTasksArr[0]}
            className={s.listItem}
            onClick={() => getSpecificTask(blockTasksArr[0])}
          >
            {language === "ru"
              ? localization.SelectCurrentQuestion.text.ru
              : localization.SelectCurrentQuestion.text.ua}{" "}
            1
          </li>
        )}
      </ul>
    </div>
  );
};

export default SelectCurrentQuestion;
