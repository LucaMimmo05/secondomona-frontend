import React from "react";

interface ClockIconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
}

const ClockIcon: React.FC<ClockIconProps> = ({ active, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={active ? "#0088FF" : "#1e1e1e"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 6V12L16 14"
      stroke={active ? "#0088FF" : "#1e1e1e"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="1" fill={active ? "#0088FF" : "#1e1e1e"} />
  </svg>
);

export default ClockIcon;
