import * as React from "react";
import { styled } from "styled-components";

function Header() {
  return (
    <Wrapper>
      <NavLink href="https://github.com/sameersismail/obsidian-perilous-writing">
        GitHub ↗
      </NavLink>
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  display: flex;
  flex-direction: row;
`;

const NavLink = styled.a`
  color: white;
  font-size: calc(14 / 16 * 1rem);
  font-weight: 500;
  font-family: var(--font-family-sans-serif);
  margin-left: auto;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default Header;
