import React, { Component, createRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import s from "./ModalWrapperWithoutHeight.module.css";
import { ReactComponent as Cancel } from "../../assets/icons/cancel.svg";

const MODAL_ROOT = document.querySelector("#modal-root");

export default class ModalWrapperWithoutHeight extends Component {
  modalRef = createRef();

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyPress);
    document.querySelector("body").classList.add("noscroll");
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
    const { children, onClose, hideCloseButton } = this.props;

    return createPortal(
      <div
        className={s.modal_div}
        ref={this.modalRef}
        onClick={this.handleBackdropClick}
        role="presentation"
      >
        {!hideCloseButton && <Cancel onClick={onClose} className={s.close} />}
        {children}
      </div>,
      MODAL_ROOT
    );
  }
}

ModalWrapperWithoutHeight.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};
