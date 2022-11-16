import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import LanguageSwitcher from './LanguageSwitcher';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import HomeIcon from '@mui/icons-material/Home';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import AddchartIcon from '@mui/icons-material/Addchart';
import TableChartIcon from '@mui/icons-material/TableChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setToken } from 'store/slices/authSlice';
import { LOCAL_STORAGE_DATA } from 'constants/registration';

function Header() {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const handleClickLogOut = () => {
    dispatch(setToken(''));
    localStorage.setItem(`${LOCAL_STORAGE_DATA}`, '');
  };
  return (
    <AppHeader>
      <Wrapper>
        <Navigator>
          <RegisterBlock>
            <Link to="/" end>
              <HomeIcon />
              Home
            </Link>
            {token !== '' ? (
              <>
                {' '}
                <Link to="/boards">
                  <TableChartIcon />
                  Boards
                </Link>
                <Link to="#">
                  <AddchartIcon sx={{ transform: 'scaleY(-1)' }} />
                  Add Board
                </Link>
              </>
            ) : null}
          </RegisterBlock>
          <Logo>
            <ViewKanbanIcon />
            kanKan
          </Logo>
          <RegisterBlock>
            {token !== '' ? (
              <Link to="/" onClick={handleClickLogOut}>
                <LogoutIcon />
                Log Out
              </Link>
            ) : (
              <>
                <Link to="logIn">
                  <LoginIcon />
                  Login
                </Link>
                <Link to="signUp">
                  <HowToRegIcon />
                  Sign Up
                </Link>
              </>
            )}
          </RegisterBlock>
        </Navigator>
        <div className="box">
          <LanguageSwitcher />
        </div>
      </Wrapper>
    </AppHeader>
  );
}

const AppHeader = styled.header`
  position: relative;
  z-index: 2;
  background: #282c34;

  .box {
    display: flex;
    align-items: center;
    gap: 3px;
    line-height: '70px';
  }
`;
const Navigator = styled.nav`
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style: none;
  width: 1280px;
`;
const Link = styled(NavLink)`
  color: #61dafb;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 3px;
`;
const Wrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 1.25em;
  color: #61dafb;
  height: 70px;
  background: #282c34;
`;

const RegisterBlock = styled.div`
  display: flex;
  gap: 25px;
  padding: 0 10px;
`;

const Logo = styled.div`
  display: flex;
  align-items: flex-start;
  color: orange;
  border: 1px solid orange;
  border-top-right-radius: 20px;
  padding-right: 2px;
`;

export default Header;
