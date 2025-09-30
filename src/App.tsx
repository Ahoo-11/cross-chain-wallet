import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import Home from './pages/Home';
import { Deposit } from './pages/Deposit';
import { Withdraw } from './pages/Withdraw';
import { History } from './pages/History';
import { VaultStatus } from './pages/VaultStatus';
import { ConnectWallet } from './pages/ConnectWallet';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Landing page WITHOUT app header */}
          <Route path="/" element={<Home />} />

          {/* App pages WITH header/footer via Layout */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/deposit" element={<Layout><Deposit /></Layout>} />
          <Route path="/withdraw" element={<Layout><Withdraw /></Layout>} />
          <Route path="/history" element={<Layout><History /></Layout>} />
          <Route path="/vault" element={<Layout><VaultStatus /></Layout>} />
          <Route path="/connect" element={<Layout><ConnectWallet /></Layout>} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#363636', color: '#fff' },
            success: { duration: 3000, iconTheme: { primary: '#4ade80', secondary: '#fff' } },
            error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
