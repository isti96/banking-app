import "../../App.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.13.1/cdn/"
);

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <>
      <div className="login">
        <div className="message-login">Welcome back!</div>
        <Form onSubmit={handleSubmit} className="labels">
          <Form.Group size="lg" controlId="email" className="labels">
            <div className="label-control">
              <Form.Label className="label">Email</Form.Label>
              <Form.Control
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Form.Group>

          <Form.Group size="lg" controlId="password">
            <div className="label-control">
              <Form.Label className="label">Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </Form.Group>

          <div className="buttons">
            <Button
              size="lg"
              type="submit"
              disabled={!validateForm()}
              onClick={() => navigate("/")}
            >
              Login
            </Button>
            <Button
              size="lg"
              type="submit"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default Login;
