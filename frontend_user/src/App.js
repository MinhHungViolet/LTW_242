import './App.css';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import Navbar from './Layout/Navbar';
import ThemeRoutes from './Routes/index.js';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header></Header>
        <Navbar></Navbar>
        <ThemeRoutes></ThemeRoutes>
        <Footer></Footer>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
