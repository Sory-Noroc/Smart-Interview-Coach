import { Routes, Route } from 'react-router-dom'
import NavBar from "./components/NavBar/NavBar.tsx";
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import VerifyPage from './pages/Verify/VerifyPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import HomePage from './pages/Home/HomePage';
import DemoPage from './pages/Demo/DemoPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import InterviewPage from './pages/Interview/InterviewPage';
import ProfilePage from './pages/Profile/ProfilePage';
import MyInterviewsPage from './pages/MyInterviews/MyInterviewsPage';
import AdminPage from './pages/Admin/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-interviews" 
            element={
              <ProtectedRoute>
                <MyInterviewsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/interview/:interviewId" 
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
