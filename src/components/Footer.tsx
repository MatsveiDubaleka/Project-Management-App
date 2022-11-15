import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flex } from 'styles/Flex';
import Logo from 'assets/svg/course-logo.svg';
import styled from 'styled-components';

const StyledFlex = styled(Flex)`
  position: fixed;
  width: 100%;
  height: 100px;
  padding: 0 5vw;
  left: 0;
  bottom: 0;
  text-align: center;
  background-color: #282c34;
  color: #fff;
`;

const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: #fff;
`;

const Footer = () => {
  return (
    <StyledFlex justify="space-between">
      <div className="creation-year">2022 &#169;</div>
      <Flex gap="50px" className="authors">
        <StyledLink to="https://github.com/aibolit666">Pavel Priladyshev</StyledLink>
        <StyledLink to="https://github.com/AlexandrKlychnikov">Alexandr Klychnikov</StyledLink>
        <StyledLink to="https://github.com/MatsveiDubaleka">Matsvei Dubaleka</StyledLink>
      </Flex>
      <div className="course-logo">
        <a href="https://rs.school" target="_blank" rel="noreferrer">
          <img src={Logo} alt="RSSCHOOL Course" width="150px" />
        </a>
      </div>
    </StyledFlex>
  );
};

export default Footer;
