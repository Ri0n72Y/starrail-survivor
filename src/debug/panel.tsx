import styled from "styled-components";
import { useDebugValue } from "./useDebugPanel";

export function DebugPanel() {
  const values = useDebugValue();
  return (
    <Container>
      {Object.entries(values).map(([k, v]) => (
        <span key={k}>
          {k}: {v}
        </span>
      ))}
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
`;
