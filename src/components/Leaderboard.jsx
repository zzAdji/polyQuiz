import React, { useMemo } from 'react';
import { Trophy, X } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Leaderboard({ onClose }) {
  const { pseudo, bestScore } = useUser();
  const staticLeaderboard = [
    { name: 'Faker', score: 9800, isCurrentUser: false },
    { name: 'S1mple', score: 8500, isCurrentUser: false },
    { name: 'ZywOo', score: 8100, isCurrentUser: false },
    { name: 'TenZ', score: 7200, isCurrentUser: false },
    { name: 'Caps', score: 6900, isCurrentUser: false },
  ];

  const leaderboardData = useMemo(() => {
    const list = [...staticLeaderboard];
    const hasPlayableUser = Boolean(pseudo);
    const sanitizedScore = Number.isFinite(bestScore) ? Math.max(0, bestScore) : 0;

    if (hasPlayableUser) {
      const existingIndex = list.findIndex(
        (player) => player.name.toLowerCase() === pseudo.toLowerCase()
      );

      if (existingIndex >= 0) {
        list[existingIndex] = {
          ...list[existingIndex],
          score: Math.max(list[existingIndex].score, sanitizedScore),
          isCurrentUser: true,
          name: pseudo,
        };
      } else {
        list.push({ name: pseudo, score: sanitizedScore, isCurrentUser: true });
      }
    }

    return list
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({ ...player, rank: index + 1 }));
  }, [pseudo, bestScore]);

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{
      background: 'var(--surface-color)',
      borderRadius: '24px',
      padding: '24px',
      border: '1px solid var(--border-color)',
      position: 'relative',
      width: '100%',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
    }}>
      {onClose && (
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={24} />
        </button>
      )}

      <h2 style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', 
        fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-primary)',
        justifyContent: 'center'
      }}>
        <Trophy size={28} color="#FFD700" /> 
        Classement Global
      </h2>
      
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {leaderboardData.map((player) => (
          <li key={`${player.name}-${player.rank}`} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            background: player.isCurrentUser ? 'var(--apple-blue-light)' : 'var(--bg-color)',
            borderRadius: '16px',
            border: player.isCurrentUser ? '2px solid var(--apple-blue)' : '1px solid var(--border-color)',
            boxShadow: player.isCurrentUser ? '0 0 20px rgba(0, 122, 255, 0.22)' : 'none',
            fontWeight: 600
          }}>
            <span style={{ 
              fontSize: '1.2rem', 
              color: getRankColor(player.rank),
              width: '32px',
              fontWeight: 700
            }}>
              #{player.rank}
            </span>
            <span style={{ flex: 1, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {player.name}
              {player.isCurrentUser && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#fff',
                  background: 'var(--apple-blue)',
                  borderRadius: '999px',
                  padding: '2px 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Vous
                </span>
              )}
            </span>
            <span style={{ color: 'var(--apple-blue)', fontWeight: 700 }}>{player.score.toLocaleString()} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
