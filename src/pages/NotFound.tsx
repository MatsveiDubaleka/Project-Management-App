import React from 'react';
import notFound from './../assets/img/error.png';
import styled from 'styled-components';

export const NotFound = () => {
  return (
    <Wrapper>
      Page not found: Error 404
      <Wrapper>
        <img src={notFound} alt="404" />
      </Wrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 90px;
  font-size: 48px;
  font-weight: 700;
`;
