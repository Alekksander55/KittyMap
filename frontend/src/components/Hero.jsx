import { Container, Card, Button } from 'react-bootstrap';
import catLogo from '../assets/kittylogo.jpg'

const Hero = () => {
  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
          <h1 className='text-center mb-4'>Welcome to the KittyMap</h1>
          <p className='text-center mb-4'>
            Discover all the nice cats around you and everywhere in the world ! If you dont have an account you can register, else let's Sign in !
            Click on the menu to start !
            </p>
            <img src={catLogo} style={{height:'300px', borderRadius:'150px'}}/>
          

        </Card>
      </Container>
    </div>
  );
};

export default Hero;