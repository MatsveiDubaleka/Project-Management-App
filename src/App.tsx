import Header from 'components/Header';
import { LOCAL_STORAGE_DATA } from 'constants/registration';
import { Boards } from 'pages/Boards';
import LogIn from 'pages/LogIn';
import { NotFound } from 'pages/NotFound';
import { SignUp } from 'pages/SignUp';
import { Welcome } from 'pages/Welcome';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setToken, setValidation } from 'store/slices/authSlice';
import './App.css';
import Footer from 'components/Footer';
import { createGlobalStyle } from 'styled-components';
import BoardPage from 'pages/BoardPage';
import { checkTokenValidation } from 'api/checkTokenValidation';
import { CircularProgress } from '@mui/material';
import Navigation from 'constants/navigation';
import Profile from 'pages/Profile';

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
  const isValidated = useAppSelector((state) => state.auth.isValidated);
  console.log(isValidated);
  const [isLoading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkTokenValidation().then((res) => {
      if (res) {
        console.log('Here');
        const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA)!);
        dispatch(setToken(data.token));
        dispatch(setValidation(true));
      }

      setTimeout(() => {
        setLoading(true);
      }, 2000);
    });
    console.log(isValidated);
  }, [dispatch, token, isLoading, isValidated, navigate, location.pathname]);

  return (
    <div className="App">
      {isLoading ? (
        <>
          <GlobalStyle />
          <Header />
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/boards" element={<Boards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/bord_:index" element={<BoardPage />} />
          </Routes>
          <Footer />
        </>
      ) : (
        <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />
      )}
    </div>
  );
}

export default App;
