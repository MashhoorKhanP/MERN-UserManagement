import { Navbar, Nav, Container, NavDropdown} from "react-bootstrap";
import { FaSignInAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useAdminLogoutMutation } from "../slices/adminApiSlice";
import { adminlogout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const { adminInfo } = useSelector((state) => state.auth);
  console.log(adminInfo,'adminInfo')
  const [adminLogoutApiCall] = useAdminLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      await adminLogoutApiCall().unwrap();
      dispatch(adminlogout());
      navigate("/admin");
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <header>
     <Navbar bg="" className="border-bottom" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="fw-bold">MERN USERMANAGEMENT S/M <h4 className="fw-light">ADMIN</h4> </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
            {adminInfo ? (
                <>
                  <NavDropdown title={adminInfo.email} id="admin_email">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item className="text-danger" onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/admin/login">
                    <Nav.Link>
                      <FaSignInAlt /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default AdminHeader;
