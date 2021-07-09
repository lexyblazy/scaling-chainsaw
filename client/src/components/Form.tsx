import React, { useState } from "react";
import { Loader } from "./Loader";
import * as apis from "../apis";
import * as consts from "../consts";
import * as utils from "../utils";

// this will work for both  signup and login
export const Form = ({
  setAuthentication,
}: {
  setAuthentication: () => void;
}) => {
  const [formType, setFormType] = useState("signup");
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    let message = "";

    const response =
      formType === "signup"
        ? await apis.users.signup(formState.email, formState.password)
        : await apis.users.login(formState.email, formState.password);

    if (response && response.ok && response.data) {
      localStorage.setItem(
        consts.USER_LABEL,
        JSON.stringify(response.data.user)
      );
      localStorage.setItem(
        consts.SESSION_LABEL,
        JSON.stringify(response.data.session)
      );

      setTimeout(setAuthentication, 1000);

      return;
    }

    message = response.data?.error ?? `Failed to ${formType}`;

    setErrorMessage(message);
    setLoading(false);
  };

  const disabled =
    !formState.email ||
    !utils.isValidEmail(formState.email) ||
    !formState.password;

  return (
    <form className="jumbotron" onSubmit={handleSubmit}>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="mb-3">
        <label className="form-label">Email address</label>
        <input
          type="email"
          className="form-control"
          placeholder="name@example.com"
          value={formState.email}
          onChange={(e) =>
            setFormState({ ...formState, email: e.target.value })
          }
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="password"
          value={formState.password}
          onChange={(e) =>
            setFormState({ ...formState, password: e.target.value })
          }
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <button
            type="submit"
            className="btn btn-primary mb-2"
            disabled={disabled}
          >
            {formType[0].toUpperCase() + formType.slice(1)}
          </button>
          <div style={{ cursor: "pointer" }}>
            {formType === "signup" ? (
              <small className="btn-link" onClick={() => setFormType("login")}>
                Already have an account? Login!
              </small>
            ) : (
              <small className="btn-link" onClick={() => setFormType("signup")}>
                New user? Signup!
              </small>
            )}
          </div>
        </>
      )}
    </form>
  );
};
