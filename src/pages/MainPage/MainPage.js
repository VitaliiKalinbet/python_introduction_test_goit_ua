import React, { Component, createRef } from "react";
// компоненты из библиотек:
import { ToastContainer, toast } from "react-toastify";
// cтили:
import styles from "./MainPage.module.css";
import "react-toastify/dist/ReactToastify.css";
// компоненты созданные:
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ButtonHideTheory from "../../components/ButtonHideTheory/ButtonHideTheory";
import TheoryAndTaskOrLayout from "../../components/TheoryAndTaskOrLayout/TheoryAndTaskOrLayout";
import TaskButtons from "../../components/TaskButtons/TaskButtons";
import CongratsModal from "../../components/CongratsModal/CongratsModal";
import ErrorStub from "../../components/ErrorStub/ErrorStub";
import ErrorInvalidTokenOrBlock from "../../components/ErrorInvalidTokenOrBlock/ErrorInvalidTokenOrBlock";
import ErrorServerStub from "../../components/ErrorServerStub/ErrorServerStub";
import CodeEditors from "../../components/CodeEditors/CodeEditors";
import ModalRefreshQuestion from "../../components/ModalRefreshQuestion/ModalRefreshQuestion";
import ModalAutotranslator from "../../components/ModalAutotranslator/ModalAutotranslator";
import ModalTaskCriteria from "../../components/ModalTaskCriteria/ModalTaskCriteria";
import ResultArea from "../../components/ResultArea/ResultArea";
import MobileAndTabletStub from "../../components/MobileAndTabletStub/MobileAndTabletStub";
import Loader from "../../components/Loader/Loader";
import ModalInfo from "../../components/ModalInfo/ModalInfo";
// прочие вспомогательные инструменты:
import * as API from "../../services/api";
// стили для codemirror
import "codemirror/lib/codemirror.css";
import "../../utils/materialCodeMirror.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/htmlmixed/htmlmixed";

import localization from "../../utils/localization";

const timerDelayInMs = 600000; // 10 minutes
// const timerDelayInMs = 720; // 1 second

let shouldAvailabilityAutotranslator = false;
const waitTimeInMs = 1000;
let availabilityAutotranslatorTimer = waitTimeInMs;
let timerAvailabilityAutotranslatorId;

class MainPage extends Component {
  state = {
    currentTaskId: "",
    blockTasksArr: "",
    passedTasks: [],
    token: "",
    block: "",

    valueCode: "",
    htmlDescription: "",
    metadata: "",
    passed: "", // выполнена ли текущая задача или нет
    blockIndex: 0, // это номер дня марафоне в хедере и в поздравительной модалке
    // появление пропадание теории с заданием:
    isTheoryAndTaskShow: true,
    // модальное окно с поздравлениями:
    isCongratsModalOpen: false,

    // время старта для таймера:
    timerEndTime: Date.now() + timerDelayInMs,
    // показываем ли таймер на текущем вопросе:
    showTimer: true,
    // показать компонент ошибки (не корректная ссылка или блок в query parametrs строки или юзер не участник марафона):
    errorShow: false,
    // показать компонент ошибки когда токен или блок не валиден:
    errorInvalidTokenOrBlock: false,
    // для фиксации времени прохождения пользователем текущего вопроса:
    startTime: null,
    // буль на случай когда лежит сервер
    isServerError: false,
    // для модальных окон после 5ти дней о том есть ли нерешенные задания в каких то днях или марафон полностью завершен
    nonFinishedDays: null,
    finishedLastDay: false,
    passedAllTasks: false,
    // лоадер
    showLoader: false,

    // для подсветки или отключения конкретных строчек в редакторе кода
    notEditableCodeBlocks: [],
    codeHlLines: [],

    isRefreshCurrentQuestion: false,

    codeCursor: null,

    showModalRefreshQuestion: false,
    showModalAutotranslator: false,
    showModalTaskCriteria: false,

    successConditions: [],
    failedConditions: [],
    checkMetadata: {},
    taskSuccessfullyPassed: null,

    isShowResultArea: true,

    language: "ru",
    taskblockMetadata: {
      defaultLanguage: "",
      allowVideoHelp: true,
      allowSwitchLanguage: true,
      ru: {
        title: "",
        editorTitle: "",
      },
      ua: {
        title: "",
        editorTitle: "",
      },
    },

    isShowModalInfo: false,
  };

  theoryAndTaskRef = createRef();
  // refs for translateModal:
  headerTextLogoRef = createRef();
  headerTextQuestionRef = createRef();
  footerTextRef = createRef();

  componentDidMount() {
    const { location, clientWidth } = this.props;
    const { valueCode } = this.state;
    if (location.search && clientWidth > 900 && valueCode === "") {
      const token = new URLSearchParams(location.search).get("token");
      const block = new URLSearchParams(location.search).get("block");
      this.getCurrentBlockAndCurrentTask(token, block);
      this.showResultArea();
    } else {
      this.setState({ errorShow: true });
    }

    // checkAvailabilityAutotranslator logic - start
    timerAvailabilityAutotranslatorId = setInterval(() => {
      if (shouldAvailabilityAutotranslator) {
        availabilityAutotranslatorTimer -= 100;

        if (availabilityAutotranslatorTimer <= 0) {
          shouldAvailabilityAutotranslator = false;
          availabilityAutotranslatorTimer = waitTimeInMs;

          // monitoring availability autotranslator:
          this.checkAvailabilityAutotranslator();
        }
      }
    }, 100);
    // checkAvailabilityAutotranslator logic - end

    // monitoring availability autotranslator - start
    setTimeout(() => {
      this.checkAvailabilityAutotranslator();
    }, 2000);
    // monitoring availability autotranslator - end
  }

  componentDidUpdate(prevProps, prevState) {
    const { valueCode, currentTaskId } = this.state;
    const { clientWidth } = this.props;
    if (
      (prevState.valueCode !== valueCode && clientWidth > 900) ||
      (prevState.currentTaskId !== currentTaskId && clientWidth > 900)
    ) {
      shouldAvailabilityAutotranslator = true;
      availabilityAutotranslatorTimer = waitTimeInMs;
    }

    const { blockTasksArr } = this.state;
    if (
      prevState.clientWidth !== clientWidth &&
      prevState.clientWidth < 900 &&
      blockTasksArr === "" &&
      valueCode === ""
    ) {
      const { location } = this.props;
      if (location.search) {
        const token = new URLSearchParams(location.search).get("token");
        const block = new URLSearchParams(location.search).get("block");
        this.getCurrentBlockAndCurrentTask(token, block);
      } else {
        this.setState({ errorShow: true });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(timerAvailabilityAutotranslatorId);
  }

  hideTimer = () => {
    this.setState({ showTimer: false });
  };

  forHighligthExampleInTheoryAndTaskSection = () => {
    document.querySelectorAll("pre code").forEach((block) => {
      window.hljs.highlightBlock(block);
    });
  };

  handleChangeCode = (value) => {
    this.setState({ valueCode: value });
  };

  getCurrentBlockAndCurrentTask = (token, block) => {
    API.getTasksBlockAndCurrentTask(token, block)
      .then((res) => {
        // console.log("getCurrentBlockAndCurrentTask res", res);
        if (res.data.success) {
          //если юзер не участник марафона будет заглушка
          // if (res.data.userInMarathon) {
          this.setState(
            {
              currentTaskId: res.data.currentTask,
              blockTasksArr: res.data.blockTasks,
              passedTasks: res.data.passedTasks,
              token: token,
              blockIndex: res.data.blockIndex,
              errorInvalidTokenOrBlock: false,
              errorShow: false,
              isServerError: false,
              block: block,
              taskblockMetadata: res.data.metadata,
              language: res.data.metadata.defaultLanguage,
            },
            () => {
              const LSlanguage = localStorage.getItem(
                "pythonIntroductionAutocheckLanguage"
              );
              if (LSlanguage) {
                const parseLSlanguage = JSON.parse(LSlanguage);
                this.setState({ language: parseLSlanguage }, () => {
                  this.getTask();
                });
              } else {
                this.getTask();
              }
            }
          );
          // } else {
          //   this.setState({ errorShow: true });
          // }
        } else {
          this.setState({ errorInvalidTokenOrBlock: true });
          toast.error(res.data.message, {
            autoClose: 4000,
          });
        }
      })
      .catch(() => {
        this.setState({ isServerError: true });
      });
  };

  getTask = () => {
    const { token, currentTaskId, language } = this.state;
    toast.dismiss();
    this.resetTaskCriteriaConditions();

    this.setState({ showLoader: true });
    API.getTaskInfo(token, currentTaskId, language)
      .then((res) => {
        // console.log("getTask fetch res.data ", res.data);
        this.setState(
          {
            valueCode: res.data.initialCode,
            htmlDescription: res.data.htmlDescription,
            metadata: res.data.metadata,
            passed: res.data.passed,
            startTime: Date.now(),
            isServerError: false,
            notEditableCodeBlocks: res.data.notEditableJsBlocks,
            codeHlLines: res.data.codeHlLines,
            codeCursor: res.data.codeCursor,
          },
          () => {
            this.forHighligthExampleInTheoryAndTaskSection();
            this.callToastify();
            this.showResultArea();
            // this.changeBackgroundInCodemirrorWithHtml();
          }
        );
      })
      .catch(() => {
        this.setState({ isServerError: true });
      })
      .finally(() => {
        this.setState({ showLoader: false });
      });
  };

  checkTest = () => {
    const { token, currentTaskId, startTime, valueCode, language } = this.state;
    this.setState({ showLoader: true });
    this.resetTaskCriteriaConditions();
    const solveTimeSeconds = Math.round((Date.now() - startTime) / 1000);
    API.checkTest(token, currentTaskId, solveTimeSeconds, valueCode, language)
      .then((res) => {
        this.setState({
          isServerError: false,
          successConditions: res.data.successConditions,
          failedConditions: res.data.failedConditions,
          taskSuccessfullyPassed: res.data.taskSuccessfullyPassed,
          checkMetadata: res.data.metadata,
        });
        this.showResultArea();
        if (res.data.failedConditions.length === 0) {
          this.callSpecificToastify();
        }
      })
      .catch(() => {
        this.setState({ isServerError: true });
      })
      .finally(() => {
        this.setState({ showLoader: false });
      });
  };

  openCongratsModal = () => this.setState({ isCongratsModalOpen: true });
  closeCongratsModal = () => this.setState({ isCongratsModalOpen: false });

  getNextTask = () => {
    toast.dismiss();
    this.resetTaskCriteriaConditions();
    const { token, currentTaskId, blockTasksArr, language } = this.state;
    const nextTaskId =
      blockTasksArr.indexOf(currentTaskId) !== blockTasksArr.length - 1
        ? blockTasksArr[blockTasksArr.indexOf(currentTaskId) + 1]
        : blockTasksArr[0];

    this.setState((prevState) => ({
      showLoader: true,
      passedTasks: prevState.passedTasks.includes(currentTaskId)
        ? [...prevState.passedTasks]
        : [...prevState.passedTasks, currentTaskId],
    }));
    API.getTaskInfo(token, nextTaskId, language)
      .then((res) => {
        this.setState(
          {
            currentTaskId: res.data.taskId,
            valueCode: res.data.initialCode,
            htmlDescription: res.data.htmlDescription,
            metadata: res.data.metadata,
            passed: res.data.passed,
            timerEndTime: Date.now() + timerDelayInMs,
            showTimer: true,
            startTime: Date.now(),
            isServerError: false,
            notEditableCodeBlocks: res.data.notEditableJsBlocks,
            codeHlLines: res.data.codeHlLines,
            codeCursor: res.data.codeCursor,
          },
          () => {
            this.forHighligthExampleInTheoryAndTaskSection();
            this.callToastify();
            this.showResultArea();
          }
        );
      })
      .catch(() => {
        this.setState({ isServerError: true });
      })
      .finally(() => {
        this.setState({ showLoader: false });
      });
  };

  getPrevTask = () => {
    toast.dismiss();
    this.resetTaskCriteriaConditions();
    const { token, currentTaskId, blockTasksArr, language } = this.state;
    const nextTaskId =
      blockTasksArr.indexOf(currentTaskId) !== 1
        ? blockTasksArr[blockTasksArr.indexOf(currentTaskId) - 1]
        : blockTasksArr[0];

    this.setState({ showLoader: true });
    API.getTaskInfo(token, nextTaskId, language)
      .then((res) => {
        this.setState(
          {
            currentTaskId: res.data.taskId,
            valueCode: res.data.initialCode,
            htmlDescription: res.data.htmlDescription,
            metadata: res.data.metadata,
            passed: res.data.passed,
            timerEndTime: Date.now() + timerDelayInMs,
            showTimer: true,
            startTime: Date.now(),
            isServerError: false,
            notEditableCodeBlocks: res.data.notEditableJsBlocks,
            codeHlLines: res.data.codeHlLines,
            codeCursor: res.data.codeCursor,
          },
          () => {
            this.forHighligthExampleInTheoryAndTaskSection();
            this.callToastify();
            this.showResultArea();
          }
        );
      })
      .catch(() => {
        this.setState({ isServerError: true });
      })
      .finally(() => {
        this.setState({ showLoader: false });
      });
  };

  getSpecificTask = (taskId) => {
    toast.dismiss();
    this.resetTaskCriteriaConditions();
    const { token, language } = this.state;

    this.setState({ showLoader: true });
    API.getTaskInfo(token, taskId, language)
      .then((res) => {
        this.setState(
          {
            currentTaskId: res.data.taskId,
            valueCode: res.data.initialCode,
            htmlDescription: res.data.htmlDescription,
            metadata: res.data.metadata,
            passed: res.data.passed,
            timerEndTime: Date.now() + timerDelayInMs,
            showTimer: true,
            startTime: Date.now(),
            isServerError: false,
            notEditableCodeBlocks: res.data.notEditableJsBlocks,
            codeHlLines: res.data.codeHlLines,
            codeCursor: res.data.codeCursor,
          },
          () => {
            this.forHighligthExampleInTheoryAndTaskSection();
            this.callToastify();
            this.showResultArea();
          }
        );
      })
      .catch(() => {
        this.setState({ isServerError: true });
      })
      .finally(() => {
        this.setState({ showLoader: false });
      });
  };

  resetTaskCriteriaConditions = () => {
    this.setState({
      successConditions: [],
      failedConditions: [],
      taskSuccessfullyPassed: false,
      checkMetadata: {},
    });
  };

  toggleTheoryAndTask = () => {
    this.setState(
      (prevState) => ({
        isTheoryAndTaskShow: !prevState.isTheoryAndTaskShow,
      }),
      () => this.forHighligthExampleInTheoryAndTaskSection()
    );
  };

  callToastify = () => {
    const { passed, language } = this.state;
    if (passed) {
      toast.success(
        language === "ru"
          ? localization.Toastify.complitedText.ru
          : localization.Toastify.complitedText.ua,
        {
          autoClose: 4000,
        }
      );
    }
  };

  callSpecificToastify = () => {
    const { currentTaskId, language } = this.state;
    if (currentTaskId === "java-pow-2") {
      toast.success(
        language === "ru"
          ? localization.Toastify.complitedHalfMarathonText.ru
          : localization.Toastify.complitedHalfMarathonText.ua,
        {
          autoClose: 4000,
        }
      );
    }

    if (currentTaskId === "java-is-quad") {
      toast.success(
        language === "ru"
          ? localization.Toastify.almostComplitedMarathonText.ru
          : localization.Toastify.almostComplitedMarathonText.ua,
        {
          autoClose: 4000,
        }
      );
    }
  };

  refreshCurrentQuestion = () => {
    toast.dismiss();
    this.resetTaskCriteriaConditions();

    this.setState({ showLoader: true });
    const { token, currentTaskId, language } = this.state;
    API.getTaskInfo(token, currentTaskId, language)
      .then((res) => {
        this.setState(
          {
            valueCode: res.data.initialCode,
            htmlDescription: res.data.htmlDescription,
            metadata: res.data.metadata,
            passed: res.data.passed,
            isServerError: false,
            notEditableCodeBlocks: res.data.notEditableJsBlocks,
            codeHlLines: res.data.codeHlLines,
            codeCursor: res.data.codeCursor,
          },
          () => {
            this.forHighligthExampleInTheoryAndTaskSection();
            this.setState({ isRefreshCurrentQuestion: true });
            this.showResultArea();
          }
        );
      })
      .then(() => {
        this.setState({ isRefreshCurrentQuestion: false });
      })
      .catch(() => {
        this.setState({ isServerError: true });
      })
      .finally(() => {
        this.setState({ showLoader: false });
      });
  };

  changeBackgroundInCodemirrorWithHtml = () => {
    const { metadata } = this.state;
    if (metadata && metadata.disableHtmlEditor) {
      // console.log("#html_box work disable");
      if (!document.querySelector("#html_box")) return;
      // console.log(
      //   'document.querySelector("#html_box") :>> ',
      //   document.querySelector("#html_box")
      // );
      document
        .querySelector("#html_box")
        .querySelector(".CodeMirror").style.backgroundColor = "rgb(27, 57, 94)";
      document
        .querySelector("#html_box")
        .querySelector(".CodeMirror-gutters").style.backgroundColor =
        "rgb(27, 57, 94)";
    } else if (metadata && !metadata.disableHtmlEditor) {
      // console.log("#html_box work active");
      if (!document.querySelector("#html_box")) return;
      document
        .querySelector("#html_box")
        .querySelector(".CodeMirror").style.backgroundColor =
        "rgba(16, 33, 54, 1)";
      document
        .querySelector("#html_box")
        .querySelector(".CodeMirror-gutters").style.backgroundColor =
        "rgba(16, 33, 54, 1)";
    }

    if (metadata && metadata.disableCssEditor) {
      // console.log("#css_box work disable");
      if (!document.querySelector("#css_box")) return;
      // console.log(
      //   'document.querySelector("#css_box" :>> ',
      //   document.querySelector("#css_box")
      // );
      document
        .querySelector("#css_box")
        .querySelector(".CodeMirror").style.backgroundColor = "rgb(27, 57, 94)";
      document
        .querySelector("#css_box")
        .querySelector(".CodeMirror-gutters").style.backgroundColor =
        "rgb(27, 57, 94)";
    } else if (metadata && !metadata.disableCssEditor) {
      // console.log("#css_box work active");
      if (!document.querySelector("#css_box")) return;
      document
        .querySelector("#css_box")
        .querySelector(".CodeMirror").style.backgroundColor =
        "rgba(16, 33, 54, 1)";
      document
        .querySelector("#css_box")
        .querySelector(".CodeMirror-gutters").style.backgroundColor =
        "rgba(16, 33, 54, 1)";
    }

    if (metadata && metadata.disableCodeEditor) {
      // console.log("#css_box work disable");
      if (!document.querySelector("#js_box")) return;
      // console.log(
      //   'document.querySelector("#js_box") :>> ',
      //   document.querySelector("#js_box")
      // );
      document
        .querySelector("#js_box")
        .querySelector(".CodeMirror").style.backgroundColor = "rgb(27, 57, 94)";
      document
        .querySelector("#js_box")
        .querySelector(".CodeMirror-gutters").style.backgroundColor =
        "rgb(27, 57, 94)";
    } else if (metadata && !metadata.disableCodeEditor) {
      // console.log("#css_box work active");
      if (!document.querySelector("#js_box")) return;
      document
        .querySelector("#js_box")
        .querySelector(".CodeMirror").style.backgroundColor =
        "rgba(16, 33, 54, 1)";
      document
        .querySelector("#js_box")
        .querySelector(".CodeMirror-gutters").style.backgroundColor =
        "rgba(16, 33, 54, 1)";
    }
  };

  getTotalProgress = () => {
    const { token } = this.state;
    API.getTotalProgress(token)
      .then((res) => {
        this.setState({
          nonFinishedDays: Object.entries(res.data.nonFinishedDays),
          finishedLastDay: res.data.finishedLastDay,
          passedAllTasks: res.data.passedAllTasks,
          isServerError: false,
        });
      })
      .catch(() => {
        this.setState({ isServerError: true });
      });
  };

  openModalRefreshQuestion = () => {
    this.setState({ showModalRefreshQuestion: true });
  };
  closeModalRefreshQuestion = () => {
    this.setState({ showModalRefreshQuestion: false });
  };

  checkAvailabilityAutotranslator = () => {
    const { language, taskblockMetadata } = this.state;
    if (
      !this.headerTextLogoRef.current ||
      !this.headerTextQuestionRef.current ||
      !this.footerTextRef.current
    )
      return;

    if (
      !this.headerTextLogoRef.current.textContent.includes(
        language === "ru"
          ? taskblockMetadata.ru === undefined
            ? ""
            : taskblockMetadata.ru.title
          : taskblockMetadata.ua === undefined
          ? ""
          : taskblockMetadata.ua.title
      ) ||
      !this.headerTextQuestionRef.current.textContent.includes(
        language === "ru"
          ? localization.Header.question.ru
          : localization.Header.question.ua
      ) ||
      !this.footerTextRef.current.textContent.includes(
        language === "ru"
          ? localization.Footer.text.ru
          : localization.Footer.text.ua
      )
    ) {
      this.openModalAutotranslator();
    }
  };
  openModalAutotranslator = () => {
    this.setState({ showModalAutotranslator: true });
  };
  closeModalAutotranslator = () => {
    this.setState({ showModalAutotranslator: false });
  };

  upValueCodeInState = (value) => {
    this.setState({ valueCode: value });
  };

  activityTimeMonitoringInCodeEditor = () => {
    const { startTime } = this.state;
    const thirtyMinutesInMs = 1800000;
    if (Date.now() - startTime >= thirtyMinutesInMs) {
      this.setState({ startTime: Date.now() });
    }
  };

  openModalTaskCriteria = () => {
    this.setState({ showModalTaskCriteria: true });
  };
  closeModalTaskCriteria = () => {
    this.setState({ showModalTaskCriteria: false });
  };

  checkUserSeenHelpVideoForTask = () => {
    const { token, currentTaskId } = this.state;
    const eventName = "userSeenHelpVideoForTask";
    API.checkUserSeenHelpVideoForTask(token, eventName, currentTaskId);
    // .then((res) => {
    //   this.setState({
    //     isServerError: false,
    //     successConditions: res.data.successConditions,
    //     failedConditions: res.data.failedConditions,
    //     taskSuccessfullyPassed: res.data.taskSuccessfullyPassed,
    //     checkMetadata: res.data.metadata,
    //   });
    // })
    // .catch(() => {
    //   this.setState({ isServerError: true });
    // });
  };

  showResultArea = () => {
    this.setState({ isShowResultArea: true });
    document
      .querySelector(".CodeMirror")
      .classList.remove("bigHeightCodeMirror");
  };
  hideResultArea = () => {
    this.setState({ isShowResultArea: false });
    document.querySelector(".CodeMirror").classList.add("bigHeightCodeMirror");
  };

  changeLanguageToRu = () => {
    this.setState({ language: "ru" }, () => {
      const { currentTaskId } = this.state;
      this.getSpecificTask(currentTaskId);
    });
    localStorage.setItem(
      "pythonIntroductionAutocheckLanguage",
      JSON.stringify("ru")
    );
    const { token } = this.state;
    API.changeLanguageToRu(token).then((res) => {
      if (!res.data.success) {
        setTimeout(() => {
          API.changeLanguageToRu(token).then((res) => {
            if (!res.data.success) {
              setTimeout(() => {
                API.changeLanguageToRu(token);
              }, 5000);
            }
          });
        }, 5000);
      }
    });
  };

  changeLanguageToUa = () => {
    this.setState({ language: "ua" }, () => {
      const { currentTaskId } = this.state;
      this.getSpecificTask(currentTaskId);
    });
    localStorage.setItem(
      "pythonIntroductionAutocheckLanguage",
      JSON.stringify("ua")
    );
    const { token } = this.state;
    API.changeLanguageToUa(token).then((res) => {
      if (!res.data.success) {
        setTimeout(() => {
          API.changeLanguageToUa(token).then((res) => {
            if (!res.data.success) {
              setTimeout(() => {
                API.changeLanguageToUa(token);
              }, 5000);
            }
          });
        }, 5000);
      }
    });
  };

  showModalInfo = () => {
    this.setState({ isShowModalInfo: true });
  };
  hideModalInfo = () => {
    this.setState({ isShowModalInfo: false });
  };

  showLoader = () => {
    this.setState({ showLoader: true });
  };
  hideLoader = () => {
    this.setState({ showLoader: false });
  };

  render() {
    const { language } = this.state;
    // ЕСЛИ ЧЕЛОВЕК зашел с устройства с экраном меньше 900pх то не показывать ему ничего кроме заглушки:
    const { clientWidth } = this.props;
    if (clientWidth < 900) {
      return <MobileAndTabletStub language={language} />;
    }

    // если не работает сервер, заглушка
    const { isServerError } = this.state;
    if (isServerError) {
      return <ErrorServerStub language={language} />;
    }

    // если не валиден token или block:
    const { errorInvalidTokenOrBlock } = this.state;
    if (errorInvalidTokenOrBlock) {
      return (
        <>
          <ToastContainer />
          <ErrorInvalidTokenOrBlock language={language} />
        </>
      );
    }

    // Если в url нету query parameters:
    const { errorShow } = this.state;
    if (errorShow) {
      return <ErrorStub language={language} />;
    }

    //  меняем беграунд html редактора когда он должен быть неактивным на редактирование
    const { metadata } = this.state;
    if (
      metadata &&
      (metadata.disableHtmlEditor ||
        metadata.disableCssEditor ||
        metadata.disableCodeEditor) &&
      clientWidth > 900
    ) {
      this.changeBackgroundInCodemirrorWithHtml();
    }

    const {
      block,
      valueCode,
      blockTasksArr,
      currentTaskId,
      // для модального окна с результатами:
      passed,
      // isTheoryAndTaskShow
      isTheoryAndTaskShow,
      isCongratsModalOpen,
      // время для таймера:
      timerEndTime,
      showTimer,
      // номер дня марафона в хедере
      blockIndex,
      // nonFinishedDays,
      // finishedLastDay,
      // passedAllTasks,
      showLoader,
      htmlDescription,

      isRefreshCurrentQuestion,

      notEditableCodeBlocks,
      codeHlLines,
      codeCursor,

      showModalRefreshQuestion,
      showModalAutotranslator,
      showModalTaskCriteria,

      successConditions,
      failedConditions,
      taskSuccessfullyPassed,
      checkMetadata,

      passedTasks,
      isShowResultArea,

      taskblockMetadata,
      isShowModalInfo,
    } = this.state;

    const widthCodeAndResultSection = isTheoryAndTaskShow ? "58.5%" : "94%";
    const widthTheoryAndTaskSection = "40%";
    const marginLeftCodeAndResultSection = isTheoryAndTaskShow ? "1.5%" : "6%";

    return (
      <>
        <Header
          blockTasksArr={blockTasksArr}
          currentTaskId={currentTaskId}
          getPrevTask={this.getPrevTask}
          getNextTask={this.getNextTask}
          passed={passed}
          block={block}
          headerTextLogoRef={this.headerTextLogoRef}
          headerTextQuestionRef={this.headerTextQuestionRef}
          passedTasks={passedTasks}
          getSpecificTask={this.getSpecificTask}
          language={language}
          changeLanguageToRu={this.changeLanguageToRu}
          changeLanguageToUa={this.changeLanguageToUa}
          taskblockMetadata={taskblockMetadata}
        />
        <main className={styles.main}>
          <article className={styles.mainContent}>
            <ButtonHideTheory
              toggleTheoryAndTask={this.toggleTheoryAndTask}
              isTheoryAndTaskShow={isTheoryAndTaskShow}
              language={language}
            />

            {/* начало секции теории и задания */}
            {isTheoryAndTaskShow && (
              <section
                ref={this.theoryAndTaskRef}
                style={{ width: widthTheoryAndTaskSection }}
              >
                <TheoryAndTaskOrLayout
                  isServerError={isServerError}
                  isTheoryAndTaskShow={isTheoryAndTaskShow}
                  htmlDescription={htmlDescription}
                />
              </section>
            )}
            {/* конец секции теории и задания */}

            {/* начало секции кода и результата */}
            <section
              className={styles.codeAndResult_container}
              style={{
                width: widthCodeAndResultSection,
                marginLeft: marginLeftCodeAndResultSection,
              }}
            >
              <h4 className={styles.codeTitle}>
                {language === "ru"
                  ? taskblockMetadata.ru === undefined
                    ? ""
                    : taskblockMetadata.ru.editorTitle
                  : taskblockMetadata.ua === undefined
                  ? ""
                  : taskblockMetadata.ua.editorTitle}
                :
              </h4>
              <CodeEditors
                valueCode={valueCode}
                handleChangeCode={this.handleChangeCode}
                metadata={metadata}
                currentTaskId={currentTaskId}
                isRefreshCurrentQuestion={isRefreshCurrentQuestion}
                notEditableCodeBlocks={notEditableCodeBlocks}
                codeHlLines={codeHlLines}
                codeCursor={codeCursor}
                upValueCodeInState={this.upValueCodeInState}
                activityTimeMonitoringInCodeEditor={
                  this.activityTimeMonitoringInCodeEditor
                }
                isShowResultArea={isShowResultArea}
                language={language}
                taskblockMetadata={taskblockMetadata}
              />

              <TaskButtons
                checkTest={this.checkTest}
                timerEndTime={timerEndTime}
                metadata={metadata}
                openModalRefreshQuestion={this.openModalRefreshQuestion}
                // для анимации первого дня первого вопроса
                blockIndex={blockIndex}
                currentTaskId={currentTaskId}
                blockTasksArr={blockTasksArr}
                showTimer={showTimer}
                hideTimer={this.hideTimer}
                clientWidth={clientWidth}
                isTheoryAndTaskShow={isTheoryAndTaskShow}
                // percentageDoneTask={percentageDoneTask}
                getNextTask={this.getNextTask}
                getTotalProgress={this.getTotalProgress}
                openCongratsModal={this.openCongratsModal}
                taskSuccessfullyPassed={taskSuccessfullyPassed}
                checkUserSeenHelpVideoForTask={
                  this.checkUserSeenHelpVideoForTask
                }
                showResultArea={this.showResultArea}
                hideResultArea={this.hideResultArea}
                isShowResultArea={isShowResultArea}
                language={language}
                taskblockMetadata={taskblockMetadata}
              />

              {/* <h4 className={styles.result_title}>Результат:</h4> */}
              {isShowResultArea && (
                <ResultArea
                  successConditions={successConditions}
                  failedConditions={failedConditions}
                  checkMetadata={checkMetadata}
                  language={language}
                />
              )}
            </section>
            {/* конец секции кода и результата */}
          </article>
        </main>
        <Footer footerTextRef={this.footerTextRef} language={language} />

        {isCongratsModalOpen && (
          <CongratsModal
            onClose={this.closeCongratsModal}
            language={language}
            blockTasksArr={blockTasksArr}
          />
        )}

        {isShowModalInfo && (
          <ModalInfo onClose={this.hideModalInfo} language={language} />
        )}

        <ToastContainer style={{ top: "55px" }} />

        {showLoader && <Loader />}

        {showModalRefreshQuestion && (
          <ModalRefreshQuestion
            onClose={this.closeModalRefreshQuestion}
            refreshCurrentQuestion={this.refreshCurrentQuestion}
            language={language}
          />
        )}

        {showModalAutotranslator && (
          <ModalAutotranslator
            onClose={this.closeModalAutotranslator}
            language={language}
          />
        )}

        {showModalTaskCriteria && (
          <ModalTaskCriteria
            onClose={this.closeModalTaskCriteria}
            successConditions={successConditions}
            failedConditions={failedConditions}
            taskSuccessfullyPassed={taskSuccessfullyPassed}
            getNextTask={this.getNextTask}
            blockTasksArr={blockTasksArr}
            currentTaskId={currentTaskId}
          />
        )}
      </>
    );
  }
}

export default MainPage;
