const optionsJava = {
  lineNumbers: true,
  // mode: "text/x-java",
  mode: "javascript",
  matchBrackets: true,
  theme: "material",
  tabSize: 4,

  readOnly: false,
  lineWrapping: true,
  autohint: true,
  tabMode: "indent",

  autoCloseTags: true,
  foldGutter: true,
  dragDrop: true,
  lint: true,
  gutters: [
    "CodeMirror-lint-markers",
    "CodeMirror-linenumbers",
    "CodeMirror-foldgutter",
  ],
  extraKeys: {
    "Ctrl-Space": "autocomplete",
    Tab: function (cm) {
      cm.replaceSelection("    ", "end");
    },
  },
};

export default {
  optionsJava,
};
