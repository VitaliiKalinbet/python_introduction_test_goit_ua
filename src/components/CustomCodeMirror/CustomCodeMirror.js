import React, { Component, createRef } from "react";
import CodeMirror from "codemirror";
import disableCodeMirrorTextParts from "../../utils/disableCodeMirrorTextParts";
import codeMirrorSettings from "../../utils/codeMirrorSettings";
import s from "./CustomCodeMirror.module.css";

class CustomCodeMirror extends Component {
  state = {
    codeEditor: null,
  };

  textAreaRef = createRef();

  componentDidMount() {
    const {
      code,
      onChangeCode,
      notEditableBlocks,
      hlLines,
      propertyReadOnly,
      currentTaskId,
      positionCursor,
      activityTimeMonitoringInCodeEditor,
    } = this.props;

    let { codeEditor } = this.state;
    codeEditor = CodeMirror.fromTextArea(this.textAreaRef.current, {
      ...codeMirrorSettings.optionsJava,
      readOnly: propertyReadOnly,
    });

    const handleChangeTextArea = () => {
      const codeValue = codeEditor.getValue();
      onChangeCode(codeValue);
      activityTimeMonitoringInCodeEditor();
    };

    codeEditor.setValue(code);

    setTimeout(() => {
      const { upValueCodeInState } = this.props;

      upValueCodeInState(code);
    }, 250);

    disableCodeMirrorTextParts(
      codeEditor,
      notEditableBlocks,
      hlLines,
      currentTaskId
    );

    codeEditor.on("change", handleChangeTextArea);

    setTimeout(() => {
      if (!propertyReadOnly && positionCursor) {
        codeEditor.focus();
        codeEditor.setCursor({
          line: positionCursor[0],
          ch: positionCursor[1],
        });
      }
    }, 0);
  }

  componentDidUpdate(prevProps) {
    const {
      code,
      notEditableBlocks,
      hlLines,
      propertyReadOnly,
      onChangeCode,
      currentTaskId,
      isRefreshCurrentQuestion,
      positionCursor,
      activityTimeMonitoringInCodeEditor,
    } = this.props;
    let { codeEditor } = this.state;

    if (
      prevProps.currentTaskId !== currentTaskId ||
      prevProps.propertyReadOnly !== propertyReadOnly ||
      isRefreshCurrentQuestion ||
      prevProps.positionCursor !== positionCursor
    ) {
      codeEditor = CodeMirror.fromTextArea(this.textAreaRef.current, {
        ...codeMirrorSettings.optionsJava,
        readOnly: propertyReadOnly,
      });

      const handleChangeTextArea = () => {
        const codeValue = codeEditor.getValue();
        onChangeCode(codeValue);
        activityTimeMonitoringInCodeEditor();
      };

      codeEditor.setValue(code);
      disableCodeMirrorTextParts(
        codeEditor,
        notEditableBlocks,
        hlLines,
        currentTaskId
      );

      codeEditor.on("change", handleChangeTextArea);

      setTimeout(() => {
        const { upValueCodeInState } = this.props;

        upValueCodeInState(code);
      }, 250);

      setTimeout(() => {
        if (!propertyReadOnly && positionCursor) {
          codeEditor.focus();
          codeEditor.setCursor({
            line: positionCursor[0],
            ch: positionCursor[1],
          });
        }
      }, 0);
    }

    if (prevProps.code !== code && codeEditor) {
      codeEditor.setValue(code);
      disableCodeMirrorTextParts(codeEditor, notEditableBlocks, hlLines);
    }
  }

  render() {
    return <textarea className={s.textArea} ref={this.textAreaRef}></textarea>;
  }
}

export default CustomCodeMirror;
