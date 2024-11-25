import React, { FC, useEffect, useState } from "react";
import Panel from "../../components/Panel/Panel";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import Placeholder from "../../components/Placeholder/Placeholder";
import Img from "../../components/Img/Img";
import Spacing from "../../components/Spacing/Spacing";
import Cell from "../../components/Cell/Cell";
import IconText from "../../components/IconText/IconText";
import CellContainer from "../../components/CellContainer/CellContainer";
import TaskInstructionCell from "../../components/TaskInstructionCell/TaskInstructionCell";
import Icon16Chevron from "../../assets/icons/Icon16Chevron";
import Container from "../../components/Container/Container";
import { useTranslation } from "react-i18next";
import EmojiRectangle from "../../components/EmojiRectangle/EmojiRectangle";
import { fetchData, fetchDataAxios } from "../../utils/api";
import { Skeleton } from "@nextui-org/react";
import { formatNumberWithSpaces } from "../../utils/mathUtils";
import { MODAL_TASK_CHANNEL, MODAL_TASK_INPUT } from "../../routes";
import useModal from "../../hooks/useModal";
import BackgroundGlow from "../../components/BackgroundGlow/BackgroundGlow";
import { useDispatch } from "react-redux";
import { ADD_GOLD, getDispatchObject } from "../../store/reducer";
import TaskConnectWallet from "../../components/TaskConnectWallet/TaskConnectWallet";
import TaskDailyReward from "../../components/TaskDailyReward/TaskDailyReward";


enum AdsgramAdStatus {
  SEARCHING,
  NOT_AVAILABLE,
  AVAILABLE,
  REWARDED
}

// @ts-ignore
const tg = window['Telegram'].WebApp;

const Tasks: FC = () => {

  const ADSGRAM_AD_REWARD = 5000;

  const [tasks, setTasks] = useState<any>(null);
  const [dailyReward, setDailyReward] = useState<any>({
    level: 0,
    reward: 0,
    completed: false,
  });
  const [tasksLoading, setTasksLoading] = useState(false);

  const [adsgramAdStatus, setAdsgramAdStatus] = useState<AdsgramAdStatus>(AdsgramAdStatus.SEARCHING);

  const { t } = useTranslation();

  const { setActiveModal } = useModal();
  const dispatch = useDispatch();

  useEffect(() => {
    fetch().then();
    createEventListeners();

    return () => {
      removeEventListeners();
    };
  }, []);

  const createEventListeners = () => {
    document.addEventListener("TASKS_UPDATE", fetch);
  };

  const removeEventListeners = () => {
    document.removeEventListener("TASKS_UPDATE", fetch);
  };

  const fetch = async () => {
    setTasksLoading(true);

    const response = await fetchData("/tasks/get");
    const responseDailyReward = await fetchData("/tasks/getDailyFixedReward");
    console.log(responseDailyReward);

    if (response.error || responseDailyReward.error) {
      return;
    }

    await checkIfAdsgramAdIsAvailable();

    setTasks(response.result);
    setDailyReward(responseDailyReward.result);
    setTasksLoading(false);
  };

  const goToModal = (task: any) => {
    if (task["award"] === -1 && task["require_input"] === true) {
      return;
    }

    if (task["require_input"] === true) {
      setActiveModal(MODAL_TASK_INPUT, task);
      return
    }

    if (task["botaddress"]) {
      // @ts-ignore
tg.openTelegramLink(`https://t.me/${task['botaddress'].replace('@', '')}`);
    } else if (task["link"]) {
      let link = task['link']      
      if (link.startsWith("https://t.me/")) {
        // @ts-ignore
tg.openTelegramLink(link);
      } else {
        // @ts-ignore
tg.openLink(link);
      }
    } else if (task["channeladdress"]) {
      // @ts-ignore
tg.openTelegramLink(`https://t.me/${task['channeladdress'].replace('@', '')}`);
    }
    setActiveModal(MODAL_TASK_CHANNEL, task);
  };

  const renderTask = (task: any, index: number) => {
    // if (task["type"] === "connect_bitget_wallet") {
    //   return <TaskConnectWallet taskId={task["id"]} reward={task["award"]} isCompleted={task["award"] === -1} />
    // }

    return (
      <Cell
        key={index}
        //title={channel['channelAddress'] ?? channel['link']}
        title={task["title"] ?? task["channeladdress"] ?? task["link"] ?? task["botaddress"]}
        after={task["award"] !== -1 && <Icon16Chevron />}
        onClick={() => goToModal(task)}
        before={
          <EmojiRectangle>
            <Img
              radius={0}
              src={require("../../assets/images/emoji/money_fly.png")}
            />
          </EmojiRectangle>
        }
      >
        {task["award"] === -1 ? (
          "completed"
        ) : (
          <IconText
            size="small"
            imgPath={require("../../assets/images/coins/rocket_coin_back_36x36.png")}
            text={`${formatNumberWithSpaces(task["award"])}`}
          />
        )}
      </Cell>
    );
  };

  const checkIfAdsgramAdIsAvailable = async () => {
    let isAvailable = false
    try {
      // @ts-ignore
      isAvailable = await window.AdController.load()
    } catch (e) {
      console.log("🔴 ERROR");
      console.log(e);
    }

    console.log("Adsgram Ad available?", isAvailable);
    
    setAdsgramAdStatus(isAvailable ? AdsgramAdStatus.AVAILABLE : AdsgramAdStatus.NOT_AVAILABLE)
    return isAvailable
  }

  const playAdsgramAd = async () => {
    if (adsgramAdStatus === AdsgramAdStatus.NOT_AVAILABLE) {
      return;
    }

    console.log("playAdsgramClicked");

    // Check once more if the ad is available, as some time could have passed and the ad expired
    const isAvailable = await checkIfAdsgramAdIsAvailable()

    if (!isAvailable) {
      window.alert("Sorry, the Ad is not available anymore. Try again later.");
      return;
    }

    let continueAfterDisclaimer = window.confirm("Ads are provided by third parties: this is not financial advice. Do your own research.")
    if (!continueAfterDisclaimer) {
      return;
    }

    try {
      // @ts-ignore
      let watchStatus = await window.AdController.show()
      
      if (!watchStatus.done || watchStatus.done !== true) {
        // Ad not watched till the end
        window.alert("You must watch the Ad till the end to collect your reward.");
      } else {
        console.log("🟢 SUCCESS");
        console.log(watchStatus);
        
        await claimAdsgramAdReward();
      }

    } catch (e) {
        console.log("🔴 ERROR");
        console.log(e);
        window.alert("You must watch the Ad till the end to collect your reward.");
    }
  };

  const claimAdsgramAdReward = async () => {    
    const response = await fetchDataAxios("/tasks/claimAdsgramAdReward", {
      viewCompletedAt: new Date().getTime(),
      reference: process.env.REACT_APP_ADSGRAM_BLOACK_ID
    });

    if (response.error) {
      return;
    }

    if (!response.result.success) {
      window.alert("Sorry, we failed giving you a reward.");
      return 
    }

    setAdsgramAdStatus(AdsgramAdStatus.REWARDED)
    dispatch(getDispatchObject(ADD_GOLD, Number(ADSGRAM_AD_REWARD)));

    const event = new Event("TASKS_UPDATE");
    document.dispatchEvent(event);

    window.alert(`🥳 you were awarded ${formatNumberWithSpaces(ADSGRAM_AD_REWARD)} tokens!`);
  }

  const renderAdsgramAdReward = () => {
    return (
      <Cell
        key="adsgramAdReward"
        title={`Watch an Ad`}
        after={adsgramAdStatus === AdsgramAdStatus.AVAILABLE && <Icon16Chevron />}
        onClick={() => playAdsgramAd()}
        before={
          <EmojiRectangle>
            <Img
              radius={0}
              src={require("../../assets/images/emoji/money_fly.png")}
            />
          </EmojiRectangle>
        }
      >
        {adsgramAdStatus === AdsgramAdStatus.NOT_AVAILABLE ? (
          "not available yet"
        ) : (adsgramAdStatus === AdsgramAdStatus.REWARDED ? (
          "rewarded"
        ) : ( 
          <IconText
            size="small"
            imgPath={require("../../assets/images/coins/rocket_coin_back_36x36.png")}
            text={`${formatNumberWithSpaces(ADSGRAM_AD_REWARD)}`}
          />
        ))}
      </Cell>
    );
  };

  return (
    <Panel>
      <TelegramBackButton />

      {/*<BackgroundGlow
                color1="rgba(142, 108, 186, 0)"
                color2="rgba(255, 161, 0, .5)"
                vertical="top"
            />*/}

      <BackgroundGlow
        color1="rgba(112, 0, 255, 1)"
        color2="rgba(142, 108, 186, 0)"
        vertical="bottom"
      />

      <Placeholder title={t("navbarTasks")} />

      <Spacing size={32} />

      <TaskInstructionCell />

      <Spacing size={32} />

      <CellContainer>
        {tasksLoading && (
          <Skeleton
            style={{
              width: "100%",
              height: 48,
              borderRadius: 16,
            }}
          />
        )}

        {!tasksLoading &&
          dailyReward !== null &&
          <TaskDailyReward dailyReward={dailyReward} setDailyReward={setDailyReward} />}

        {!tasksLoading && renderAdsgramAdReward()}

        {!tasksLoading &&
          tasks !== null &&
          tasks.tasks.map((task: any, index: number) =>
            renderTask(task, index)
          )}
      </CellContainer>
    </Panel>
  );
};

export default Tasks;