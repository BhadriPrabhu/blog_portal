import * as React from "react";
const Profile = (props) => (
  <svg
    width="25px"
    height="25px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g id="style=linear">
      <g id="profile">
        <path
          id="vector"
          d="M12 11C14.4853 11 16.5 8.98528 16.5 6.5C16.5 4.01472 14.4853 2 12 2C9.51472 2 7.5 4.01472 7.5 6.5C7.5 8.98528 9.51472 11 12 11Z"
          stroke="#000000"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="rec"
          d="M5 18.5714C5 16.0467 7.0467 14 9.57143 14H14.4286C16.9533 14 19 16.0467 19 18.5714C19 20.465 17.465 22 15.5714 22H8.42857C6.53502 22 5 20.465 5 18.5714Z"
          stroke="#000000"
          strokeWidth={1.5}
        />
      </g>
    </g>
  </svg>
);
export default Profile;
