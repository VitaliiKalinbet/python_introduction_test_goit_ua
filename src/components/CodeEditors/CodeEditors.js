import React from "react";
import CustomCodeMirror from "../CustomCodeMirror/CustomCodeMirror";
import styles from "./CodeEditors.module.css";

const CodeEditors = ({
  valueCode,
  handleChangeCode,
  metadata,
  currentTaskId,
  isRefreshCurrentQuestion,
  notEditableCodeBlocks,
  codeHlLines,
  codeCursor,
  upValueCodeInState,
  activityTimeMonitoringInCodeEditor,
  isShowResultArea,
  language,
  taskblockMetadata,
}) => {
  return (
    <div
      style={{ height: isShowResultArea ? "40vh" : "76vh" }}
      className={styles.code_container}
    >
      <CustomCodeMirror
        mode="java"
        code={valueCode}
        onChangeCode={handleChangeCode}
        notEditableBlocks={notEditableCodeBlocks}
        hlLines={codeHlLines}
        propertyReadOnly={metadata && metadata.disableCodeEditor}
        currentTaskId={currentTaskId}
        isRefreshCurrentQuestion={isRefreshCurrentQuestion}
        positionCursor={codeCursor}
        upValueCodeInState={upValueCodeInState}
        activityTimeMonitoringInCodeEditor={activityTimeMonitoringInCodeEditor}
        isShowResultArea={isShowResultArea}
      />
    </div>
  );
};

export default CodeEditors;
