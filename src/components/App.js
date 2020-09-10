import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import MainPage from "../pages/MainPage/MainPage";
import routes from "../routes/routes";
import lodashDebounce from "lodash.debounce";

class App extends Component {
  state = {
    // ширина экрана пользователя
    clientWidth: window.innerWidth, // минимальное 900
  };

  componentDidMount() {
    window.addEventListener(
      "resize",
      lodashDebounce(this.updateDimensions, 200)
    );
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({
      clientWidth: window.innerWidth,
    });
  };

  render() {
    const { clientWidth } = this.state;

    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path={routes.MAIN_PAGE.path}
            render={(routeProps) => (
              <MainPage {...routeProps} clientWidth={clientWidth} />
            )}
          />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
