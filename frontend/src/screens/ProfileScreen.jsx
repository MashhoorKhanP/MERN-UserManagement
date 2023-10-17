import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { setCredentials } from "../slices/authSlice";
import { useUpdateUserMutation } from "../slices/userApiSlice";
import avatar from '../assets/profile.png';
import styles from '../styles/Profile.module.css'
import { useNavigate } from "react-router-dom";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image,setImage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const [UpdateProfile, {isLoading}] = useUpdateUserMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if(name.trim().length ===0 || email.trim().length ===0 || password.trim().length ===0){
      toast.error("Fields can't be empty")
    }else if(!name.match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)){
      toast.error("Please enter a valid name!");
    }else if(!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)){
      toast.error("Please enter a valid email address!")
    }else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const formData = new FormData();
        formData.append("_id",userInfo._id);
        formData.append("name",name);
        formData.append("email",email);
        formData.append("password",password);
        formData.append("file",image);
        const res = await UpdateProfile(formData).unwrap();
        dispatch(setCredentials({...res}));
        toast.success('Profile updated');
        navigate('/');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Update Profile</h1>
      <Form onSubmit={submitHandler}>
      <Form.Group className="my-2" controlId="name">
          <div className="profile flex text-center py-2">
          <Form.Label className="fw-bold">Profile Image</Form.Label><br/>
            <img src={userInfo.imageUrl?userInfo.imageUrl:avatar} className={styles.profile_img} alt="avatar"></img>
          <Form.Control
            className="my-3"
            type="file"
            accept="image/*"
            id="profile"
            name="profile"
            placeholder="Enter Name"
            onChange={(e) => setImage(e.target.files[0])}
            ></Form.Control>
            </div>
        </Form.Group>

        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name*</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address*</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password*</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password*</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {isLoading && <Loader/>}
        <div className='text-center'>
        <Button type="submit" className="mt-3 bg-black w-75">
          Update
        </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;
