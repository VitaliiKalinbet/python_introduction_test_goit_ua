import React, { Component, createRef } from "react";
import s from "./TheoryAndTaskOrLayout.module.css";

class TheoryAndTaskOrLayout extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.htmlDescription !== this.props.htmlDescription) {
      this.scrollToTopTheoryAndTask();
    }
  }

  theoryRef = createRef();

  scrollToTopTheoryAndTask = () => {
    const { isTheoryAndTaskShow, isServerError } = this.props;
    if (isTheoryAndTaskShow && !isServerError && this.theoryRef.current) {
      this.theoryRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  render() {
    const { htmlDescription } = this.props;
    return (
      <section ref={this.theoryRef} className={s.wrapper}>
        <div
          className={s.theoryAndTask_container}
          dangerouslySetInnerHTML={{ __html: htmlDescription }}
        />
      </section>
    );
  }
}

export default TheoryAndTaskOrLayout;
