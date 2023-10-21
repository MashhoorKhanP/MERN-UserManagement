import { Card, Container } from "react-bootstrap";

const AdminHomeScreen = () => {
  return (
    <div className=" py-5">
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column shadow align-items-center hero-card bg-light w-75">
          <h1 className="text-center mb-4">Welcome Admin</h1>
          <p className="text-center mb-4">
            This is a boilerplate for MERN authentication that stores a JWT in
            an HTTP-Only cookie. It also uses Redux Toolkit and the React
            Bootstrap library
          </p>
          <img
            className="w-50 h-75"
            src="https://cdn.dribbble.com/users/76502/screenshots/5251755/jet_animation.gif"
          />
        </Card>
      </Container>
    </div>
  );
};
export default AdminHomeScreen;
