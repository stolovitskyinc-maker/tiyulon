import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TrailList from './pages/TrailList';
import TrailDetail from './pages/TrailDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TrailList />} />
        <Route path="/trails/:id" element={<TrailDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;