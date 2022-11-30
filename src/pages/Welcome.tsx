import React from 'react';
import styled from 'styled-components';
import kanban from '../assets/img/kanban.png';
import { useTranslation } from 'react-i18next';
import '../utils/i18n.ts';

export function Welcome() {
  const { t } = useTranslation();
  return (
    <main>
      <RowContainer>
        <KunbanImg src={kanban} alt="kunban" />
        <ColumnContainer>
          <Title>{t('kankanTitle1')}</Title>
          <Paragraph>{t('kankanParagraph1')}</Paragraph>
        </ColumnContainer>
      </RowContainer>
      <RowContainer>
        <ColumnContainer>
          <Title>{t('kankanTitle2')}</Title>
          <Paragraph>{t('kankanParagraph2')}</Paragraph>
        </ColumnContainer>
        <ColumnContainer>
          <Title>{t('kankanTitle3')}</Title>
          <Paragraph>{t('kankanParagraph3')}</Paragraph>
        </ColumnContainer>
      </RowContainer>
      <RowContainer>
        <ColumnContainer>
          <Title>{t('kankanTitle4')}</Title>
          <Paragraph>{t('kankanParagraph4')}</Paragraph>
        </ColumnContainer>
      </RowContainer>
      <RowContainer>
        <ColumnContainer>
          <Title>{t('kankanTitle5')}</Title>
          <Paragraph>{t('kankanParagraph5')}</Paragraph>
        </ColumnContainer>
        <ColumnContainer>
          <Title>{t('kankanTitle6')}</Title>
          <Paragraph>{t('kankanParagraph6')}</Paragraph>
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
