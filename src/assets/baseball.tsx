import { SVGProps } from "react";

export const Baseball = ({
  fillColor,
  strokeColor,
  strokeWidth,
  ...props
}: SVGProps<SVGSVGElement> & {
  fillColor: string;
  strokeColor?: string;
  strokeWidth?: number | string;
}) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z"
      fill={fillColor}
    />
    <path
      d="M3.5 6V6C3.5 7.65584 3.64693 9.34403 4.27492 10.8762C4.43518 11.2672 4.6276 11.6336 4.89703 12C5.63234 13 7.5 13.5 9.5 12L13.5 8.5C15 7 18.123 5 21.9444 5M4.42857 19.8571L4.89703 19.5448C6.19745 18.6779 7.86271 18.5742 9.26062 19.2732L13.4525 21.3691C15.8017 22.5437 19.4987 22.945 21.5999 21.3691M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z"
      stroke={strokeColor ?? "currentColor"}
      strokeWidth={strokeWidth ?? 2}
      strokeLinecap="round"
    />
  </svg>
);
