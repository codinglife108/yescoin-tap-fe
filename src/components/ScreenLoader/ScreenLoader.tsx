import React, { FC } from "react";
import "./ScreenLoader.css";
import { Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import LoadingScreenGiveawayByBit from "../LoadingScreenGiveawayByBit/LoadingScreenGiveawayByBit";

// @ts-ignore
/* const tg = window["Telegram"]["WebApp"]; */

// todo
interface ScreenLoaderProps {
  content:
    | null
    | "connection"
    | "unSupportPlatform"
    | "manyConnections"
    | "botMigration"
    | "maintainance";
}

const ScreenLoader: FC<ScreenLoaderProps> = ({ content }) => {
  const { t } = useTranslation();

  const openMigrationBot = () => {
    // @ts-ignore
    const tg = window["Telegram"].WebApp;

    // @ts-ignore
tg.openTelegramLink(
      `https://t.me/realyescoinbot?start}`
    );

    // @ts-ignore
tg.close()
  };

  return (
    content && (
      <div
        className={
          content === "botMigration"
            ? "ScreenLoader--botMigrationContainer"
            : "ScreenLoader--container"
        }
        style={ (content === "connection" || content === "manyConnections") ? {backgroundColor: "#000"} : {}}
      >
        {content === "maintainance" && (
          <>
            <div className="ScreenLoader--content" style={{ marginTop: "5vh" }}>
              {/*<Img src={require('../../assets/images/qr.png')} />*/}
              <h1 className="ScreenLoader--content-bot-migration-text">
                Maintainance 🏗️
              </h1>

              <h2 style={{ marginTop: "10vh", marginLeft: "20px", marginRight: "20px" }} >We are working on something, come back in 30 min.</h2>

            </div>
          </>
        )}
        
        {(content === "connection" || content === "manyConnections") && (
          <>
            <div className="ScreenLoader--content"  style={{ marginTop: "10vh"}}>
              <LoadingScreenGiveawayByBit />
              {/* <CountdownToDate targetDate={new Date("2024-08-10T20:00:00+02:00")} />
              <Spinner size="lg" color="default" /> */}
              {/*<h1>{t('connectionTitle')}</h1>*/}
            </div>

            {/*<BottomLayout>
                            <Div>
                                <p style={{textAlign: 'center'}}
                                   className="text-14-medium text-gray">platform: {tg['platform']}</p>
                                <Spacing/>
                            </Div>
                        </BottomLayout>*/}
          </>
        )}

        {content === "unSupportPlatform" && (
          <>
            <div className="ScreenLoader--content" style={{ marginTop: "5vh" }}>
              {/*<Img src={require('../../assets/images/qr.png')} />*/}
              <h1 className="ScreenLoader--content-h1">
                {t("unSupportPlatform")}
              </h1>
            </div>
          </>
        )}

        {content === "botMigration" && (
          <>
            <div className="ScreenLoader--content" style={{ marginTop: "5vh" }}>
              {/*<Img src={require('../../assets/images/qr.png')} />*/}
              <h1 className="ScreenLoader--content-bot-migration-text">
                Yescoin has now moved to @realyescoinbot. Keep playing here👇
              </h1>

              <Button
                onClick={openMigrationBot}
                style={{ marginTop: 32, fontSize: 22, padding: 52 }}
              >
                Play $Yescoin
              </Button>
            </div>
          </>
        )}
      </div>
    )
  );
};

export default ScreenLoader;
