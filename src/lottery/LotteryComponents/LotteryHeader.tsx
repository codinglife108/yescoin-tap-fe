import React from "react";
import { ROUTE_LOG_OF_LUCK, ROUTE_WINNERS } from "../../routes";
import { useNavigate } from "react-router-dom";
import LogoLottery from "../../assets/lottery/llogo-lottery.svg";
const LotteryHeader = ({ setOpenTutorial }: { setOpenTutorial: any }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="Lottery--what-is-this" onClick={setOpenTutorial}>
        <div className={"Lottery--what-is-this-icon-container"}>
          <img src={LogoLottery} alt="logo" />
          {/* <svg
            width={36}
            height={36}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="4"
            />
            <path d="M50,50 L50,5" stroke="white" strokeWidth="4" />
            <path
              d="M50,50 L86.6,25"
              stroke="white"
              fill={"white"}
              strokeWidth="4"
            />
            <path d="M50,50 L86.6,75" stroke="white" strokeWidth="4" />
            <path
              d="M50,50 L50,95"
              stroke="white"
              fill={"white"}
              strokeWidth="4"
            />
            <path d="M50,50 L13.4,75" stroke="white" strokeWidth="4" />
            <path
              d="M50,50 L13.4,25"
              stroke="white"
              fill={"white"}
              strokeWidth="4"
            />
            {/*<circle cx="50" cy="50" r="3" fill="black"/>*/}
            {/* <path
              d="M50,50 L50,10"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg> */}
        </div>
        <div className="Lottery--what-is-this-text">
          <div className="Lottery--what-is-this-title">What is this?</div>
          <div className="Lottery--what-is-this-subtitle">Find out here</div>
        </div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="Lottery--buttons">
        <div
          className="Lottery--button"
          onClick={() => navigate(ROUTE_WINNERS)}
        >
          <span className={"svg-bg"}>
            <svg
              viewBox="0 0 76 76"
              xmlns="http://www.w3.org/2000/svg"
              width={40}
              height={40}
              version="1.1"
              baseProfile="full"
              enable-background="new 0 0 76.00 76.00"
            >
              <path
                fill="#fff"
                fill-opacity="1"
                stroke-width="0.2"
                stroke-linejoin="round"
                d="M 38,19.1975C 44.1212,19.1975 49.0833,20.6153 49.0833,22.3642L 49.0823,22.7103C 50.7657,20.7476 52.5568,19.8111 53.8333,22.3642C 56.6285,26.5569 50.7885,43.0854 43.9353,41.462C 42.6656,43.1212 41.3681,44.2198 40.3114,44.9304C 41.7662,45.4717 42.75,46.508 42.75,47.6975C 42.75,48.8223 41.8704,49.8101 40.5448,50.3719L 42.7947,52.9879C 45.6096,53.6749 47.5,54.9484 47.5,56.4058C 47.5,58.592 43.2467,60.3642 38,60.3642C 32.7533,60.3642 28.5,58.592 28.5,56.4058C 28.5,54.9484 30.3904,53.6749 33.2053,52.9879L 35.4552,50.3719C 34.1296,49.8101 33.25,48.8223 33.25,47.6975C 33.25,46.508 34.2338,45.4717 35.6886,44.9304C 34.6319,44.2198 33.3344,43.1212 32.0647,41.462C 25.2115,43.0854 19.3715,26.5569 22.1667,22.3642C 23.4432,19.8111 25.2343,20.7476 26.9177,22.7103L 26.9167,22.3642C 26.9167,20.6153 31.8788,19.1975 38,19.1975 Z M 52.25,24.5412C 52.25,22.4696 50.6313,24.3217 48.8058,27.7386C 48.3257,32.1534 47.2683,35.5363 45.9943,38.1191C 49.9621,36.598 52.25,28.5786 52.25,24.5412 Z M 23.75,24.5412C 23.75,28.5786 26.0378,36.598 30.0057,38.1191C 28.7317,35.5363 27.6743,32.1534 27.1942,27.7386C 25.3687,24.3217 23.75,22.4696 23.75,24.5412 Z "
              />
            </svg>
          </span>
          <span className="Lottery--button-text">Winners</span>
          <span className="ml-auto">
            <svg
              width="9"
              height="10"
              viewBox="0 0 9 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.50142 6.19886L0.728693 9.78977V7.77273L6.25142 5.40341L6.18892 5.51136V5.25L6.25142 5.35795L0.728693 2.98864V0.971591L8.50142 4.5625V6.19886Z"
                fill="#B01908"
              />
            </svg>
          </span>
        </div>
        <div
          className="Lottery--button"
          onClick={() => navigate(ROUTE_LOG_OF_LUCK)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 5V10L13.3333 11.6667"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="Lottery--button-text">History</span>
          <span className="ml-auto">
            <svg
              width="9"
              height="10"
              viewBox="0 0 9 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.50142 6.19886L0.728693 9.78977V7.77273L6.25142 5.40341L6.18892 5.51136V5.25L6.25142 5.35795L0.728693 2.98864V0.971591L8.50142 4.5625V6.19886Z"
                fill="#B01908"
              />
            </svg>
          </span>
        </div>
      </div>
    </>
  );
};

export default LotteryHeader;
