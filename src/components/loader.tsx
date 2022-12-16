import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const spin = keyframes`
0% {
    transform: rotate(0deg);
  }
  100% {
      transform: rotate(360deg);
    }
`;
const Loader = styled.div`
  border: 0.2em solid rgba(255, 255, 255, 0.9);
  border-top: 0.2em solid #767676;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  margin: auto !important;
  animation: ${spin} 0.6s linear infinite;
`;
export default Loader;
