import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Results from './pages/Results';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/resultats" element={<Results />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
