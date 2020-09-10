import React, { Component } from "react";
import { createPortal } from "react-dom";
import LoaderLibrary from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import styles from "./Loader.module.css";

const LOADER_ROOT = document.getElementById("loader");

class Loader extends Component {
  componentDidMount() {
    document.querySelector("body").classList.add("noscroll");
  }

  componentWillUnmount() {
    document.querySelector("body").classList.remove("noscroll");
  }

  render() {
    return createPortal(
      <div className={styles.container}>
        <LoaderLibrary
          className={styles.loader}
          type="Oval"
          color="#ff7e31"
          height={80}
          width={80}
        />
      </div>,
      LOADER_ROOT
    );
  }
}

export default Loader;
