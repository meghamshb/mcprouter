import React from "react";

type JeMarkProps = {
  className?: string;
  title?: string;
};

/**
 * Compact JE orange mark from the official johnsonelectric.com logo.
 */
export const JeMark: React.FC<JeMarkProps> = ({
  className = "h-5 w-5",
  title = "Johnson Electric",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28 22"
    className={className}
    role="img"
    aria-label={title}
  >
    <path
      fill="#f58220"
      d="M19.48,8.32V3.43h6.65V1.55A1.52,1.52,0,0,0,24.62,0H7A2.57,2.57,0,0,0,4.91,2.07V20A2.57,2.57,0,0,0,7,22H24.62a1.52,1.52,0,0,0,1.51-1.54V18.55H19.48v-4.9h6.65V8.32Z"
    />
  </svg>
);

export default JeMark;
