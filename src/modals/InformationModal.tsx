import React, { ReactNode, useEffect, useState } from "react";
import { CancelOutlined } from "@mui/icons-material";
import IconText from "../components/IconText/IconText";
import { formatNumberWithSpaces } from "../utils/mathUtils";
import { Button } from "@nextui-org/react";
import "./modals.css";
import { ModalTypes } from "../hooks/useModal";
// @ts-ignore
const tg = window["Telegram"]["WebApp"];

interface BoostConfirmationModalProps {
  close: (() => void) | false;
  disabled?: boolean;
  callback: (buyWithRockets?: boolean) => void;
  learnMoreLink?: string;
  itemData: {
    title: string;
    value: number;
    level: number;
    icon: ReactNode;
    Description?: any;
    boostDescription?: string;
  };
  buttonText?: string;
  isBoost?: boolean;
  floatingCenter?: boolean;
  modalType?: ModalTypes;
  containerStyle?: React.CSSProperties;
}

function InformationModal({
  close,
  callback,
  itemData,
  isBoost = true,
  buttonText = "Get",
  learnMoreLink,
  disabled = false,
  floatingCenter = false,
  modalType,
  containerStyle,
}: BoostConfirmationModalProps) {
  const { title, value, level, icon, Description, boostDescription } = itemData;
  const [isVisible, setIsVisible] = useState(false);
  const isCustomModal = modalType == ModalTypes.CONNECT_WALLET || modalType == ModalTypes.VOTE_YESCOIN;
  useEffect(() => {
    // Trigger the animation after the component is mounted
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    if (close) {
      setIsVisible(false);
      setTimeout(close, 200); // Wait for the animation to finish before closing
    }
  };
  return (
    <div
      className={`boost-confirmation--container ${floatingCenter ? "floating-center" : ""
        }`}
      onClick={handleClose}
    >
      <div
        className={`boost-confirmation--panel ${isVisible ? "visible" : ""} h-[fit !important]`}
        onClick={(e) => e.stopPropagation()}
        style={containerStyle}
      >
        <div className={`boost-confirmation--icon`}>{icon}</div>
        {close && (
          <div className="boost-confirmation--close" onClick={handleClose}>
            <CancelOutlined />
          </div>
        )}
        {title && (
          <p
            className={`text-center font-bold ${floatingCenter ? "text-2xl" : "text-3xl"
              }`}
          >
            {title}
          </p>
        )}

        {Description ? (
          <Description />
        ) : (
          <p className="text-center text-md">
            Increase the amount of Yescoin <br />
            you can earn per one tap.
          </p>
        )}
        {isBoost && (
          <p className={"text-center text-md"}>
            {boostDescription || "+1 level"}
          </p>
        )}

        {isBoost && (
          <IconText
            size="large"
            centered
            imgPath={require("../assets/images/coins/rocket_coin_back_100x100.png")}
            text={
              <>
                <span className="text-3xl">
                  {formatNumberWithSpaces(value)}
                </span>
                <span className="text-white text-lg opacity-75">
                  / Level {level}
                </span>
              </>
            }
          />
        )}
        {learnMoreLink && (
          <p
            onClick={() => window.open(learnMoreLink, "_blank")}
            className="text-center mb-2"
            style={{ color: "#3b82f6" }}
          >
            Learn more
          </p>
        )}
        <Button
          size="lg"
          disabled={disabled}
          style={{ minHeight: floatingCenter ? 50 : isBoost ? 50 : "unset" }}
          onClick={() => {
            callback();
            if (!isBoost) handleClose();
          }}
          className={`w-full bg-blue-500 ${disabled ? "opacity-50" : ""}`}
        >
          {buttonText}
        </Button>

        {/* We have to enable this code later. for now will disable */}
        {/* {isBoost && (
          <Button
            size="lg"
            style={{ minHeight: floatingCenter ? 50 : isBoost ? 50 : "unset" }}
            onClick={() => {
              callback(true);
              if (!isBoost) handleClose();
            }}
            className="w-full bg-blue-500 mt-2"
          >
            Buy with Rockets
          </Button>
        )} */}
        
      </div>
    </div>
  );
}

export default InformationModal;