import { SVGProps } from "react";

export const Hat = ({
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
    viewBox="0 -1 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 13.7991V18.7076C1 20.2325 2.26554 21.4687 3.82667 21.4687C4.51896 21.4687 5.18719 21.7169 5.70461 22.1661L8.30299 24.4222C8.89534 24.9365 9.75445 25.0323 10.4502 24.6616C13.2091 23.1917 16.3015 22.4214 19.4442 22.4214H20.0954C21.3303 22.4214 22.5505 22.6832 23.6718 23.1887L27.475 24.9033C27.9555 25.1199 28.5259 24.9626 28.8195 24.5324C29.093 24.1316 29.0522 23.6004 28.7205 23.244L24.4082 18.6106V13.7991C24.4082 10.7797 23.1803 7.88397 20.9945 5.74893L19.8711 4.65159C18.4047 3.21916 16.4157 2.41444 14.3419 2.41444C13.9596 2.41444 13.6334 2.1445 13.5706 1.7762L13.5588 1.70722C13.3979 0.764261 12.0103 0.764261 11.8494 1.70722L11.8377 1.7762C11.7748 2.1445 11.4486 2.41444 11.0664 2.41444C8.99249 2.41444 7.00356 3.21916 5.53711 4.65158L4.4137 5.74893C2.22794 7.88397 1 10.7797 1 13.7991Z"
      fill={fillColor}
    />
    <path
      d="M24.4082 18.6106V13.7991C24.4082 10.7797 23.1803 7.88397 20.9945 5.74893L19.8711 4.65159C18.4047 3.21916 16.4157 2.41444 14.3419 2.41444C13.9596 2.41444 13.6334 2.1445 13.5706 1.7762L13.5588 1.70722C13.3979 0.764261 12.0103 0.764261 11.8494 1.70722L11.8377 1.7762C11.7748 2.1445 11.4486 2.41444 11.0664 2.41444C8.99249 2.41444 7.00356 3.21916 5.53711 4.65158L4.4137 5.74893C2.22794 7.88397 1 10.7797 1 13.7991V18.7076C1 20.2325 2.26554 21.4687 3.82667 21.4687C4.51896 21.4687 5.18719 21.7169 5.70461 22.1661L8.30299 24.4222C8.89534 24.9365 9.75445 25.0323 10.4502 24.6616C13.2091 23.1917 16.3015 22.4214 19.4442 22.4214H20.0954C21.3303 22.4214 22.5505 22.6832 23.6718 23.1887L27.475 24.9033C27.9555 25.1199 28.5259 24.9626 28.8195 24.5324C29.093 24.1316 29.0522 23.6004 28.7205 23.244L24.4082 18.6106ZM24.4082 18.6106L21.4918 17.1862C19.5612 16.2433 17.4325 15.7524 15.274 15.7524C12.9477 15.7524 10.6586 16.3226 8.6164 17.4107L6.36438 18.6106"
      stroke={strokeColor ?? "currentColor"}
      strokeWidth={strokeWidth ?? 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
