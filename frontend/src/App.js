import './App.css';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import Navbar from './Layout/Navbar';
// import ProductList from './Product/ProductList';
// import Purchase from './Product/Purchase';
import ThemeRoutes from './Routes/index.js';
import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Navbar></Navbar>
      <ThemeRoutes></ThemeRoutes>
      <Footer></Footer>
    </BrowserRouter>
  )
}

export default App;
