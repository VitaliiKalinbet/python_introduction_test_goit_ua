import React from "react";
import { ReactComponent as Done } from "../../assets/icons/done.svg";
import { ReactComponent as NotDone } from "../../assets/icons/notDone.svg";
import localization from "../../utils/localization";
import s from "./ResultArea.module.css";

const ResultArea = ({
  failedConditions,
  successConditions,
  checkMetadata,
  language,
}) => {
  const isPresentCheckMetadataConsoleOutput =
    checkMetadata.consoleOutput !== undefined;

  return (
    <section className={s.result_container}>
      <header className={s.header}>
        <h2 className={s.title}>
          {language === "ru"
            ? localization.ResultArea.title.ru
            : localization.ResultArea.title.ua}
        </h2>
        <p className={s.text}>
          {language === "ru"
            ? localization.ResultArea.text.ru
            : localization.ResultArea.text.ua}
        </p>
      </header>

      <div className={s.main}>
        <div
          className={
            isPresentCheckMetadataConsoleOutput
              ? s.criteriaSmall
              : s.criteriaBig
          }
        >
          <ol className={s.list}>
            {failedConditions.length > 0 &&
              failedConditions.map((element) => (
                <li className={s.wrongCriteria} key={element}>
                  <NotDone className={s.criteriaIcon} /> <span>{element}</span>
                </li>
              ))}
          </ol>
          <ol className={s.list}>
            {successConditions.length > 0 &&
              successConditions.map((element) => (
                <li className={s.rightCriteria} key={element}>
                  <Done className={s.criteriaIcon} /> <span>{element}</span>
                </li>
              ))}
          </ol>
        </div>

        {isPresentCheckMetadataConsoleOutput && (
          <div className={s.consoleWrapper}>
            <h2 className={s.consoleTitle}>
              {language === "ru"
                ? localization.ResultArea.subtitle.ru
                : localization.ResultArea.subtitle.ua}
            </h2>
            <pre className={s.consoleContent}>
              {checkMetadata.consoleOutput}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultArea;
