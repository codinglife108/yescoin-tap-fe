import { FC, useState } from "react";
import { WalletType } from "../utils/wallet";
import { Skeleton } from "@nextui-org/react";

interface WalletIconProps {
    imgSrc: string,
    type: WalletType,
    onClick: (type: WalletType) => void
}
const WalletIcon:FC <WalletIconProps>= ({imgSrc,type, onClick}: WalletIconProps) => {
    const [isLoading, setIsLoading] = useState(true);
    return (
        <div className="p-2 border rounded-xl cursor-pointer border-gray-300/30 flex items-center" onClick={() => onClick(type)}>
            <img src={imgSrc} style={{ visibility: isLoading ? 'hidden' : 'visible' }} onLoad={() => setIsLoading(false)} width={100} className="rounded-xl"/>
            {isLoading&&
                <div className='w-full h-full flex justify-center items-center'>
                    <Skeleton
                        style={{
                            width: '100px',
                            height: "100px"
                        }}
                    />
                </div>
            }
        </div>
    )
}

export default WalletIcon;