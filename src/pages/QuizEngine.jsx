import React, { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Check, X, Loader2, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import { useFetch } from '../hooks/useFetch';
import { useUser } from '../context/UserContext';

// ─────────────────────────────────────────────────────────────
// ÉTAT INITIAL
// ─────────────────────────────────────────────────────────────
const initialState = {
  status: 'idle',         // 'idle' | 'playing' | 'answered' | 'finished'
  currentIndex: 0,        // index de la question courante
  selectedOption: null,   // index de l'option sélectionnée
  score: 0,               // score temporaire en cours de partie
  timeLeft: 60,           // secondes restantes
  lastAnswerCorrect: null,
  pointsFxSeed: 0,
};

// ─────────────────────────────────────────────────────────────
// REDUCER — externe au composant (requis par le jalon)
// ─────────────────────────────────────────────────────────────
function quizReducer(state, action) {
  switch (action.type) {

    case 'START_QUIZ':
      return { ...initialState, status: 'playing' };

    case 'SELECT_OPTION':
      // Ignore si déjà répondu
      if (state.status !== 'playing') return state;
      return { ...state, selectedOption: action.payload };

    case 'ANSWER_QUESTION': {
      if (state.status !== 'playing' || state.selectedOption === null) return state;
      const isCorrect = state.selectedOption === action.payload.bonneReponse;
      return {
        ...state,
        status: 'answered',
        score: isCorrect ? state.score + 1000 : state.score,
        lastAnswerCorrect: isCorrect,
        pointsFxSeed: isCorrect ? state.pointsFxSeed + 1 : state.pointsFxSeed,
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= action.payload.total) {
        return { ...state, status: 'finished' };
      }
      return {
        ...state,
        status: 'playing',
        currentIndex: nextIndex,
        selectedOption: null,
        timeLeft: 60,
        lastAnswerCorrect: null,
      };
    }

    case 'TICK':
      if (state.timeLeft <= 1) return { ...state, timeLeft: 0 };
      return { ...state, timeLeft: state.timeLeft - 1 };

    case 'FINISH_QUIZ':
      return { ...state, status: 'finished' };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────────────────────
export default function QuizEngine() {
  const navigate = useNavigate();
  const { updateBestScore } = useUser();
  const { data: questions, loading, error } = useFetch('/questions.json');
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const { status, currentIndex, selectedOption, score, timeLeft, lastAnswerCorrect, pointsFxSeed } = state;

  // Démarre le quiz dès que les questions sont chargées
  useEffect(() => {
    if (questions && status === 'idle') {
      dispatch({ type: 'START_QUIZ' });
    }
  }, [questions, status]);

  // Chronomètre — sera migré vers useRef au Jalon 5
  useEffect(() => {
    if (status !== 'playing') return;
    if (timeLeft === 0) {
      dispatch({ type: 'FINISH_QUIZ' });
      return;
    }
    const timerId = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
    return () => clearInterval(timerId);
  }, [status, timeLeft]);

  // Redirige vers /resultats quand le quiz est terminé
  useEffect(() => {
    if (status === 'finished') {
      updateBestScore(score);
      navigate('/resultats', { state: { score, total: questions?.length || 0 } });
    }
  }, [status, score, questions, navigate, updateBestScore]);

  // Après affichage du feedback visuel, passe automatiquement à la question suivante
  useEffect(() => {
    if (!questions || status !== 'answered') return;
    const timeoutId = setTimeout(() => {
      dispatch({ type: 'NEXT_QUESTION', payload: { total: questions.length } });
    }, 900);
    return () => clearTimeout(timeoutId);
  }, [status, questions, currentIndex]);

  // ── États de chargement / erreur ──────────────────────────
  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: 'var(--apple-blue)' }} />
      </div>
    );
  }

  if (error || !questions) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--apple-red)' }}>
        <h2>Erreur : {error || 'Impossible de charger les questions.'}</h2>
      </div>
    );
  }

  const question = questions[currentIndex];
  const progressPercentage = (currentIndex / questions.length) * 100;

  const getOptionStatus = (idx) => {
    if (status !== 'answered') return 'default';
    if (idx === question.bonne_réponse) return 'correct';
    if (selectedOption === idx) return 'wrong';
    return 'default';
  };

  const getOptionStyle = (idx) => {
    if (status !== 'answered') return {};
    if (idx === question.bonne_réponse) {
      return {
        boxShadow: '0 0 0 2px var(--apple-green), 0 0 24px rgba(52, 199, 89, 0.65)',
      };
    }
    if (selectedOption === idx) {
      return {
        boxShadow: '0 0 0 2px var(--apple-red), 0 0 24px rgba(255, 59, 48, 0.55)',
      };
    }
    return {};
  };

  const handleSubmit = () => {
    if (status === 'playing' && selectedOption !== null) {
      dispatch({
        type: 'ANSWER_QUESTION',
        payload: { bonneReponse: question.bonne_réponse, total: questions.length },
      });
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes points-float-up {
          0% { opacity: 0; transform: translateY(0) scale(0.9); }
          10% { opacity: 1; transform: translateY(-6px) scale(1); }
          100% { opacity: 0; transform: translateY(-52px) scale(1.07); }
        }
      `}</style>

      {/* ── Barre de progression + timer + score live ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <div className="progress-container" style={{ marginBottom: 0 }}>
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>

        {/* Score en direct */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          color: 'var(--apple-blue)', fontWeight: 800, fontSize: '1rem',
          background: 'var(--apple-blue-light)',
          border: '1px solid var(--apple-blue)',
          borderRadius: '99px', padding: '4px 12px',
          whiteSpace: 'nowrap'
        }}>
          <Zap size={16} fill="var(--apple-blue)" />
          {score} pts
        </div>

        {/* Chronomètre */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: timeLeft <= 10 ? 'var(--apple-red)' : 'var(--apple-green)',
          fontWeight: 800, fontSize: '1.1rem',
          minWidth: '60px', justifyContent: 'flex-end'
        }}>
          <Timer size={20} />
          <span>0:{timeLeft.toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* ── Question ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Numéro + Catégorie */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem' }}>
            {currentIndex + 1}/{questions.length}
          </span>
          <div style={{
            background: 'var(--apple-purple)', padding: '4px 14px',
            borderRadius: '99px', fontSize: '0.85rem', fontWeight: 700,
            color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            {question.catégorie}
          </div>
        </div>

        {/* Libellé */}
        <h2 style={{ fontSize: '1.7rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>
          {question.libellé}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: 'auto' }}>
          {question.options.map((opt, idx) => (
            <Button
              key={idx}
              variant="secondary"
              selected={status === 'playing' && selectedOption === idx}
              status={getOptionStatus(idx)}
              style={{ position: 'relative', overflow: 'visible', ...getOptionStyle(idx) }}
              onClick={() => {
                if (status === 'playing') {
                  dispatch({ type: 'SELECT_OPTION', payload: idx });
                }
              }}
            >
              <span>{opt}</span>
              {status === 'answered' && idx === question.bonne_réponse && <Check color="var(--apple-green)" size={22} />}
              {status === 'answered' && selectedOption === idx && idx !== question.bonne_réponse && <X color="var(--apple-red)" size={22} />}
              {status === 'answered' && lastAnswerCorrect && idx === question.bonne_réponse && (
                <span
                  key={`${currentIndex}-${pointsFxSeed}`}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '-6px',
                    pointerEvents: 'none',
                    color: 'var(--apple-green)',
                    fontWeight: 900,
                    fontSize: '1rem',
                    textShadow: '0 2px 10px rgba(52, 199, 89, 0.5)',
                    animation: 'points-float-up 800ms ease-out forwards',
                  }}
                >
                  +1000 pts
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <Button
          variant="primary"
          disabled={selectedOption === null || status !== 'playing'}
          onClick={handleSubmit}
          status="default"
        >
          VÉRIFIER
        </Button>
      </div>

    </div>
  );
}
