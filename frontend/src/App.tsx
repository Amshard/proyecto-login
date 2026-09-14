import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import CatalogoDescansos from './pages/Catalogos/CatalogoDescansos';
import CatalogoEstaciones from './pages/Catalogos/CatalogoEstaciones';
import CatalogoPermanencias from './pages/Catalogos/CatalogoPermanencias';
import CatalogoPersonal from './pages/Catalogos/CatalogoPersonal';
import ChangePassword from './pages/Login/ChangePassword';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';
import SectionPage from './pages/SectionPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cambio-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/catalogos/permanencias"
        element={
          <ProtectedRoute>
            <CatalogoPermanencias />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/catalogos/estaciones"
        element={
          <ProtectedRoute>
            <CatalogoEstaciones />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/catalogos/descansos"
        element={
          <ProtectedRoute>
            <CatalogoDescansos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/catalogos/personal-de-taquilla"
        element={
          <ProtectedRoute>
            <CatalogoPersonal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:section/:item"
        element={
          <ProtectedRoute>
            <SectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:section/:group/:item"
        element={
          <ProtectedRoute>
            <SectionPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
