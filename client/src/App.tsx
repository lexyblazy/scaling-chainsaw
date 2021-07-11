import React from "react";

import "./App.css";
import * as apis from "./apis";
import { Form, Services } from "./components";
import { SESSION_LABEL, USER_LABEL } from "./consts";
import { AppState, Session, User } from "./types";
import * as utils from "./utils";

class App extends React.Component {
  state: AppState = {
    isAuthenticated: false,
    user: null,
  };

  componentDidMount() {
    const user: User = JSON.parse(localStorage.getItem(USER_LABEL)!);
    const session: Session = JSON.parse(localStorage.getItem(SESSION_LABEL)!);

    if (user && session) {
      this.setState({ isAuthenticated: true, user });
    }
  }

  logout = async () => {
    await apis.users.logout();
    utils.auth.logout();
    this.setState({ isAuthenticated: false });
  };

  render() {
    return (
      <div className="container">
        {!this.state.isAuthenticated ? (
          <Form
            setAuthentication={() => this.setState({ isAuthenticated: true })}
          />
        ) : (
          <>
            <small
              className="btn-link"
              onClick={async () => await this.logout()}
            >
              Logout
            </small>
            <Services />
          </>
        )}
      </div>
    );
  }
}

export default App;
