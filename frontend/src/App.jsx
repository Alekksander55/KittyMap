import Header from "./components/Header.jsx"
import { Container, Toast } from 'react-bootstrap';
import { Outlet } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import { ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const App = () => {


  return (
    <>
      <Header/>
      <ToastContainer/>
      <Container className="my-2">
        <Outlet/>
      </Container>
    </>
  )
}

export default App
