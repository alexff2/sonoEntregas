import React from 'react'
import { CssBaseline, Box } from '@material-ui/core';

import Routes from './routes';
import Nav from './components/Nav'
import Header from './components/Header';

function App() {
  return (
    <Box display="flex">
      <CssBaseline />
      <Header />
      <Nav />
      <Routes />
    </Box>
);
}

export default App;
