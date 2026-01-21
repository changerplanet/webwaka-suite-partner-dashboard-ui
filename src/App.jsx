import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <h2>WebWaka Suite</h2>
          <span>Partner Dashboard</span>
        </div>
        <nav className="nav">
          <button 
            className={activeTab === 'overview' ? 'active' : ''} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'analytics' ? 'active' : ''} 
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''} 
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </aside>
      <main className="main-content">
        <header className="header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        </header>
        <div className="content">
          {activeTab === 'overview' && (
            <div className="cards">
              <div className="card">
                <h3>Total Partners</h3>
                <p className="stat">24</p>
              </div>
              <div className="card">
                <h3>Active Sessions</h3>
                <p className="stat">128</p>
              </div>
              <div className="card">
                <h3>Revenue</h3>
                <p className="stat">$12,450</p>
              </div>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="placeholder">
              <p>Analytics dashboard coming soon...</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="placeholder">
              <p>Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
