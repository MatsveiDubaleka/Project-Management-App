import { deleteBoard } from 'api/boardsService';
import { Endpoint } from 'constants/endpoints';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from 'store/hook';
import styled from 'styled-components';
import { IBoardsOfUser } from 'types/types';
import { BoardBackground } from './Boards';

const BoardItem = styled.div`
   {
    margin-top: 50px;
    min-height: max-content;
    max-width: 100%;
    background-color: rgba(255, 255, 255, 0.13);
    position: relative;
    border-radius: 10px;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
    padding: 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Poppins', sans-serif;
    color: #ffffff;
    letter-spacing: 0.5px;
    outline: none;
    border: none;
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .board h3 {
    font-size: 32px;
    font-weight: 500;
    line-height: 42px;
    text-align: center;
  }
  .board-title {
    margin-bottom: 30px;
  }
  .button-block {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 20px;
  }
  button {
    outline: none;
    border: none;
    margin-top: 20px;
    width: 100%;
    background-color: #23a2f6;
    color: white;
    padding: 25px 0;
    font-size: 18px;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
   {
    width: 1280px;
    margin: 10vh auto;
  }
`;

const BoardPage = () => {
  const { index } = useParams();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const storeBoards: IBoardsOfUser[] = useAppSelector((store) => store.auth.boards);
  const boardData: IBoardsOfUser = storeBoards[Number(index)];

  const handleChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    console.log('change');
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    await deleteBoard(boardData._id, token);

    navigate(`${Endpoint.BOARDS}`);
  };

  const handleAddList = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    console.log('add list');
  };

  return (
    <>
      <BoardBackground>
        <div className="background">
          {Array.from(Array(4)).map((_, index) => (
            <div className="shape" key={index}></div>
          ))}
        </div>
        <Wrapper>
          <BoardItem id={boardData._id}>
            <h3 className="board-title">{boardData.title}</h3>
            <div className="info">
              <div>{boardData.description}</div>
              <div>{boardData.owner}</div>
              <div>{boardData.users}</div>
            </div>
            <div></div>
            <div className="button-block">
              <button onClick={(e) => handleChange(e)}>Change</button>
              <button onClick={(e) => handleDelete(e)}>Delete</button>
            </div>
            <button onClick={(e) => handleAddList(e)}>Add list</button>
          </BoardItem>
        </Wrapper>
      </BoardBackground>
    </>
  );
};

export default BoardPage;
