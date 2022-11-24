import React from 'react';
import notFound from './../assets/img/error.png';
import styled from 'styled-components';

export const NotFound = () => {
  return (
    <Wrapper>
      Page not found: Error 404
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
