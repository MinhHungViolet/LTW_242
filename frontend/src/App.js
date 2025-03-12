import './App.css';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import Navbar from './Layout/Navbar';
import ProductList from './Product/ProductList';

function App() {
  return (
    <>
      <Header></Header>
      <Navbar></Navbar>
      <ProductList></ProductList>
      
      <Footer></Footer>
    </>
  )
}

export default App;
