/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import Wheel from "../assets/lottery/Wheel.svg";
import Handle from "../assets/lottery/handle.svg";
import ModalStories from "../panels/Campaigns/ModalStories";
import { useNavigate } from "react-router-dom";

const WheelOfFortune = ({
  prize,
  setRotating: setSpinning,
  winnedData
}: {
  prize: string;
  setRotating: (value: boolean) => void;
  setAnimationEnd: (value: boolean) => void;
  rotating: boolean;
  winnedData: any;
  animationEnd: boolean;
}) => {
  //ticket ****spin / rocket / yescoin / USDT / telegram gratis***
  const prizes = [
    "rocket",
    "spin",
    "rocket_1",
    "yescoin",
    "spin_1",
    "USDT",
    "telegram gratis",
  ];
  const [winnedPrize, setWinnedPrize] = useState<string>("");
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();
  const [props, api] = useSpring(() => ({
    from: { rotation: 0 },
    config: { duration: 5000, easing: (t) => 1 - Math.pow(1 - t, 3) },
  }));
  const spinWheel = useCallback(
    (forcedPrize: any = null) => {
      setSpinning(true);

      let totalRotation;
      const minNumberOfRotation = Math.floor(Math.random() * 3) + 5;
      if (forcedPrize) {
        const prizeIndex = prizes.indexOf(forcedPrize);
        setWinnedPrize(forcedPrize);
        const sectorAngle =
          (360 / prizes.length) * (prizeIndex <= 2 ? 1.3 : 1.1);
        totalRotation =
          360 * minNumberOfRotation + (360 - prizeIndex * sectorAngle - sectorAngle / 2 + 90);
      } else {
        totalRotation = 360 * minNumberOfRotation + Math.random() * 360;
      }

      api.start({
        to: { rotation: totalRotation },
        onRest: () => {
          setSpinning(false);
          setTimeout(() => {
            api.set({ rotation: 0 });
          }, 200);
          determineWinner();
        },
      });
    },
    [api, prizes]
  );

  const determineWinner = () => {
    // alert("Hai vinto " + winnedData.prize);
    setTimeout(() => {
      navigate(`/winLottery`, { state: winnedData });
    }, 300);
  };

  const forceWin = (prize: string) => {
    spinWheel(prize);
  };
  useEffect(() => {
    if (prize && started) forceWin(prize);
    else {
      setStarted(true);
    }
  }, [prize]);
  return (
    <div className="flex flex-col items-center Lottery--wheel-wrapper">
      <div>
        <animated.div
          className="Lottery--wheel-container"
          style={{
            transform: props.rotation.to((r) => `rotate(${r - 180}deg)`),
          }}
        >
          <img className="Lottery--wheel-wheel" src={Wheel} alt="Wheel" />
        </animated.div>
        <div className="Lottery--wheel-handle">
          <img src={Handle} alt="Handle" />
        </div>
      </div>
      {/*<div className="flex flex-wrap justify-center gap-2 mt-4">*/}
      {/*    <button*/}
      {/*        onClick={() => spinWheel()}*/}
      {/*        disabled={spinning}*/}
      {/*        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"*/}
      {/*    >*/}
      {/*        {spinning ? 'Girando...' : 'Gira la Ruota!'}*/}
      {/*    </button>*/}
      {/*    {prizes.map((prize, index) => (*/}
      {/*        <button*/}
      {/*            key={index}*/}
      {/*            onClick={() => forceWin(prize)}*/}
      {/*            disabled={spinning}*/}
      {/*            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"*/}
      {/*        >*/}
      {/*            Vinci {prize}*/}
      {/*        </button>*/}
      {/*    ))}*/}
      {/*</div>*/}
    </div>
  );
};

export default WheelOfFortune;
