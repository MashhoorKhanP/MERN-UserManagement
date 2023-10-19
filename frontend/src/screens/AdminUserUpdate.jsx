import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useGetUpdateUserMutation, useUpdateUserDataMutation } from "../slices/adminApiSlice";
import avatar from '../assets/profile.png';
import styles from '../styles/Profile.module.css'
import { useNavigate, useParams } from "react-router-dom";


const AdminUserUpdate = () => {
  const {id } = useParams();
  const [userData,setUserData] = useState();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image,setImage] = useState(null);

  const navigate = useNavigate();
  
  const [getUpdateUser] = useGetUpdateUserMutation();
  const [UpdateUserData,{isLoading}] = useUpdateUserDataMutation();
  
  const formData = new FormData();
  formData.append("_id",id);
  formData.append("name",name);
  formData.append("email",email);
  formData.append("file",image);

  useEffect(() => {
    async function fetchUser(id){
      const res = await getUpdateUser(id);
      const data = res.data;
      setUserData(data);
      setName(data.name);
      setEmail(data.email);
    }
    fetchUser(id);
  }, [id,getUpdateUser]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if(name.trim().length ===0 || email.trim().length ===0){
      toast.error("Fields can't be empty")
    }else if(!name.match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)){
      toast.error("Please enter a valid name!");
    }else if(!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)){
      toast.error("Please enter a valid email address!")
    } else {
      try {
       
        await UpdateUserData(formData).unwrap('');
        toast.success('Profile updated');
        navigate('/admin/users');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Update User</h1>
      <Form onSubmit={submitHandler}>
      <Form.Group className="my-2" controlId="name">
          <div className="profile flex text-center py-2">
          <Form.Label className="fw-bold">Profile Image</Form.Label><br/>
            <img src={userData?.imageUrl?userData?.imageUrl:avatar} className={styles.profile_img} alt="avatar"></img>
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

export default AdminUserUpdate;
