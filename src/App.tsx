import Header from 'components/Header';
import { LOCAL_STORAGE_DATA } from 'constants/registration';
import { Boards } from 'pages/Boards';
import LogIn from 'pages/LogIn';
import { NotFound } from 'pages/NotFound';
import { SignUp } from 'pages/SignUp';
import { Welcome } from 'pages/Welcome';
import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setToken } from 'store/slices/authSlice';
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
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (
      localStorage.getItem(`${LOCAL_STORAGE_DATA}`) &&
      JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DATA}`))
    ) {
      dispatch(setToken(JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DATA}`)).token));
    }
  }, [dispatch, token]);

  return (
    <div className="App">
      <GlobalStyle />
      <Header />
      {/* To see/test deploy use <BrowserRouter> */}
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
