import React from 'react';
import notFound from './../assets/img/error.png';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import '../utils/i18n.ts';

export const NotFound = () => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      {t('page404')}
      <div>
        <img src={notFound} alt="404" />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  color: white;
  flex-direction: column;
  align-items: center;
  margin-top: 90px;
  font-size: 48px;
  font-weight: 700;
`;
