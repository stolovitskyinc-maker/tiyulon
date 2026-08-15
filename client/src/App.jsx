import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import TrailList from './pages/TrailList';
import TrailDetail from './pages/TrailDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
// ...
<Route path="/contact" element={<Contact />} />

function AppRoutes() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div style={{ position: 'relative', paddingTop: isHome ? 0 : '90px', minHeight: '70vh' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trails" element={<TrailList />} />
        <Route path="/trails/:id" element={<TrailDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;