import React from "react";
import styles from "./ButtonHideTheory.module.css";
import { ReactComponent as Badge } from "../../assets/icons/chrome_reader_mode-black-18dp.svg";
import localization from "../../utils/localization";

const ButtonHideTheory = ({
  toggleTheoryAndTask,
  isTheoryAndTaskShow,
  language,
}) => {
  return (
    <button onClick={toggleTheoryAndTask} className={styles.button}>
      <Badge className={styles.badge} />
      {isTheoryAndTaskShow && (
        <span>
          {language === "ru"
            ? localization.ButtonHideTheory.text.ru
            : localization.ButtonHideTheory.text.ua}
        </span>
      )}
    </button>
  );
};

export default ButtonHideTheory;
