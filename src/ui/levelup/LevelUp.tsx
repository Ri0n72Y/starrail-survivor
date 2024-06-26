import styled from "styled-components";
import { Mask } from "../style";
import { useGame } from "../../store";
import { colors, h2g, h2r } from "../colors";
import { useExp } from "../../store/useExp";
import { Baseball } from "../../assets/baseball";
import { Hat } from "../../assets/hat";
import { Fragment } from "react/jsx-runtime";
import { Star } from "../../assets/star";
import { UpdateWeaponCards } from "./WeaponCard";
import { ItemContainer } from "./ItemContainer";
import { Buttons } from "./Button";

export function LevelUp() {
  // const pid = useGame((state) => state.clientPlayerId);
  const [paused] = useGame((state) => [state.isGamePaused]);
  return paused ? (
    <Mask style={{ background: h2g(colors.background, 0.4) }}>
      <Equipments />
      <Buttons />
      <UpdateWeaponCards />
    </Mask>
  ) : null;
}

function Equipments() {
  const pid = useGame((state) => state.clientPlayerId);
  const [lvl] = useExp((state) => [state.playerLvl[pid]]);
  return (
    <Container>
      <Panel
        style={{
          gap: "1rem",
          flexDirection: "row",
          padding: "0.5rem 1.6rem",
          width: "fit-cotent",
        }}
      >
        <InfoSpan>
          <Label>当前等级</Label>
          <span>{lvl}</span>
        </InfoSpan>
        <Divider />
        <InfoSpan style={{ marginLeft: "0.15rem" }}>
          <Label>当前强度</Label>
          <span>100%</span>
        </InfoSpan>
      </Panel>
      <SubContainer>
        <Panel>
          <BgHeader color={h2r(colors.active.plain)} />
          <IconContainer>
            <Baseball
              width="2.1rem"
              height="2.1rem"
              fillColor={h2r(colors.active.icon)}
              strokeColor={h2r(colors.backgroundDark)}
              strokeWidth="0.1rem"
            />
          </IconContainer>
          {new Array(5).fill(0).map((_, i) => (
            <Fragment key={i}>
              <ItemContainer type="active" />
              {i < 4 ? (
                <Star
                  width={32}
                  height={32}
                  fillColor={h2r(colors.border)}
                  opacity={0.5}
                />
              ) : (
                <div style={{ height: "0.5rem" }} />
              )}
            </Fragment>
          ))}
        </Panel>
        <Panel>
          <BgHeader color={h2r(colors.passive.plain)} />
          <IconContainer>
            <Hat
              width="2.1rem"
              height="2.1rem"
              fillColor={h2r(colors.passive.icon)}
              strokeColor={h2r(colors.backgroundDark)}
              strokeWidth="0.1rem"
            />
          </IconContainer>
          {new Array(6).fill(0).map((_, i) => (
            <Fragment key={i}>
              <ItemContainer type="passive" />
              {i < 5 ? (
                <Star
                  width={32}
                  height={32}
                  fillColor={h2r(colors.border)}
                  opacity={0.5}
                />
              ) : (
                <div style={{ height: "0.5rem" }} />
              )}
            </Fragment>
          ))}
        </Panel>
      </SubContainer>
    </Container>
  );
}

function BgHeader({ color }: { color: string }) {
  return (
    <>
      <Background style={{ background: color, height: "2rem" }} />
      <Background style={{ background: color, height: "2.6rem" }} />
    </>
  );
}

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: ${h2r(colors.backgroundDark)};
  opacity: 0.8;
  z-index: 0;
`;

const IconContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: ${h2r(colors.backgroundDark)};
  border-radius: 50%;
  z-index: 0;
  margin-bottom: 0.8rem;
`;

const Container = styled.div`
  position: absolute;
  top: 1rem;
  left: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  font-size: 1rem;
  font-weight: 400;
`;

const Label = styled.div`
  font-size: 0.8rem;
  color: ${h2r(colors.label)};
  margin-left: -0.15rem;
`;

const InfoSpan = styled.div`
  display: flex;
  flex-direction: column;
`;

const Divider = styled.div`
  width: 0.15rem;
  height: 2rem;
  border-radius: 0.15rem;
  background: ${h2r(colors.border)};
`;

const SubContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Panel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1rem 0;
  padding: 1.2rem 0.5rem;
  border: 0.15rem solid ${h2r(colors.border)};
  background-color: ${h2r(colors.background)};
  overflow: hidden;
  color: ${h2r(colors.color)};
  height: fit-content;
  box-shadow: 0 0 0 0.15rem ${h2r(colors.background)};
`;
