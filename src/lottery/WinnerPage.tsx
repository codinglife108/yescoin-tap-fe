import { useLocation, useNavigate } from "react-router-dom";
import Panel from "../components/Panel/Panel";
import TelegramBackButton from "../components/TelegramBackButton/TelegramBackButton";
import { ROTATING_STAR } from "./Animations/InterfacesAndConstants";
import getAnimationFromTag from "./Animations/getAnimationFromTag";
import { useEffect } from "react";
import { ROUTE_LOTTERY } from "../routes";
import { hideButton, setButtonLoader, setButtonText, showButton } from "../utils/tgButtonUtils";
// @ts-ignore
const tg = window.Telegram.WebApp;

const typeToGradient = {
  "telegram gratis":
    "linear-gradient(45deg, #5597F9 0%, #855DFB 50%, #EE4EC6 100%)",
  spin: "linear-gradient(45deg, #CB73EB 0%, #FB7AA1 50%, #FCAA85 100%)",
  USDT: "linear-gradient(180deg, #AE8625 0%, #F7EF8A 50%, #D2AC47 75%, #EDC967 100%)",
  yescoin: "linear-gradient(45deg, #B01908 0%, #FE2B3A 50%, #FF9416 100%)",
  rocket: "linear-gradient(45deg, #75D9F9 0%, #4E93FB 69.5%)",
};
type Prize = {
  rewardType: "telegram gratis" | "spin" | "USDT" | "yescoin" | "rocket";
  prize: string;
};

export default function WinnerPage() {
  const { state } = useLocation();
  console.log(state);
  const winnedPrize = {
    ...state,
    type: state.type?.split("_")[0] || "rocket",
  } as Prize;
  const navigate = useNavigate();
  const onTelegramButtonClick = () => {
    window.history.back();
  };
  useEffect(() => {
    hideButton();
    setTimeout(() => {
      setButtonText("Grab the prize");
      setButtonLoader(false)
      showButton();
    }, 50);
    setButtonText("Grab the prize");
    
    // @ts-ignore
tg.MainButton.onClick(onTelegramButtonClick);
    return () => {
      // @ts-ignore
tg.MainButton.offClick(onTelegramButtonClick);
      hideButton();
    };
  }, []);
  const title = `You won ${winnedPrize.prize.replace("telegram gratis", "Telegram Premium").replace("yescoin", "$Yescoin").replace("usdt", "USDT")}`;
  return (
    <Panel
      style={{
        background: typeToGradient[winnedPrize.rewardType],
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <TelegramBackButton />
      {getAnimationFromTag(winnedPrize.rewardType)}
      <h1 className="text-white text-center">{title}{winnedPrize.rewardType === "USDT" && ` in USDT` || winnedPrize.rewardType === "yescoin" && ` in $Yescoin`}</h1>
    </Panel>
  );
}
