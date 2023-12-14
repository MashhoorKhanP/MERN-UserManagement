import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { setCredentials } from "../slices/authSlice";
import { useRegisterMutation } from "../slices/userApiSlice";
import "../../src/styles/Validation.css";
const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmpasswordError, setConfirmPasswordError] = useState(false);
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

  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const isStrongPassword = (password) => {
    const rules = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      digit: /\d/.test(password),
      specialCharacter: /[\W_]/.test(password),
    };

    return rules;
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const passwordRules = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        digit: /\d/.test(password),
        specialCharacter: /[\W_]/.test(password),
      };
    
      if (!Object.values(passwordRules).every((rule) => rule)) {
        toast.error('Enter a strong password.');
        return;
      }
    setNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    if (
      name.trim().length === 0 ||
      email.trim().length === 0 ||
      password.trim().length === 0
    ) {
      toast.error("Fields can't be empty");
      if (name.trim().length === 0) setNameError(true);
      if (email.trim().length === 0) setEmailError(true);
      if (password.trim().length === 0) setPasswordError(true);
      if (confirmPassword.trim().length === 0) setConfirmPasswordError(true);
    } else if (!name.match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)) {
      toast.error("Please enter a valid name!");
      setNameError(true);
    } else if (
      !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      toast.error("Please enter a valid email address!");
      setEmailError(true);
    } else if (confirmPassword.trim().length === 0) {
      toast.error("Confirm your password");
      setConfirmPasswordError(true);
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setConfirmPasswordError(true);
    } else {
      setNameError(false);
      setEmailError(false);
      setPasswordError(false);
      setConfirmPasswordError(false);
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/");
      } catch (err) {
        toast.error(err.data.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name*</Form.Label>
          <Form.Control
            type="text"
            value={name}
            placeholder={nameError ? "Name is required" : "Enter Name"}
            onChange={(e) => setName(e.target.value)}
            className={nameError ? "red-border" : "green-border"}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address*</Form.Label>
          <Form.Control
            type="email"
            placeholder={emailError ? "Email is required" : "Enter Email"}
            value={email}
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
          <div className="password-strength">
            {password.length >= 1 && (
              <div
                className={`strength-rule ${
                  isStrongPassword(password).length ? "valid" : ""
                }`}
              >
                {isStrongPassword(password).length ? (
                  <span role="img" aria-label="check" className="valid">
                    <i className="bi bi-check"></i>
                  </span>
                ) : (
                  <span role="img" aria-label="cross">
                    <i className="bi bi-x"></i>
                  </span>
                )}
                At least 8 characters
              </div>
            )}

            {password.length >= 1 && (
              <div
                className={`strength-rule ${
                  isStrongPassword(password).lowercase ? "valid" : ""
                }`}
              >
                {isStrongPassword(password).lowercase ? (
                  <span role="img" aria-label="check" className="valid">
                    <i className="bi bi-check"></i>
                  </span>
                ) : (
                  <span role="img" aria-label="cross">
                    <i className="bi bi-x"></i>
                  </span>
                )}
                At least one lowercase letter
              </div>
            )}

            {password.length >= 1 && (
              <div
                className={`strength-rule ${
                  isStrongPassword(password).uppercase ? "valid" : ""
                }`}
              >
                {isStrongPassword(password).uppercase ? (
                  <span role="img" aria-label="check" className="valid">
                    <i className="bi bi-check"></i>
                  </span>
                ) : (
                  <span role="img" aria-label="cross">
                    <i className="bi bi-x"></i>
                  </span>
                )}
                At least one uppercase letter
              </div>
            )}

            {password.length >= 1 && (
              <div
                className={`strength-rule ${
                  isStrongPassword(password).digit ? "valid" : ""
                }`}
              >
                {isStrongPassword(password).digit ? (
                  <span role="img" aria-label="check" className="valid">
                    <i className="bi bi-check"></i>
                  </span>
                ) : (
                  <span role="img" aria-label="cross">
                    <i className="bi bi-x"></i>
                  </span>
                )}
                At least one digit
              </div>
            )}

            {password.length >= 1 && (
              <div
                className={`strength-rule ${
                  isStrongPassword(password).specialCharacter ? "valid" : ""
                }`}
              >
                {isStrongPassword(password).specialCharacter ? (
                  <span role="img" aria-label="check" className="valid">
                    <i className="bi bi-check"></i>
                  </span>
                ) : (
                  <span role="img" aria-label="cross">
                    <i className="bi bi-x"></i>
                  </span>
                )}
                At least one special character
              </div>
            )}
          </div>
        </Form.Group>

        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password*</Form.Label>
          <Form.Control
            type="password"
            placeholder={
              confirmpasswordError
                ? "Confirm your password"
                : "Confirm Password"
            }
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={confirmpasswordError ? "red-border" : "green-border"}
          ></Form.Control>
        </Form.Group>
        {isLoading && <Loader />}
        <div className="text-center">
          <Button type="submit" className="mt-3 bg-black w-75">
            Sign Up
          </Button>

          <Row className="py-3">
            <Col>
              Already have an account? <Link to="/login">Login here</Link>
            </Col>
          </Row>
        </div>
      </Form>
    </FormContainer>
  );
};

export default RegisterScreen;
