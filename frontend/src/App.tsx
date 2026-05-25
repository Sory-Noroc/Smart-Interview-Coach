import { Routes, Route } from 'react-router-dom'
import NavBar from "./components/NavBar/NavBar.tsx";
import LoginPage from './pages/Login/LoginPage';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<div className="p-8 text-center dark:text-white"><h1>Home Page Placeholder</h1></div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<div className="p-8 text-center dark:text-white"><h1>Register Page Placeholder</h1></div>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
