import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { useAdminLoginMutation } from "../slices/adminApiSlice";
import { setAdminCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import "../../src/styles/Validation.css";

const AdminLoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useAdminLoginMutation();

  const { adminInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (adminInfo) {
      navigate("/admin");
    }
  }, [navigate, adminInfo]);
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
        console.log(res, "resposnesfs");
        dispatch(setAdminCredentials({ ...res }));
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
          <Form.Label>Password*</Form.Label>
          <Form.Control
            type="password"
            placeholder={
              passwordError ? "Password is required" : "Enter password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={passwordError ? "red-border" : "green-border"}
          ></Form.Control>
        </Form.Group>
        {isLoading && <Loader />}
        <div className="text-center">
          <Button type="submit" className="mt-3 mt-3 bg-black w-75">
            Sign In
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default AdminLoginScreen;
