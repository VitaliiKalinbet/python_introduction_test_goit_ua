import React, { Component } from "react";
import styles from "./TaskButtons.module.css";
import { ReactComponent as Refresh } from "../../assets/icons/autorenew-black-18dp.svg";
import { ReactComponent as Movie } from "../../assets/icons/movie-black-18dp.svg";
import Timer from "../Timer/Timer";
import VideoModal from "../VideoModal/VideoModal";
import localization from "../../utils/localization";

class TaskButtons extends Component {
  state = {
    showPreviewModal: false,
    showPreviewModalFirst: false,
    showVideoModal: false,
  };

  showVideoModal = () => {
    const { showTimer, checkUserSeenHelpVideoForTask } = this.props;
    if (!showTimer) {
      this.setState({ showVideoModal: true });
      checkUserSeenHelpVideoForTask();
    }
  };
  closeVideoModal = () => this.setState({ showVideoModal: false });

  render() {
    const {
      checkTest,
      timerEndTime,
      metadata,
      showTimer,
      hideTimer,
      clientWidth,
      // isTheoryAndTaskShow,
      currentTaskId,
      blockTasksArr,
      // getTotalProgress,
      openModalRefreshQuestion,
      openCongratsModal,
      taskSuccessfullyPassed,
      getNextTask,

      showResultArea,
      hideResultArea,
      isShowResultArea,
      language,

      taskblockMetadata,
    } = this.props;

    const {
      // showPreviewModal,
      // showPreviewModalFirst,
      showVideoModal,
    } = this.state;

    const isLastQuestion =
      blockTasksArr.indexOf(currentTaskId) === blockTasksArr.length - 1;

    return (
      <div
        style={{ margin: isShowResultArea ? "5px 0" : "0" }}
        className={styles.buttonsContainer}
      >
        {!taskSuccessfullyPassed && (
          <button className={styles.checkButton} onClick={checkTest}>
            {language === "ru"
              ? localization.TaskButtons.btnCheck.ru
              : localization.TaskButtons.btnCheck.ua}
          </button>
        )}

        {taskSuccessfullyPassed && !isLastQuestion && (
          <button className={styles.checkButton} onClick={getNextTask}>
            {language === "ru"
              ? localization.TaskButtons.btnNextQuestion.ru
              : localization.TaskButtons.btnNextQuestion.ua}
          </button>
        )}

        {taskSuccessfullyPassed && isLastQuestion && (
          <button className={styles.checkButton} onClick={openCongratsModal}>
            {language === "ru"
              ? localization.TaskButtons.btnEnd.ru
              : localization.TaskButtons.btnEnd.ua}
          </button>
        )}

        <button
          onClick={openModalRefreshQuestion}
          className={styles.buttonWithSvg}
        >
          <Refresh className={styles.svg} />
          {language === "ru"
            ? localization.TaskButtons.btnRefresh.ru
            : localization.TaskButtons.btnRefresh.ua}
        </button>

        {!taskblockMetadata.allowVideoHelp && (
          <button
            onClick={isShowResultArea ? hideResultArea : showResultArea}
            className={styles.buttonWithoutSvg}
          >
            {isShowResultArea
              ? language === "ru"
                ? localization.TaskButtons.btnHideResultArea.ru
                : localization.TaskButtons.btnHideResultArea.ua
              : language === "ru"
              ? localization.TaskButtons.btnShowResultArea.ru
              : localization.TaskButtons.btnShowResultArea.ua}
          </button>
        )}

        {taskblockMetadata.allowVideoHelp &&
          (clientWidth > 1300 || !showTimer) && (
            <button
              onClick={this.showVideoModal}
              className={
                !showTimer ? styles.buttonWithSvg : styles.disableButtonWithSvg
              }
            >
              <Movie className={!showTimer ? styles.svg : styles.disableSvg} />
              {language === "ru"
                ? localization.TaskButtons.btnVideo.ru
                : localization.TaskButtons.btnVideo.ua}
            </button>
          )}

        {taskblockMetadata.allowVideoHelp && showTimer && (
          <Timer
            timerEndTime={timerEndTime}
            hideTimer={hideTimer}
            language={language}
          />
        )}

        {showVideoModal && (
          <VideoModal metadata={metadata} onClose={this.closeVideoModal} />
        )}
      </div>
    );
  }
}

export default TaskButtons;
