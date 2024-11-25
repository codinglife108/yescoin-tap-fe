import React, { useCallback, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import InformationModal from "../../modals/InformationModal";
import { useNavigate } from "react-router-dom";
import Panel from "../../components/Panel/Panel";
import {
  hideButton,
  setButtonText,
  showButton,
} from "../../utils/tgButtonUtils";

const contentData = [
  {
    video: "/tutorialLottery/Video1.mov",
    title: "What is this?",
    content: (
      <span>
        Introducing Giveaway - Hello, Wheel of Luck!
        <br />
        <br />
        Spin the wheel for free and get a chance to win exciting prizes like
        USDT, Yescoin, Telegram Premium, free spins, and in-game bonuses.
        <br />
        <br />
        Every spin guarantees a reward! <br />
        <br />
        This is the first-ever revenue-sharing model featuring a raffle system
        within the app. All revenue generated from in-app advertising will be
        added to the jackpot and prizes, and distributed to the community.
      </span>
    ),
  },
  {
    video: "/tutorialLottery/Video2.mov",
    title: "How to win?",
    content: (
      <span>
        To participate and win, simply spin the wheel. Each spin costs either
        one ticket or 100,000 Yescoin. If you have tickets in your balance, they
        will be used first. Once your tickets are depleted, Yescoin will be used
        for subsequent spins.
      </span>
    ),
  },
  {
    video: "/tutorialLottery/Video3.mp4",
    title: "Prizes",
    content: (
      <span>
        The current prize pool offers up to $2,400,000 in annual prizes , up to
        $200,000 in monthly prizes specifically for this beta testing phase. The
        prize pool will grow significantly in future stages, increasing in
        proportion to the growth of advertising revenue.
        <br />
        <br />
        Here’s how the rewards are divided:
        <br />
        &nbsp;- 169,000$
        <br />
        &nbsp;- 5,6B Yescoin
        <br />
        &nbsp;- 11,000$ in telegram premium
        <br />
        &nbsp;- Free spins
        <br />
        &nbsp;- Rockets
        <br />
      </span>
    ),
  },
  {
    video: "/tutorialLottery/Video4.mov",
    title: "Win with your Friends",
    content: (
      <span>
        Win even if you don’t win!
        <br />
        Whenever a friend wins a prize in USDT, you'll receive a 10% bonus on
        their winnings. This 10% is an extra reward and doesn’t reduce your
        friend's prize.
        <br />
        <br />
        Additionally, if a friend of your friend wins, you’ll earn a 5% bonus on
        their prize. Once again, this bonus is added on top and does not affect
        the winner's reward. <br />
        <br />
        Cool huh 😎
      </span>
    ),
  },
  {
    video: "/tutorialLottery/Video5.mp4",
    title: "How to claim prizes?",
    content: (
      <span>
        All your winnings are displayed in the "History" section of the game.
        <br />
        Once you've won, we will perform a standard account check to ensure
        everything is in order. You will then receive all the necessary
        information regarding your rewards.
        <br />
        <br />
        After the checks are completed and everything is confirmed, the prizes
        will be sent to the wallet linked to the Yescoin app. For Telegram
        Premium, it will be gifted directly through fragment.com based on your
        username. <br />
        In-game rewards such as Yescoin, Rockets and free spins are credited
        immediately.
      </span>
    ),
  },
];
//@ts-ignore
const tg = window.Telegram.WebApp;
const TutorialPage: React.FC = () => {
  const sliderRef = useRef<Slider | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [termsChecked, setTermsChecked] = useState(false);
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    dotsClass: "Lottery-tutorial--custom-dots",
    afterChange: (current: number) => {
      setCurrentIndex(current);
      console.log({ currentIndex });
    },
  };
  const handleNext = useCallback(() => {
    console.log(currentIndex);
    if (currentIndex === contentData.length - 1) {
      if (localStorage.getItem("termsChecked")) {
        window.history.back();
      } else {
        setOpenTermsModal(true);
      }
    }
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  }, [currentIndex]);
  useEffect(() => {
    hideButton();
    setTimeout(() => {
      setButtonText("Next");
      showButton();
    }, 50);
    return () => {
      hideButton();
      // @ts-ignore
tg.MainButton.offClick(handleNext);
    };
  }, []);
  useEffect(() => {
    // @ts-ignore
tg.MainButton.onClick(handleNext);
    return () => {
      // @ts-ignore
tg.MainButton.offClick(handleNext);
    };
  }, [currentIndex]);
  return (
    <Panel style={{ height: "100vh", background: "#100d10", padding: 0 }}>
      <Slider
        {...settings}
        ref={sliderRef}
        className="h-full pb-16 min-h-screen Lottery-tutorial--slider"
      >
        {contentData.map((item, index) => (
          <div key={index} className="px-4 pt-4 ">
            <div
              className="flex items-center justify-center"
              style={{ width: "100%", aspectRatio: 1 }}
            >
              <video
                src={item.video}
                loop
                muted
                autoPlay
                controls={false}
                playsInline
                className="w-full rounded-2xl"
              />
            </div>
            <h1 className="text-white text-2xl mt-4 px-4">{item.title}</h1>
            <p className="text-white mt-2 px-4">{item.content}</p>
          </div>
        ))}
      </Slider>
      {openTermsModal && (
        <InformationModal
          floatingCenter
          buttonText={"Submit"}
          isBoost={false}
          containerStyle={{
            width: "75vw",
            height: "auto",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
          close={false}
          callback={() => {
            localStorage.setItem("termsChecked", "true");
            setOpenTermsModal(false);
            window.history.back();
          }}
          disabled={!termsChecked}
          itemData={{
            icon: (
              <img
                src={"/tutorialLottery/termsfile.png"}
                style={{ padding: "16px" }}
                width={120}
                alt={"modal-from-bottom"}
              />
            ),
            title: "",
            Description: () => (
              <span className="text-center">
                <p className="text-white text-center my-4 font-semibold px-2">
                  By checking this box, I confirm that I have read, understood,
                  and agree to the Terms and Conditions
                </p>
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`Lottery-tutorial--checkbox-container ${
                      termsChecked ? "checked" : "unchecked"
                    }`}
                    onClick={() => setTermsChecked(!termsChecked)}
                  >
                    {termsChecked && (
                      <span className="Lottery-tutorial--checkbox-checkmark">
                        ✓
                      </span>
                    )}
                  </div>
                  <a
                    href="https://telegra.ph/Terms-and-Conditions-08-09"
                    target="_blank"
                    className="font-semibold ml-3 my-0 Lottery-tutorial--terms-link"
                  >
                    Terms & Conditions
                  </a>
                </div>
              </span>
            ),
            value: 0,
            level: 1,
          }}
        />
      )}
    </Panel>
  );
};
export default TutorialPage;
