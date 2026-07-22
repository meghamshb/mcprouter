import React from "react";
import { cn } from "@/renderer/utils/tailwind-utils";

type JeMarkProps = {
  className?: string;
  title?: string;
};

/**
 * Official Johnson Electric icon mark (orange block + charcoal stem),
 * cropped from https://www.johnsonelectric.com logo artwork.
 */
export const JeMark: React.FC<JeMarkProps> = ({
  className = "h-5 w-auto",
  title = "Johnson Electric",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 27 37.33"
    className={cn("shrink-0", className)}
    role="img"
    aria-label={title}
  >
    <path
      className="fill-[#f58220]"
      d="M19.48,8.32V3.43h6.65V1.55A1.52,1.52,0,0,0,24.62,0H7A2.57,2.57,0,0,0,4.91,2.07V20A2.57,2.57,0,0,0,7,22H24.62a1.52,1.52,0,0,0,1.51-1.54V18.55H19.48v-4.9h6.65V8.32Z"
    />
    <path
      className="fill-[#231f20] dark:fill-white"
      d="M21,6.85a5.5,5.5,0,0,0-5.62-5.4,5.53,5.53,0,0,0-5.63,5.4,5.53,5.53,0,0,0,5.63,5.39A5.5,5.5,0,0,0,21,6.85Z"
    />
    <path
      className="fill-[#231f20] dark:fill-white"
      d="M10.34,26.82a5.09,5.09,0,0,1-5.13,5.35c-3.33,0-4.84-2.84-4.84-5.55v-.05H0s0,.64,0,1c0,5.76,5.39,9.8,10.43,9.8s10-3.84,10-9.6V24.09H10.33S10.34,26.11,10.34,26.82Z"
    />
    <rect
      className="fill-[#231f20] dark:fill-white"
      x="10.33"
      y="13.65"
      width="10.14"
      height="9.31"
    />
  </svg>
);

export default JeMark;
