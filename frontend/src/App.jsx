import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AnimatedBackground from './components/AnimatedBackground';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Enrollments from './pages/Enrollments';

function App() {
  return (
    <ThemeProvider>
      <div 
        className="min-h-screen flex relative transition-colors duration-300"
        style={{ background: 'var(--bg-primary)' }}
      >
        <AnimatedBackground />
        <Sidebar />
        
        {/* Main content with dynamic margin based on sidebar width */}
        <main className="flex-1 transition-all duration-300 ease-in-out">
          {/* Responsive padding that accounts for sidebar */}
          <div className="ml-72 min-h-screen p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/enrollments" element={<Enrollments />} />
            </Routes>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
