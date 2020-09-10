//Function that disable specific CodeMirror text parts
function disableCodeMirrorTextParts(
  editor,
  blocks,
  foreverHighlightLines,
  currentTaskId
) {
  let doc = editor.getDoc();
  // Make not-editable lines
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    doc.markText(
      {
        line: block.start.line,
        ch: block.start.ch,
      },
      {
        line: block.end.line,
        ch: 100,
      },
      {
        readOnly: true,
        className: block.className,
      }
    );
  }

  //Mark forever highlight lines
  doc.markedBlocks = [];
  for (let i = 0; i < foreverHighlightLines.length; i++) {
    const hlLine = foreverHighlightLines[i];
    const line = hlLine.line;
    const className = hlLine.className;

    const marker = doc.markText(
      { line: line, ch: 0 },
      { line: line, ch: 1 },
      { className: className }
    );
    doc.markedBlocks.push(marker);
  }

  const highlightLines = (cm) => {
    const doc = cm.getDoc();

    let hlLines = [];
    for (var i = 0; i < doc.markedBlocks.length; i++) {
      const marker = doc.markedBlocks[i];
      const markerFind = marker.find();
      if (markerFind) {
        hlLines.push(markerFind.from.line);
      }
    }

    const lineCount = doc.lineCount();
    for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
      if (hlLines.indexOf(lineIndex) > -1) {
        doc.addLineClass(lineIndex, "wrap", "hl-line");
      } else {
        doc.removeLineClass(lineIndex, "wrap", "hl-line");
      }
    }
  };

  highlightLines(editor);
  editor.on("change", (cm, change) => {
    highlightLines(cm);
  });
}

export default disableCodeMirrorTextParts;
