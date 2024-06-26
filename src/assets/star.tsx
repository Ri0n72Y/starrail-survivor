import { SVGProps } from "react";

export const Star = ({
  fillColor,
  ...props
}: SVGProps<SVGSVGElement> & { fillColor?: string }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20 7.36842C20 14.3446 14.3447 20 7.36842 20C14.3447 20 20 25.6553 20 32.6316C20 25.6553 25.6553 20 32.6316 20C25.6553 20 20 14.3446 20 7.36842Z"
      fill={fillColor ?? "currentColor"}
    />
  </svg>
);
