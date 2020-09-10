import React, { Component } from "react";
import styles from "./Timer.module.css";
import localization from "../../utils/localization";

export default class Timer extends Component {
  state = {
    minutes: 0,
    seconds: 0,
    timerStart: null,
  };

  componentDidMount() {
    this.setState({
      timerStart: this.reversClock(),
    });
  }

  componentWillUnmount() {
    const { timerStart } = this.state;
    clearInterval(timerStart);
  }

  reversClock = () => {
    return setInterval(() => {
      const { timerEndTime, hideTimer } = this.props;
      const time = timerEndTime - Date.now();

      if (time <= 0) {
        const { timerStart } = this.state;
        clearInterval(timerStart);
        hideTimer();
        return;
      }

      const minsTimer = String(
        Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
      ).padStart(2, "0");

      const secsTimer = String(
        Math.floor((time % (1000 * 60)) / 1000)
      ).padStart(2, "0");

      this.setState({
        minutes: minsTimer,
        seconds: secsTimer,
      });
    }, 1000);
  };

  render() {
    const { minutes, seconds } = this.state;
    const { language } = this.props;
    return (
      <span className={styles.counterTitle}>
        {language === "ru"
          ? localization.Timer.text.ru
          : localization.Timer.text.ua}
        <span className={styles.counter}>
          {minutes}:{seconds}
        </span>
      </span>
    );
  }
}
