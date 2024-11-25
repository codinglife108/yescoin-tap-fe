import { FC } from "react";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import { ROUTE_HOME } from "../../routes";
// @ts-ignore
const tg = window['Telegram'].WebApp;
const BlockGame :FC = () => {
    //@ts-ignore
    const tgId = tg['initDataUnsafe']['user']['id'];
    const blockgameId = process.env.BLOCKGAME_ID
    return (
        <div>
            <TelegramBackButton url={ROUTE_HOME}/>
            <div id="Panel" className="Panel--container p-0">
                <iframe style={{width: '100%', height:"100%"}}  src={`https://trk301.com/offerwall?adunit_id=${blockgameId}&user_id=${tgId}`}></iframe>
            </div>
        </div>
    )
}

export default BlockGame;