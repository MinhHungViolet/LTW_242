import './App.css';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import Navbar from './Layout/Navbar';
import ProductList from './Product/ProductList';
import Purchase from './Product/Purchase';

function App() {
  return (
    <>
      <Header></Header>
      <Navbar></Navbar>
      <Purchase></Purchase>
      
      <Footer></Footer>
    </>
  )
}

export default App;
