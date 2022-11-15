import React from 'react';
import styled from 'styled-components';
import kanban from '../assets/img/kanban.png';

export function Welcome() {
  return (
    <main>
      <RowContainer>
        <KunbanImg src={kanban} alt="kunban" />
        <ColumnContainer>
          <Title>Kankan - secret Jedi techniques</Title>
          <Paragraph>
            Manage workflows and team interactions at a professional level. Reach new heights of
            productivity with application Kankan.
          </Paragraph>
        </ColumnContainer>
      </RowContainer>
      <Paragraph></Paragraph>
    </main>
  );
}

const Paragraph = styled.p`
  max-width: 1280px;
  margin: 0 auto;
  padding: 10px 20px;
  font-size: 1.25em;
  text-align: center;
  color: white;
`;

const KunbanImg = styled.img`
  display: inline-block;
  width: 200px;
  height: 200px;
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 30px 20px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 0 0;
  padding: 10px 20px;
  width: 600px;
`;

const Title = styled.p`
  font-size: 2em;
  margin: 15px 0;
  text-align: center;
  color: white;
  width: 600px;
`;
