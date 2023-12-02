import * as React from "react";
import { styled } from "styled-components";

function BackgroundImage() {
  return (
    <Wrapper>
      <Image />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  z-index: -1;
`;

const Image = styled.div`
  position: absolute;
  z-index: -1;
  top: -200px;
  left: -200px;
  right: -200px;
  height: 600px;
  transform: rotate(-5deg);
  background-size: 95px 95px;
  background-image: linear-gradient(to right, #0e2555, transparent),
    linear-gradient(#022f5e, rgb(52, 3, 102));
`;

export default BackgroundImage;
