import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { useLoginMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import "../../src/styles/Validation.css";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const passwordStyles = {
    passwordInput: {
      position: "relative",
    },
    passwordToggle: {
      position: "absolute",
      top: "72%",
      transform: "translateY(-50%)",
      right: "10px",
      cursor: "pointer",
    },
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);
    if (email.trim().length === 0 || password.trim().length === 0) {
      toast.error("Fields can't be empty");
      if (email.trim().length === 0) setEmailError(true);
      if (password.trim().length === 0) setPasswordError(true);
    } else if (
      !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      toast.error("Please enter a valid email address!");
      setEmailError(true);
    } else {
      setEmailError(false);
      setPasswordError(false);
      try {
        const res = await login({ email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/");
      } catch (err) {
        toast.error(err.data.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address*</Form.Label>
          <Form.Control
            type="email"
            value={email}
            placeholder={emailError ? "Email is required" : "Enter Email"}
            onChange={(e) => setEmail(e.target.value)}
            className={emailError ? "red-border" : "green-border"}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <div style={passwordStyles.passwordInput}>
            <Form.Label>Password*</Form.Label>
            <Form.Control
              type={passwordVisible ? "text" : "password"}
              placeholder={
                passwordError ? "Password is required" : "Enter password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? "red-border" : "green-border"}
            ></Form.Control>{" "}
            <div
              style={passwordStyles.passwordToggle}
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? (
                <i className="bi bi-eye-slash-fill" id="password-toggle"></i>
              ) : (
                <i className="bi bi-eye-fill" id="password-toggle"></i>
              )}
            </div>
          </div>
        </Form.Group>
        {isLoading && <Loader />}
        <div className="text-center">
          <Button type="submit" className="mt-3 mt-3 bg-black w-75">
            Sign In
          </Button>

          <Row className="py-3">
            <Col>
              New User ? <Link to="/register">Register here</Link>
            </Col>
          </Row>
        </div>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;
