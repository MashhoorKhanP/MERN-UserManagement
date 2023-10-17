import { Container, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column shadow align-items-center hero-card bg-light w-75'>
          {userInfo ?
          <><h1 className='text-center mb-4'>Welcome back, {userInfo.name}</h1>
          <p className='text-center mb-4'>
            This is a boilerplate for MERN authentication that stores a JWT in
            an HTTP-Only cookie. It also uses Redux Toolkit and the React
            Bootstrap library
          </p>
          <img className='w-50 h-75' src='https://dresma.ai/wp-content/uploads/2022/01/mern-stack-developer.gif'/>
          </>
          :
          <>
          <h1 className='text-center mb-4'>MERN Authentication</h1>
          <p className='text-center mb-4'>
            This is a boilerplate for MERN authentication that stores a JWT in
            an HTTP-Only cookie. It also uses Redux Toolkit and the React
            Bootstrap library
          </p>
          <div className='d-flex'>
            <LinkContainer to='/login'>
            <Button variant='primary' className='me-3'>
              Sign In
            </Button>
            </LinkContainer>
            <LinkContainer to='/register'>
            <Button variant='secondary'>
              Register
            </Button>
            </LinkContainer>
          </div>
          </>
          
            }
          
        </Card>
      </Container>
    </div>
  );
};

export default Hero;