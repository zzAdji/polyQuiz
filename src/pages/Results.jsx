import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Trophy, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import Leaderboard from '../components/Leaderboard';

export default function Results() {
  const navigate = useNavigate();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Mock data
  const score = 8500;
  const ratio = 80; // 8/10
  
  if (showLeaderboard) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '32px' }}>
      
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Leçon Complétée !</h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Tu as fait un super travail.</p>
      </div>

      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', 
        width: '100%', padding: '40px 24px', background: 'var(--surface-color)',
        borderRadius: '24px', border: '1px solid var(--border-color)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        
        <div style={{ textAlign: 'center' }}>
          <Award size={64} color="var(--apple-green)" style={{ marginBottom: '16px' }} />
          <div style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1', letterSpacing: '-2px' }}>
            {score}
          </div>
          <div style={{ color: 'var(--apple-green)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '8px' }}>
            Points
          </div>
        </div>

        <div style={{ 
          background: 'var(--bg-color)', padding: '16px', borderRadius: '16px', 
          width: '100%', display: 'flex', justifyContent: 'space-around', border: '1px solid var(--border-color)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--apple-blue)' }}>{ratio}%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Précision</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--apple-purple)' }}>0:45</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Temps moyen</div>
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <Button 
          variant="secondary" 
          onClick={() => setShowLeaderboard(true)}
          style={{ justifyContent: 'center', color: 'var(--apple-purple)' }}
        >
          <Trophy size={24} />
          Classement Global
        </Button>

        <Button 
          variant="primary" 
          onClick={() => navigate('/')}
        >
          <Home size={24} />
          RETOUR À L'ACCUEIL
        </Button>
      </div>
      
    </div>
  );
}
