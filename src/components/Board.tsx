import { getAllBoardOfUser } from 'api/registerService';
import React, { useEffect } from 'react';
import { useAppSelector } from 'store/hook';
import styled from 'styled-components';

const Board = styled.div`
   {
    cursor: pointer;
    min-height: 350px;
    width: 350px;
    background-color: rgba(255, 255, 255, 0.13);
    position: relative;
    transform: translate(-50%, -50%);
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
    justify-content: space-between;
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
    gap: 5px;
  }
  button {
    outline: none;
    border: none;
    margin-top: 30px;
    width: 100%;
    background-color: #23a2f6;
    color: white;
    padding: 15px 0;
    font-size: 18px;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
  }
`;

interface IBoardElement {
  _id: string;
  title: string;
  description: string;
  owner: string;
  users: string[];
}

const BoardElement = ({
  _id = '',
  title = '',
  description = '',
  owner = '',
  users = [],
}: IBoardElement) => {
  // const token = useAppSelector((state) => state.auth.token);

  const handleClick = () => {
    console.log('open board');
  };

  const handleChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    console.log('change');
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    console.log('delete');
  };

  // useEffect(() => {
  //   getAllBoardOfUser('1', token);
  // }, [token]);

  return (
    <>
      <Board id={_id} onClick={() => handleClick()}>
        <h3 className="board-title">Board title: {title}</h3>
        <div className="info">
          <div>Description: {description}</div>
          <div>{owner}</div>
          <div>{users}</div>
        </div>
        <div className="button-block">
          <button onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleChange(e)}>
            Change
          </button>
          <button onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleDelete(e)}>
            Delete
          </button>
        </div>
      </Board>
    </>
  );
};

export default BoardElement;
