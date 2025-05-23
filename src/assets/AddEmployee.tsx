import React from "react";

interface UserAdd01IconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
}

const UserAdd01Icon: React.FC<UserAdd01IconProps> = ({ active = false, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={active ? "#0088FF" : "#1e1e1e"}
    fill="none"
    {...props}
  >
    <path
      d="M15 8C15 5.23858 12.7614 3 10 3C7.23858 3 5 5.23858 5 8C5 10.7614 7.23858 13 10 13C12.7614 13 15 10.7614 15 8Z"
      stroke={active ? "#0088FF" : "#1e1e1e"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 21L17.5 14M14 17.5H21"
      stroke={active ? "#0088FF" : "#1e1e1e"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 20C3 16.134 6.13401 13 10 13C11.4872 13 12.8662 13.4638 14 14.2547"
      stroke={active ? "#0088FF" : "#1e1e1e"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default UserAdd01Icon;
