import React from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useTheme } from '../hooks/useTheme';

export default function MainLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="app-container">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        marginBottom: '24px'
      }}>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </header>
      
      {/* 
        The key={location.pathname} ensures that the div remounts on route change,
        triggering the CSS animation (page-transition) every time we navigate.
      */}
      <main key={location.pathname} className="page-transition" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  );
}
