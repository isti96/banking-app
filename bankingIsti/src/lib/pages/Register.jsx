import "../../App.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Register.css";
import axios from "axios";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.13.1/cdn/"
);

const BASE_URL = "https://banking-app-6rvo.onrender.com";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function validateForm() {
    return (
      email.length > 0 &&
      password.length > 0 &&
      retypePassword.length > 0 &&
      name.length > 0 &&
      password == retypePassword
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await axios
      .post(`${BASE_URL}/register`, {
        email: email,
        password: password,
        displayName: name,
        created: new Date().toISOString(),
      })
      .then((res) => {
        navigate("/");
      })
      .catch((err) => setError(err.response.data));
  }

  return (
    <>
      <div className="register">
        <div className="message">Welcome aboard!</div>
        <Form onSubmit={handleSubmit} className="labels">
          {error && <div className="error-message">{error}</div>}
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
          <Form.Group size="lg" controlId="name" className="labels">
            <div className="label-control">
              <Form.Label className="label">Name</Form.Label>
              <Form.Control
                autoFocus
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
          <Form.Group size="lg" controlId="retypepassword">
            <div className="label-control">
              <Form.Label className="label">Re-type Password</Form.Label>
              <Form.Control
                type="password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
              />
            </div>
          </Form.Group>

          <div className="buttons">
            <Button size="lg" type="button" onClick={() => navigate("/login")}>
              Go back to Login
            </Button>
            <Button size="lg" type="submit" disabled={!validateForm()}>
              Register
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default Register;
