// client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import StudentProfile from './pages/StudentProfile';
import DiscoveryResults from './pages/DiscoveryResults';
import GraphExplorer from './pages/GraphExplorer';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Dashboard />} />
        <Route path="/profile"  element={<StudentProfile />} />
        <Route path="/discover" element={<DiscoveryResults />} />
        <Route path="/explorer" element={<GraphExplorer />} />
      </Routes>
    </BrowserRouter>
  );
}
