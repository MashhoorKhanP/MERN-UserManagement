import { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import { useGetUsersDataMutation,useDeleteUserMutation } from "../slices/adminApiSlice";
import { FaTrash } from "react-icons/fa";

import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const UsersListScreen = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userId,setUserId] = useState(null);
  const [data, setData] = useState(true);

  const [getUsersData, { isLoading }] = useGetUsersDataMutation();
  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    async function fetchUser() {
      const res = await getUsersData().unwrap("");
      setUsers(res.user);
    }
    fetchUser();
  }, [data, getUsersData]);

  const filteredUsers = users.filter((user) => {
    const userName = user.name.toLowerCase();
    const userEmail = user.email;
    const searchValue = search.toLowerCase();
    return (userName.includes(searchValue),userEmail.includes(searchValue));
  });

  const handleDelete = async() => {
    if(userId){
      console.log(userId,'userlistscreenHandleDelete')
      await deleteUser(userId).unwrap(''); 
      setData(prevData => !prevData) ;
      setUserId(null);
      setShowModal(false);
    }
  }

  const handleDeleteClick = (userId) => {
    setUserId(userId)
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setUserId(null);
    setShowModal(false);
  };

  return (
    <Container>
      <Form.Group
        className="mt-3 mt-5 d-flex align-items-center"
        controlId="searchForm"
      >
        <Form.Label className="me-2 mt-1">Search:</Form.Label>
        <Form.Control
          style={{ width: "30vw" }}
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/admin/users/add-user">
          <Button className="bg-black border-black ms-2 rounded-0 fw-bold ml-auto">
            ADD USER <i className="bi bi-plus-lg"></i>
          </Button>
        </Link>
      </Form.Group>
      {isLoading && <Loader />}
      <div className="table-responsive">
        <Table bordered hover className="mt-5 text-center align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="profile-image">
                      <img
                        src={user.imageUrl}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          display: "inline-block",
                          marginTop: "10px",
                        }}
                        alt={user.name}
                      />
                    </div>
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button
                      className="btn-danger"
                      title="Delete"
                      onClick={() => handleDeleteClick(user._id)}
                    >
                      <FaTrash />
                    </Button>
                    <Link>
                      <Button className="btn-success ms-2">Update</Button>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="danger" onClick={()=>handleDelete()}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default UsersListScreen;
