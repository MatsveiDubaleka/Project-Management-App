import React from 'react';
import styled from 'styled-components';

export function Boards() {
  const Title = styled.h1`
    font-size: 2em;
    text-align: center;
    color: green;
    margin-top: 15vw;
  `;
  return (
    <main>
      <Title>А здесь творится управляют проектами</Title>
    </main>
  );
}
