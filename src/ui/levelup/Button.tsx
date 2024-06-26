import styled from "styled-components";
import { colors, h2r } from "../colors";

export const Buttons = () => {
  return (
    <ButtonContainer>
      <InfoWrapper style={{ marginRight: "auto" }}>
        <Info>
          排除次数<Number>{5}</Number>
        </Info>
        <Button>排除</Button>
      </InfoWrapper>
      <InfoWrapper>
        <Info>
          重置次数<Number>{9}</Number>
        </Info>
        <Button>重置</Button>
      </InfoWrapper>
      <Button disabled style={{ width: "20rem" }}>
        选择
      </Button>
    </ButtonContainer>
  );
};

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Number = styled.span`
  margin-left: 0.2rem;
  color: ${h2r(colors.active.light)};
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem 0;
  font-size: 12px;
  font-weight: 400;
  background: ${h2r(colors.backgroundDark)};
  padding: 0.25rem;
`;

const ButtonContainer = styled.div`
  position: absolute;
  width: 62%;
  bottom: 3rem;
  left: 30%;
  display: flex;
  gap: 2rem;
  align-items: flex-end;
`;

const Button = styled.button`
  position: relative;
  width: 12rem;
  height: 2.4rem;
  border: 1px solid #c3c3c3;
  border-radius: 1.2rem;
  background-color: white;
  box-shadow: 0px 0px 0px 0.25rem rgba(255, 255, 255, 1);
  outline: none;
  cursor: pointer;

  &:disabled {
    cursor: default;
    color: #c3c3c3;
    box-shadow: none;
    background: none;
    top: 0.25rem;
    width: 12.5rem;
    height: 2.9rem;
    border-radius: 1.5rem;
  }
`;
