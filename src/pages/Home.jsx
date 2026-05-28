import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, User, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Leaderboard from '../components/Leaderboard';

export default function Home() {
  const [pseudo, setPseudo] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    if (pseudo.trim()) {
      navigate('/quiz');
    }
  };

  const top3 = [
    { rank: 1, name: 'Faker', score: 9800 },
    { rank: 2, name: 'S1mple', score: 8500 },
    { rank: 3, name: 'ZywOo', score: 8100 }
  ];

  if (showLeaderboard) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '32px' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-1.5px' }}>PolyQuiz</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 500 }}>Apprends en t'amusant.</p>
      </div>

      <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input 
          icon={User}
          type="text" 
          placeholder="Entrez votre pseudo..." 
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          required
        />
        
        <Button 
          type="submit" 
          variant="primary" 
          disabled={!pseudo.trim()}
          style={{ marginTop: '8px' }}
        >
          COMMENCER
        </Button>
      </form>

      {/* Leaderboard Preview */}
      <div style={{ 
        background: 'var(--surface-color)', 
        borderRadius: '24px', 
        padding: '24px', 
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 700 }}>
          <Trophy size={20} color="#FFD700" />
          <span>Top 3 Mondial</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {top3.map(player => (
            <div key={player.rank} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ 
                  color: player.rank === 1 ? '#FFD700' : player.rank === 2 ? '#C0C0C0' : '#CD7F32',
                  fontWeight: 800, width: '20px'
                }}>#{player.rank}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{player.name}</span>
              </div>
              <span style={{ color: 'var(--apple-blue)', fontWeight: 700 }}>{player.score} pts</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setShowLeaderboard(true)}
          style={{ 
            background: 'none', border: 'none', color: 'var(--apple-blue)', 
            fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '4px', marginTop: '8px', cursor: 'pointer', fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        >
          Voir tout le classement
          <ChevronRight size={18} />
        </button>
      </div>

    </div>
  );
}
