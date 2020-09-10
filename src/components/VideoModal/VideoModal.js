import React from "react";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
// import s from "./VideoModal.module.css";

const defaultVideoLink =
  "https://www.youtube.com/embed/wrw0UCU66GE?list=PLViULGko0FdhfDVrVR1q02egcPGfo3TDr";

const VideoModal = ({ onClose, metadata }) => {
  return (
    <ModalWrapper onClose={onClose}>
      {/* <video controls className={s.video}>
        <source src={defaultVideoLink} type="video/mp4" />
        Ваш браузер не поддерживает элемент <code>video</code>.
      </video> */}

      <iframe
        title="video"
        width="90%"
        height="90%"
        src={(metadata && metadata.video) || defaultVideoLink}
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </ModalWrapper>
  );
};

export default VideoModal;
