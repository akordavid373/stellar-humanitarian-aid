import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Campaigns } from './pages/Campaigns';
import { Distributions } from './pages/Distributions';
import { Beneficiaries } from './pages/Beneficiaries';
import { Verification } from './pages/Verification';
import { Dashboard } from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/distributions" element={<Distributions />} />
            <Route path="/beneficiaries" element={<Beneficiaries />} />
            <Route path="/verification" element={<Verification />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
