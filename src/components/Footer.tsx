import React from 'react';
import { Flex } from 'styles/Flex';
import Logo from 'assets/svg/course-logo.svg';
import styled from 'styled-components';
import useMediaQuery from '@mui/material/useMediaQuery';

const StyledFlex = styled(Flex)`
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  height: max-content;
  text-align: center;
  background-color: #282c34;
  color: #fff;
  flex-wrap: wrap;
`;

const StyledFooter = styled.footer`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #282c34;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: #fff;
  @media (max-width: 400px) {
    font-size: 16px;
  }
`;

const Footer = () => {
  const mediaTrigger = useMediaQuery('(max-width: 930px)');
  return (
    <StyledFooter>
      <StyledFlex justify={mediaTrigger ? 'center' : 'space-between'}>
        <div className="creation-year">2022 &#169;</div>
        <Flex gap={mediaTrigger ? '5px' : '50px'} className="authors">
          <StyledLink href="https://github.com/aibolit666" target="_blank" rel="noreferrer">
            Pavel Priladyshev
          </StyledLink>
          <StyledLink href="https://github.com/AlexandrKlychnikov" target="_blank" rel="noreferrer">
            Alexandr Klychnikov
          </StyledLink>
          <StyledLink href="https://github.com/MatsveiDubaleka" target="_blank" rel="noreferrer">
            Matsvei Dubaleka
          </StyledLink>
        </Flex>
        <div className="course-logo">
          <a href="https://rs.school" target="_blank" rel="noreferrer">
            <img src={Logo} alt="RSSCHOOL Course" width="150px" />
          </a>
        </div>
      </StyledFlex>
    </StyledFooter>
  );
};

export default Footer;
