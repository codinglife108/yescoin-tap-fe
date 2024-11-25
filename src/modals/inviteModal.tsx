import React, { ReactNode, useEffect, useState } from "react";
import { CancelOutlined } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip'
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
    sendCallback: () => void;
    copyCallback: () => void;
    itemData: {
        title: string;
        subtitle: string;
    };
    sendButtonText?: string;
    copyButtonText?: string;
    containerStyle?: React.CSSProperties;
}

function InviteModal({
    close,
    sendCallback,
    copyCallback,
    itemData,
    sendButtonText = "Send",
    copyButtonText = "Copy link",
    containerStyle,
}: BoostConfirmationModalProps) {
    const { title, subtitle } = itemData;
    const [isVisible, setIsVisible] = useState(false);
    const [tooltip, setTooltip] = useState(false)
    useEffect(() => {
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
            className={`boost-confirmation--container`}
            onClick={handleClose}
        >
            <div
                className={`boost-confirmation--panel ${isVisible ? "visible" : ""} h-[fit !important]`}
                onClick={(e) => e.stopPropagation()}
                style={containerStyle}
            >
                {close && (
                    <div className="boost-confirmation--close" onClick={handleClose}>
                        <CancelOutlined />
                    </div>
                )}
                {title && (
                    <p
                        className={`text-center font-bold text-4xl`}
                    >
                        {title}
                    </p>
                )}
                {subtitle && (
                    <>
                        <br></br>
                        <p
                            className={`text-center text-1xl`}
                        >
                            {subtitle}
                        </p>
                    </>
                )}
                <br></br>
                <br></br>
                <br></br>
                <Button
                    size="lg"
                    style={{ minHeight: 50 }}
                    onClick={sendCallback}
                    className={`w-full bg-blue`}
                >
                    {sendButtonText}
                </Button>
                <Button
                    size="lg"
                    style={{ minHeight: 50, background: '#39a9ffed' }}
                    onClick={() => {
                        setTooltip(true)
                        copyCallback();
                    }}
                    className="w-full bg-blue mt-2"
                >
                    {copyButtonText}
                </Button>
            </div>
        </div>
    );
}

export default InviteModal;