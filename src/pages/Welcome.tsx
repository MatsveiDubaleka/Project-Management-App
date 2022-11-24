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
      <RowContainer>
        <ColumnContainer>
          <Title>What is Kankan?</Title>
          <Paragraph>
            KanKan is a simple Kanban board application. Its also an application that helps a team
            or group of developers achieve their goals.
          </Paragraph>
        </ColumnContainer>
        <ColumnContainer>
          <Title>Why Kankan?</Title>
          <Paragraph>
            Kankan is the best way to organize your teams work. Its simple, powerful, and flexible.
            Its the best way to manage your projects, your team, and your work.
          </Paragraph>
        </ColumnContainer>
      </RowContainer>
      <RowContainer>
        <ColumnContainer>
          <Title>How to use Kankan?</Title>
          <Paragraph>
            Kankan is easy to use. At first you need to Sign up. After you can just create a new
            board, add some columns, and start adding cards.
          </Paragraph>
        </ColumnContainer>
      </RowContainer>
      <RowContainer>
        <ColumnContainer>
          <Title>Course</Title>
          <Paragraph>
            We are a team of Front-end Developers. We are studying in The Rolling Scopes School, and
            we are learning React library. You can follow this course using link in Footer.
          </Paragraph>
        </ColumnContainer>
        <ColumnContainer>
          <Title>Our Team</Title>
          <Paragraph>
            We are a team of Front-end Developers. We are studying in The Rolling Scopes School, and
            we are learning React library. Our consists of 3 members: Pasha, Alexander and Matsvei.
          </Paragraph>
        </ColumnContainer>
      </RowContainer>
      <RowContainer></RowContainer>
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
