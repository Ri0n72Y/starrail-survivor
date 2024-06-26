import styled from "styled-components";

export const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10;
  font-size: 50px;
  font-weight: 600;
  color: white;
  font-family: '"Source Sans Pro", Helvetica, sans-serif';
`;
