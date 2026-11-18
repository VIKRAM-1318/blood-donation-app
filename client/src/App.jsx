import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FindDonors from './pages/FindDonors';
import BloodRequests from './pages/BloodRequests';
import CreateRequest from './pages/CreateRequest';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/find-donors" element={<FindDonors />} />
      <Route path="/donors" element={<FindDonors />} />
      <Route path="/blood-requests" element={<BloodRequests />} />
      <Route path="/requests" element={<BloodRequests />} />
      <Route path="/create-request" element={<CreateRequest />} />
      <Route path="/requests/new" element={<CreateRequest />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
