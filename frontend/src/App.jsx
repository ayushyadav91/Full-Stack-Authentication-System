import { Routes, Route } from "react-router-dom";
import { Layout } from './Layout';
import { AuthLayout } from './pages/auth/AuthLayout';
import { Login } from './pages/auth/login';
import { Register } from './pages/auth/Register';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="auth" element={<AuthLayout />}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
    