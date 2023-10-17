import { Button, Container, Form, Table } from "react-bootstrap"
import { useGetUsersDataMutation } from "../slices/adminApiSlice"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Loader from "../components/Loader"


const UsersListScreen = () => {
  const [users,setUsers] = useState([]);
  const [search,setSearch] = useState('');
  const [data,setData] = useState(true);

  const [getUsersData,{isLoading}] = useGetUsersDataMutation();
  
  useEffect(() => {
    async function fetchUser(){
      const res = await getUsersData().unwrap("");
      console.log(res,'usersrsss');
      setUsers(res.user);
    }
    fetchUser();
  },[data,getUsersData]);

  const filteredUsers = users.filter(user => {
    const userName = user.name.toLowerCase();
    const searchValue = search.toLowerCase();
    return userName.includes(searchValue);
  });

  return (
    <Container>
       <Form.Group className="mt-3 mt-5 d-flex align-items-center" controlId="searchForm">
                <Form.Label className="me-3">Search:</Form.Label>
                <Form.Control
                    style={{ width: "30vw", marginBottom: "10px" }}
                    type="text"
                    placeholder="Search"
                    value = {search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Form.Group>
            <Link to=''><Button className="bg-black rounded-0 mt-4 fw-bold">
                ADD USER <i className="bi bi-plus-lg"></i></Button></Link>
            {isLoading && <Loader />}
            <div className="table-responsive">

                <Table striped bordered hover className="mt-5">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Delete</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users &&
                        filteredUsers.map((user,index) => (
                          <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <Button className="btn-danger" >Delete</Button>
                                    </td>
                                    <td>
                                        <Link><Button className="btn-success">Update</Button></Link>
                                    </td>
                                </tr>
                        ))
                        }
                    </tbody>

                </Table>

            </div>
    </Container>
  )
}

export default UsersListScreen