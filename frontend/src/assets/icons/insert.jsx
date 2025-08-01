import * as React from "react";
const Insert = (props) => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x={0} fill="none" width={20} height={20} />
    <g>
      <path d="M10 1c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 16c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7zm1-11H9v3H6v2h3v3h2v-3h3V9h-3V6z" />
    </g>
  </svg>
);
export default Insert;
