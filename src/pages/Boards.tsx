import { Container, Grid } from '@mui/material';
import BoardElement from 'components/Board';
import React from 'react';
import styled from 'styled-components';
import { Title } from 'styles/TitleStyled';
import Footer from '../components/Footer';

export const BoardBackground = styled.div`
   {
    margin: 0 auto;
  }
  .background {
    width: 1280px;
    height: 520px;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
  }
  .background .shape {
    height: 200px;
    width: 200px;
    position: absolute;
    border-radius: 50%;
    z-index: -10;
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
   {
    margin-left: 350px;
  }
`;

export function Boards() {
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
            <Container maxWidth="xl" sx={{ paddingTop: 30 }}>
              <Grid container spacing={3}>
                {Array.from(Array(8)).map((_, index) => (
                  <Grid item xs={3} key={index}>
                    <BoardElement />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Wrapper>
        </BoardBackground>
      </main>
      <Footer />
    </>
  );
}
