import Header from 'components/Header';
import { Boards } from 'pages/Boards';
import LogIn from 'pages/LogIn';
import { NotFound } from 'pages/NotFound';
import { SignUp } from 'pages/SignUp';
import { Welcome } from 'pages/Welcome';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from 'components/Footer';
import { createGlobalStyle } from 'styled-components';
import BoardPage from 'pages/BoardPage';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    font-family: Open-Sans, Helvetica, Sans-Serif;
    box-sizing: border-box;
  }
`;

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/:id" element={<BoardPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
