import Header from 'components/Header';
import { Boards } from 'pages/Boards';
import LogIn from 'pages/LogIn';
import { NotFound } from 'pages/NotFound';
import { SignUp } from 'pages/SignUp';
import { Welcome } from 'pages/Welcome';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
