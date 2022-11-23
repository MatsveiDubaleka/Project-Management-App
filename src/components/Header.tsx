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
import { setBoards, setToken } from 'store/slices/authSlice';
import { LOCAL_STORAGE_DATA } from 'constants/registration';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

import { getAllUsers } from 'api/usersServices';
import { addNewBoard, getAllBoardsOfServer } from 'api/boardsService';
import { IAddBoardForm, IBoardsOfUser } from 'types/types';

function Header() {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitted },
  } = useForm<IAddBoardForm>();

  const handleClickLogOut = () => {
    dispatch(setToken(''));
    localStorage.setItem(`${LOCAL_STORAGE_DATA}`, '');
  };
  const onSubmit = handleSubmit(async (data) => {
    const currentUserId = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DATA}`))._id;
    await addNewBoard(
      {
        title: data.title,
        description: data.description,
        owner: currentUserId,
        users: [],
      },
      token
    );

    async function dispatchBoards() {
      const data: IBoardsOfUser[] = await getAllBoardsOfServer(token);
      dispatch(setBoards(data));
    }
    dispatchBoards();

    getAllUsers(token);
    reset();
    handleClose();
  });

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
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            fontWeight="bold"
            color="primary"
          >
            ADD BOARD
          </Typography>
          <Box component="form" onSubmit={onSubmit}>
            <TextField
              margin="normal"
              type="text"
              placeholder="Title"
              fullWidth
              label="Title"
              autoComplete="off"
              {...register('title', {
                required: {
                  value: true,
                  message: '*this field must be filled in',
                },
                minLength: {
                  value: 3,
                  message: '*at least 3 characters',
                },
                maxLength: {
                  value: 30,
                  message: '*maximum of 30 characters',
                },
              })}
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
              {...register('description', {
                required: {
                  value: true,
                  message: '*this field must be filled in',
                },
                maxLength: {
                  value: 500,
                  message: '*maximum of 500 characters',
                },
              })}
            />

            <Box sx={{ display: 'flex' }}>
              <Button sx={{ ml: 'auto' }} color="primary" type="submit">
                SUBMIT
              </Button>
              <Button color="warning" onClick={() => handleClose()}>
                CANCEL
              </Button>
            </Box>
          </Box>
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
  minHeight: '300px',
  bgcolor: 'lightgray',
  border: '2px solid #000',
  borderRadius: '7px',
  boxShadow: '2px 2px 2px #433f39',
  p: 4,
};

export default Header;
