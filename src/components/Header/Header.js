import React, { useState } from "react";
import SelectCurrentQuestion from "../SelectCurrentQuestion/SelectCurrentQuestion";
import styles from "./Header.module.css";

import Logo from "../../assets/images/logo.png";
import { ReactComponent as RightArrow } from "../../assets/icons/arrow/right-arrow.svg";
import { ReactComponent as LeftArrow } from "../../assets/icons/arrow/left-arrow.svg";
// import utilsFunctionBlockDefinition from "../../utils/blockDefinition";
import localization from "../../utils/localization";

const Header = ({
  blockTasksArr,
  passedTasks,
  currentTaskId,
  getPrevTask,
  getNextTask,
  passed,
  block,
  headerTextLogoRef,
  headerTextQuestionRef,
  getSpecificTask,
  language,
  changeLanguageToRu,
  changeLanguageToUa,
  taskblockMetadata,
}) => {
  const [isOpenSelect, setSelect] = useState(false);
  const openSelect = () => setSelect(true);
  const closeSelect = () => setTimeout(() => setSelect(false), 0);

  const blockQuestionQuantity = blockTasksArr.length;
  const numberCurrentQuestion = blockTasksArr.indexOf(currentTaskId) + 1;
  const showPrevButton =
    blockTasksArr.indexOf(currentTaskId) === 0 ? false : true;
  const showNextButton =
    blockTasksArr.indexOf(currentTaskId) === blockTasksArr.length - 1 || !passed
      ? false
      : true;

  // const blockIndex = utilsFunctionBlockDefinition(block);

  return (
    <header className={styles.header_container}>
      <div className={styles.headerContent}>
        <h1 className={styles.logo_container}>
          <a href="https://goit.ua/" target="_blank" rel="noopener noreferrer">
            <img src={Logo} alt="logo" className={styles.img} />
          </a>
          <span className={styles.logo_title} ref={headerTextLogoRef}>
            {taskblockMetadata.defaultLanguage === ""
              ? ""
              : language === "ru"
              ? taskblockMetadata.ru === undefined
                ? ""
                : taskblockMetadata.ru.title
              : taskblockMetadata.ua === undefined
              ? ""
              : taskblockMetadata.ua.title}
          </span>
        </h1>

        <div className={styles.questionCounter_container}>
          {showPrevButton && (
            <button onClick={getPrevTask} className={styles.button}>
              <LeftArrow className={styles.arrow} />
            </button>
          )}
          <div
            className={styles.count}
            ref={headerTextQuestionRef}
            onClick={openSelect}
          >
            {language === "ru"
              ? localization.Header.question.ru
              : localization.Header.question.ua}{" "}
            {numberCurrentQuestion} / {blockQuestionQuantity}
            {isOpenSelect && (
              <SelectCurrentQuestion
                closeSelect={closeSelect}
                passedTasks={passedTasks}
                getSpecificTask={getSpecificTask}
                blockTasksArr={blockTasksArr}
                language={language}
              />
            )}
          </div>
          {showNextButton && (
            <button onClick={getNextTask} className={styles.button}>
              <RightArrow className={styles.arrow} />
            </button>
          )}
        </div>

        <p
          className={
            taskblockMetadata.allowSwitchLanguage === undefined
              ? styles.language_container
              : taskblockMetadata.allowSwitchLanguage
              ? styles.language_container
              : styles.language_container_hide
          }
        >
          <span
            className={
              language === "ru"
                ? styles.languageRuActive
                : styles.languageRuNotActive
            }
            onClick={changeLanguageToRu}
          >
            RU
          </span>
          <span
            className={
              language === "ru"
                ? styles.languageUaNotActive
                : styles.languageUaActive
            }
            onClick={changeLanguageToUa}
          >
            UA
          </span>
        </p>

        {/* <p className={styles.days_container}>
          Блок:&ensp;<span>{blockIndex}</span>&ensp;з 3
        </p> */}
      </div>
    </header>
  );
};

export default Header;
