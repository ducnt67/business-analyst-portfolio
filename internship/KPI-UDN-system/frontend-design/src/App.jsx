import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppProviders from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';

import './styles/variables.css';

function App() {
  return (
    <Router>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </Router>
  );
}

export default App;
