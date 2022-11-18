import React from 'react';
import { Flex } from 'styles/Flex';
import Logo from 'assets/svg/course-logo.svg';
import styled from 'styled-components';

const StyledFlex = styled(Flex)`
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  height: 100px;
  text-align: center;
  background-color: #282c34;
  color: #fff;
`;

const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #282c34;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: #fff;
`;

const Footer = () => {
  return (
    <StyledFooter>
      <StyledFlex justify="space-between">
        <div className="creation-year">2022 &#169;</div>
        <Flex gap="50px" className="authors">
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
