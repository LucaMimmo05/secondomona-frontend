import React from "react";

interface HonorIconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
}

const HonorIcon: React.FC<HonorIconProps> = ({ active = false, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={active ? "#0088FF" : "#1E1E1E"}
    fill="none"
    {...props}
  >
    <path
      d="M2.5 3.00098H21.5"
      stroke={active ? "#0088FF" : "#1E1E1E"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 3.00098V14C4.5 16.3288 4.93059 17.0893 6.92752 18.2875L9.94202 20.0962C10.9447 20.6978 11.446 20.9986 12 20.9986C12.554 20.9986 13.0553 20.6978 14.058 20.0962L17.0725 18.2875C19.0694 17.0893 19.5 16.3288 19.5 14V3.00098"
      stroke={active ? "#0088FF" : "#1E1E1E"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.5 13.001H9.5M14.5 8.00098H9.5"
      stroke={active ? "#0088FF" : "#1E1E1E"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HonorIcon;
