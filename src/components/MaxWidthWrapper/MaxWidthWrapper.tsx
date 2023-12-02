import styled from "styled-components";

const MaxWidthWrapper = styled.div`
  max-width: calc(720 / 16 * 1rem);
  padding: 0 32px;
  margin: 0 auto;
  height: 100%;

  @media (max-width: 550px) {
    padding: 0 16px;
  }
`;

export default MaxWidthWrapper;
