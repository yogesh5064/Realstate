import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyNavbar from './components/MyNavbar';
import Home from './pages/Home';
import PostProperty from './pages/PostProperty';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <MyNavbar />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<PostProperty />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;