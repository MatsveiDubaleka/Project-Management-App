import React, { useState } from 'react';
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
import { Box, Button, Modal, TextField, Typography } from '@mui/material';

function Header() {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClickLogOut = () => {
    dispatch(setToken(''));
    localStorage.setItem(`${LOCAL_STORAGE_DATA}`, '');
  };

  const addNewBoard = () => {};

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
                <Link to="#" onClick={handleOpen}>
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            ADD BOARD
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box component="form" onSubmit={() => console.log('Submit')}>
              <TextField
                margin="normal"
                type="text"
                placeholder="Title"
                fullWidth
                label="Title"
                autoComplete="off"
              />
              <TextField
                margin="normal"
                type="text"
                placeholder="Description"
                fullWidth
                label="Description"
                autoComplete="off"
                multiline={true}
                rows="5"
              />

              <Box sx={{ display: 'flex' }}>
                <Button sx={{ ml: 'auto' }} color="success" type="submit">
                  SUBMIT
                </Button>
                <Button color="warning" onClick={() => handleClose()}>
                  CANCEL
                </Button>
              </Box>
            </Box>
          </Typography>
        </Box>
      </Modal>
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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30vw',
  minWidth: '300px',
  height: '40vh',
  minHeight: '300px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default Header;
