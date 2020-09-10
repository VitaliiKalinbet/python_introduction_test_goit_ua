import React, { Component, createRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import s from "./ModalWrapper.module.css";

const MODAL_ROOT = document.querySelector("#modal-root");

export default class Modal extends Component {
  modalRef = createRef();

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress);
    setTimeout(() => {
      document.querySelector("body").classList.add("noscroll");
    }, 0); // выключающийся лоадер удаляет добавленный класс noscroll, задержку чтобы в модальном окне этот класс добавлялся после того как в комопонент Loader он удалится при componentWillUnmount
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
    document.querySelector("body").classList.remove("noscroll");
  }

  handleKeyPress = (e) => {
    if (e.code !== "Escape") {
      return;
    }
    this.props.onClose();
  };

  handleBackdropClick = (e) => {
    if (this.modalRef.current && e.target !== this.modalRef.current) {
      return;
    }
    this.props.onClose();
  };

  render() {
    const { children } = this.props;

    return createPortal(
      <div
        className={s.modal_div}
        ref={this.modalRef}
        onClick={this.handleBackdropClick}
        role="presentation"
      >
        {children}
      </div>,
      MODAL_ROOT
    );
  }
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};
