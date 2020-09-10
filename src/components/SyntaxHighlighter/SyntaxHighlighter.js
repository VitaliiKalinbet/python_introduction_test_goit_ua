import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Prism as SyntaxHighlighterComponent } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism/okaidia.js";

class SyntaxHighlighter extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    language: PropTypes.string
  };

  static defaultProps = {
    language: null
  };

  render() {
    const { value } = this.props;
    const language = "html";
    return (
      <SyntaxHighlighterComponent language={language} style={okaidia}>
        {value}
      </SyntaxHighlighterComponent>
    );
  }
}

export default SyntaxHighlighter;
