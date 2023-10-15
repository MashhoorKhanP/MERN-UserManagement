import {useState,useEffect} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {Form, Button, Row, Col} from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import {toast} from 'react-toastify';
import Loader from '../components/Loader';
import { setCredentials } from '../slices/authSlice';
import { useRegisterMutation } from '../slices/userApiSlice';
import './Validation.css';
const RegisterScreen = () => {
  const [name,setName] = useState('')
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmpasswordError, setConfirmPasswordError] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {userInfo} = useSelector((state) => state.auth);
  const [register, {isLoading}] = useRegisterMutation();

  useEffect(() =>{
    if(userInfo){
      navigate('/')
    }
  },[navigate,userInfo])

  const submitHandler = async (e) =>{
    e.preventDefault();
    setNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    if(name.trim().length ===0 || email.trim().length ===0 || password.trim().length ===0){
      toast.error("Fields can't be empty")
      if (name.trim().length === 0) setNameError(true);
      if (email.trim().length === 0) setEmailError(true);
      if (password.trim().length === 0) setPasswordError(true);
      if (confirmPassword.trim().length === 0) setConfirmPasswordError(true);
    }else if(!name.match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)){
      toast.error("Please enter a valid name!");
      setNameError(true);
    }else if(!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)){
      toast.error("Please enter a valid email address!")
      setEmailError(true);
    }else if(password !== confirmPassword){
      toast.error('Passwords do not match');
      setConfirmPasswordError(true);
    }else{
      setNameError(false);
      setEmailError(false);
      setPasswordError(false);
      setConfirmPasswordError(false);
      try{
        const res = await register({ name,email,password}).unwrap();
        dispatch(setCredentials({...res}))
        navigate('/')
      }catch(err){
        toast.error(err.data.message || err.error);
      }
    }
  }
  
  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
      <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            value={name}
            placeholder={nameError?'Name is required':'Enter Name'}
            onChange={(e) => setName(e.target.value)}
            className={nameError ? 'red-border' : 'green-border'}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder={emailError?'Email is required':'Enter Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={emailError ? 'red-border' : 'green-border'}

          ></Form.Control>
        </Form.Group>
        
        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder={passwordError?'Password is required':'Enter password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={passwordError ? 'red-border' : 'green-border'}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder={confirmpasswordError?'Confirm your password':'Confirm Password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={confirmpasswordError ? 'red-border' : 'green-border'}
          ></Form.Control>
        </Form.Group>
        {isLoading && <Loader/>}
        <Button type='submit' variant='primary' className='mt-3' >
          Sign Up 
        </Button>
        
        <Row className='py-3'>
          <Col>
            Already have an account? <Link to='/login'>Login here</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  )
}

export default RegisterScreen;