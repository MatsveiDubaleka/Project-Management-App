import { Container, Grid } from '@mui/material';
import BoardElement from 'components/Board';
import styled from 'styled-components';
import { Title } from 'styles/TitleStyled';
import { getAllBoardsOfServer } from 'api/boardsService';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { setBoards, setIsLoaded } from 'store/slices/authSlice';
import { IBoardsOfUser } from 'types/types';
import { LOCAL_STORAGE_DATA } from 'constants/registration';
import { getAllUsers } from 'api/usersServices';

export const BoardBackground = styled.div`
  margin: 0 auto;
  min-height: 100vh;
  .background {
    max-width: 1280px;
    min-height: 520px;
    position: absolute;
    transform: translate(-50%, -100%);
    left: 50%;
    top: 50%;
  }
  .background .shape {
    height: 200px;
    width: 200px;
    position: absolute;
    border-radius: 50%;
    z-index: 0;
  }
  .shape:first-child {
    background: linear-gradient(#1845ad, #23a2f6);
    left: 0px;
    top: 0px;
  }
  .shape:nth-child(2) {
    height: 150px;
    width: 150px;
    background: linear-gradient(#1845ad, #23a2f6);
    left: 250px;
    top: 300px;
    opacity: 0.8;
  }
  .shape:nth-child(3) {
    height: 150px;
    width: 150px;
    background: linear-gradient(to right, #ff512f, #f09819);
    right: 380px;
    top: 150px;
  }
  .shape:last-child {
    opacity: 0.8;
    background: linear-gradient(to right, #ff512f, #f09819);
    right: -30px;
    bottom: -10px;
  }
`;

const Wrapper = styled.div`
  margin-bottom: 60px;
`;

const Loader = styled.div`
  color: white;
  font-size: 56px;
  margin: 10% 33%;
`;

export function Boards() {
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState([]);
  let token: string;
  const tokenFromState = useAppSelector((state) => state.auth.token);
  JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DATA}`)).token !== null
    ? (token = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DATA}`)).token)
    : tokenFromState; // Validate token from localStorage or from store (when page reload)

  const store = useAppSelector((state) => state.auth);

  useEffect(() => {
    async function dispatchBoards() {
      const data: IBoardsOfUser[] = await getAllBoardsOfServer(token);

      if (data && data.length > 0) {
        const users = await getAllUsers(token);
        dispatch(setBoards(data));
        setUsers((state) => {
          state = [...users];
          return state;
        });
      }
    }
    dispatchBoards();
    dispatch(setIsLoaded(true));
  }, [dispatch, token]);

  return (
    <>
      <main>
        <Title>Boards</Title>
        <BoardBackground>
          <div className="background">
            {Array.from(Array(4)).map((_, index) => (
              <div className="shape" key={index}></div>
            ))}
          </div>
          <Wrapper>
            <Container sx={{ paddingTop: 6 }}>
              {!store.isLoaded ? (
                <Loader>Loading...</Loader>
              ) : (
                <Grid container spacing={3}>
                  {Array.isArray(store.boards)
                    ? store.boards.map((board: IBoardsOfUser, index: number) => (
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
          </Wrapper>
        </BoardBackground>
      </main>
    </>
  );
}
