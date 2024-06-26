import { ReactNode } from "react";
import styled from "styled-components";
import { colors, h2r } from "../colors";
import { ItemContainer } from "./ItemContainer";

export function UpdateWeaponCards() {
  return (
    <Container>
      <Thunder />
      <Thunder />
      <Thunder />
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 2rem;
`;

function Thunder() {
  return (
    <WeaponCard
      id="thunder"
      name="雷电荆棘"
      icon={<Icon src="/assets/weapon-thunder.png" />}
      description={`将造成持续伤害的【雷电荆棘】施加于一名敌方目标，敌方目标每回合开始时受到等同于400%基础伤害的雷属性持续伤害，并弹射3次，弹射伤害为原伤害的50%。【雷电荆棘】在敌方目标被消灭时转移给另一个敌方目标。\n\n\n\n\n\n 11111111`}
      tags={[]}
      type="active"
    />
  );
}

const Icon = styled.img`
  width: 12rem;
  height: 12rem;
`;

interface Props {
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
  tags: string[];
  type: "active" | "passive";
}
export function WeaponCard(props: Props) {
  const color = props.type === "active" ? colors.active : colors.passive;
  const plain = h2r(color.plain);
  const light = h2r(color.light);
  const shadow = h2r(color.shadow);
  return (
    <Wrapper style={{ background: plain }}>
      <Tag type={props.type} />
      <Image $a1={shadow} $a2={light}>
        {props.icon}
      </Image>
      <DescriptionBackground style={{ borderColor: plain }}>
        <Description style={{ borderColor: plain }}>
          <div style={{ color: plain, fontSize: "1.2rem" }}>{props.name}</div>
          <DescText>{props.description}</DescText>
        </Description>
      </DescriptionBackground>
    </Wrapper>
  );
}

function Tag({ type }: { type: "active" | "passive" }) {
  const color = h2r(
    type === "active" ? colors.active.plain : colors.passive.plain
  );
  return (
    <TagContainer>
      <ItemContainer
        type={type}
        style={{
          width: "1.6rem",
          height: "1.6rem",
          position: "absolute",
          left: "-1.6rem",
          borderColor: h2r(colors.background),
        }}
        iconColor={color}
        iconOpacity={1}
      />
      <span>
        {type === "active" && "武器"}
        {type === "passive" && "配饰"}
      </span>
    </TagContainer>
  );
}

const TagContainer = styled.div`
  position: absolute;
  right: 0;
  top: 1rem;
  width: 4rem;
  height: 1.6rem;
  background: ${h2r(colors.background)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 400;
`;

const Image = styled.div<{ $a1: string; $a2: string }>`
  width: 100%;
  height: 48%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-30deg, ${({ $a1 }) => $a1}, ${({ $a2 }) => $a2});
`;

const Wrapper = styled.div`
  position: relative;
  width: 19.2rem;
  height: 32rem;
  border-radius: 2rem 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const DescText = styled.div`
  font-size: 0.9rem;
  overflow-y: scroll;
  scrollbar-width: 0;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const Description = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 0 0 2rem 0;
  border: 2px solid;
  box-sizing: border-box;
  border-top: none;
  color: ${h2r(colors.text)};
  font-size: 1rem;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem 1rem;
  gap: 0.5rem;
  white-space: pre-wrap;
`;

const DescriptionBackground = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 52%;
  background-color: white;
  border-radius: 0 0 2rem 0;
  box-sizing: border-box;
  padding: 0 0.5rem 0.5rem;
`;
