import { LOCAL_STORAGE_DATA } from 'constants/registration';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { CircularProgress, Grid } from '@mui/material';
import { IBoardsOfUser } from 'types/types';
import BoardElement from 'components/Board';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setIsLoaded, setModal, setUserBoards } from 'store/slices/authSlice';
import { getAllUsers } from 'api/usersServices';
import { getAllBoardsOfUser } from 'api/boardsService';
import ModalProfile from 'components/ModalProfile';
import { DialogProfile } from '../components/DialogProfile';
import { Navigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const {
    name,
    login,
    _id: userId,
  } = localStorage.getItem(LOCAL_STORAGE_DATA) !== '' &&
  localStorage.getItem(LOCAL_STORAGE_DATA) !== null
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA))
    : { name: '', login: '', _id: '' };
  const store = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const dispatch = useAppDispatch();
  let token: string;
  const tokenFromState = useAppSelector((state) => state.auth.token);
  localStorage.getItem(LOCAL_STORAGE_DATA) !== '' &&
  localStorage.getItem(LOCAL_STORAGE_DATA) !== null
    ? (token = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DATA}`)).token)
    : tokenFromState; // Validate token from localStorage or from store (when page reload)

  const modal = useAppSelector((store) => store.auth.modal);

  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => {
    setOpenModal(false);
    dispatch(setModal(''));
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    dispatch(setModal(''));
  };

  const handleEditName = () => {
    dispatch(setModal('updateName'));
    setOpenModal(true);
  };
  const handleEditLogin = () => {
    dispatch(setModal('updateLogin'));
    setOpenModal(true);
  };
  const handleClickDelete = () => {
    dispatch(setModal('deleteUser'));
    setOpenDialog(true);
  };

  useEffect(() => {
    if (store.isValidated) {
      async function dispatchBoards() {
        dispatch(setIsLoaded(true));
        const data: IBoardsOfUser[] = await getAllBoardsOfUser(userId, token);
        const users = await getAllUsers(token);
        dispatch(setUserBoards(data));
        setUsers((state) => {
          state = [...users];
          return state;
        });
      }
      dispatchBoards();
      dispatch(setIsLoaded(false));
    }
  }, [dispatch, token]);

  return (
    <Wrapper>
      {!store.isValidated && <Navigate to="/" />}
      <h3>USER PROFILE</h3>
      <UserData>
        <p>
          Name:{' '}
          <Info>
            {name} <EditIcon sx={editIconStyle} onClick={handleEditName} />
          </Info>
        </p>
        <p>
          Login:{' '}
          <Info>
            {login} <EditIcon sx={editIconStyle} onClick={handleEditLogin} />
          </Info>
        </p>
        <p>
          ID: <Info>{userId}</Info>
        </p>
        <Button
          variant="contained"
          onClick={handleClickDelete}
          color="warning"
          sx={{ width: '22%' }}
        >
          Delete Account
        </Button>
        <Container sx={{ paddingTop: 3, paddingBottom: 3 }}>
          {store.isLoaded ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3}>
              {Array.isArray(store.userBoards)
                ? store.userBoards.map((board: IBoardsOfUser, index: number) => (
                    <Grid item xs={6} md={3} sm={5} key={index}>
                      <BoardElement
                        _id={board._id}
                        title={board.title}
                        description={board.description}
                        owner={
                          users.find((user) => user._id === board.owner)
                            ? users.find((user) => user._id === board.owner).name
                            : ''
                        }
                        users={board.users}
                      />
                    </Grid>
                  ))
                : null}
            </Grid>
          )}
        </Container>
      </UserData>
      {modal === 'deleteUser' ? (
        <DialogProfile
          userId={userId}
          token={token}
          open={openDialog}
          handleClose={handleCloseDialog}
        />
      ) : (
        <ModalProfile
          open={openModal}
          handleClose={handleCloseModal}
          userId={userId}
          token={token}
          userName={name}
          login={login}
        />
      )}
    </Wrapper>
  );
};

export default Profile;

const Wrapper = styled.div`
  width: 1280px;
  height: fit-content;
  margin: 0 auto;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
  font-size: 1.25em;
  color: #61dafb;
`;

const UserData = styled.div`
  width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Info = styled.span`
  color: orange;
`;

const editIconStyle = { color: 'white', cursor: 'pointer' };
