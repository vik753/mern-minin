import { useState, useEffect, useContext } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const { loading, request, error, clearError } = useHttp();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message]);

  useEffect(() => {
    window.M && window.M.updateTextFields()
  }, [])

  const changeHandler = (e) => {
    setForm((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const registerHandler = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });
      message(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const loginHandler = async () => {
    try {
      const data = await request("/api/auth/login", "POST", { ...form });
      auth.login(data.token, data.userId)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row">
      <div className="col s10 offset-s1 l8 offset-l2">
        <h1>Cut the link</h1>
        <div className="card brown lighten-4">
          <div className="card-content">
            <span className="card-title" style={{ marginBottom: "3.5rem" }}>
              Authorization
            </span>
            <div>
              <div className="input-field">
                <input
                  placeholder="Type your email"
                  id="email"
                  name="email"
                  type="text"
                  onChange={changeHandler}
                  value={form.email}
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Type your password"
                  id="password"
                  name="password"
                  type="password"
                  onChange={changeHandler}
                  value={form.password}
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn teal lighten-3 m1"
              style={{ marginRight: "10px" }}
              disabled={loading}
              onClick={loginHandler}
            >
              Login
            </button>
            <button
              className="btn  brown lighten-2"
              disabled={loading}
              onClick={registerHandler}
            >
              Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
