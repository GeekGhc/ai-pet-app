import { PetDisplay } from './components/PetDisplay';
import { ChatPanel } from './components/ChatPanel';
import { StatsPanel } from './components/StatsPanel';
import { AppProvider, useApp } from './context/AppContext';
import './styles/global.css';

function AppContent() {
  const { state } = useApp();
  
  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <svg className="logo-icon" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="#6C5CE7"/>
            <circle cx="16" cy="18" r="3" fill="white"/>
            <circle cx="24" cy="18" r="3" fill="white"/>
            <path d="M14 26 Q20 32 26 26" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          <span>学习精灵</span>
        </div>
        
        {state.pet && (
          <div className="pet-info">
            <span className="pet-name">{state.pet.name}</span>
            <div className="energy-display">
              <span className="energy-icon">⚡</span>
              <span>{state.pet.evolutionEnergy}</span>
            </div>
          </div>
        )}
      </header>
      
      <main className="main-content">
        <section className="pet-section">
          <PetDisplay />
        </section>
        
        <aside className="chat-section">
          <ChatPanel />
        </aside>
        
        <aside className="stats-section">
          <StatsPanel />
        </aside>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}