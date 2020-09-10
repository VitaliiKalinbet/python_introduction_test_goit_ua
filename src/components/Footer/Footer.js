import React, { useState } from "react";
import s from "./Footer.module.css";
import ModalPolitics from "../ModalPolitics/ModalPolitics";
import localization from "../../utils/localization";

const Footer = ({ footerTextRef, language }) => {
  const [isModalPoliticsOpen, setIsModalPoliticsOpen] = useState(false);
  const openModalPolitics = () => setIsModalPoliticsOpen(true);
  const closeModalPolitics = () => setIsModalPoliticsOpen(false);
  return (
    <footer className={s.footer_container}>
      <p className={s.copyright}>
        <span className={s.signOfCopyright}>&copy;</span> 2020
        <span className={s.signOfDivider}>|</span>
        <span
          className={s.privacyPolicy}
          onClick={openModalPolitics}
          ref={footerTextRef}
        >
          {language === "ru"
            ? localization.Footer.text.ru
            : localization.Footer.text.ua}
        </span>
      </p>
      {isModalPoliticsOpen && (
        <ModalPolitics onClose={closeModalPolitics} language={language} />
      )}
    </footer>
  );
};

export default Footer;
