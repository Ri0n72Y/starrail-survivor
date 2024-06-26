import styled, { CSSProperties } from "styled-components";
import { Baseball } from "../../assets/baseball";
import { Hat } from "../../assets/hat";
import { colors, h2r } from "../colors";
import { ReactNode } from "react";

export function ItemContainer({
  type,
  children,
  style,
  iconColor,
  iconOpacity,
}: {
  type: "active" | "passive";
  children?: ReactNode;
  style?: CSSProperties;
  iconColor?: string;
  iconOpacity?: number;
}) {
  return (
    <Container style={style}>
      {type === "active" ? (
        <Baseball
          width="2.4rem"
          height="2.4rem"
          opacity={iconOpacity ?? 0.5}
          fillColor={iconColor ?? h2r(colors.border)}
          strokeWidth="0.1rem"
          strokeColor={h2r(colors.backgroundDark)}
        />
      ) : (
        <Hat
          width="2.4rem"
          height="2.4rem"
          opacity={0.5}
          fillColor={h2r(colors.border)}
          strokeWidth="0.1rem"
          strokeColor={h2r(colors.backgroundDark)}
        />
      )}
      <Position>{children}</Position>
    </Container>
  );
}

const Container = styled.div`
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${h2r(colors.backgroundDark)};
  border: 0.25rem solid ${h2r(colors.border)};
  border-radius: 50%;
`;

const Position = styled.div`
  position: absolute;
  display: flex;
`;
