import React, { FC, useEffect, useState } from "react";
import Panel from "../../components/Panel/Panel";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import Spacing from "../../components/Spacing/Spacing";
import IconText from "../../components/IconText/IconText";
import CellContainer from "../../components/CellContainer/CellContainer";
import Cell from "../../components/Cell/Cell";
import Img from "../../components/Img/Img";
import Icon16Chevron from "../../assets/icons/Icon16Chevron";
import EmojiRectangle from "../../components/EmojiRectangle/EmojiRectangle";
import { useTranslation } from "react-i18next";
import { fetchData } from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import {
  DefaultStateType,
  getDispatchObject,
  REDUCE_GOLD,
  REDUCE_ROCKET,
  SET_GOLD_PER_CLICK,
  SET_TOAST,
} from "../../store/reducer";
import { Skeleton } from "@nextui-org/react";
import useModal from "../../hooks/useModal";
import { MODAL_BOOST_ENERGY } from "../../routes";
import BackgroundGlow from "../../components/BackgroundGlow/BackgroundGlow";
import { formatNumberWithSpaces } from "../../utils/mathUtils";
import "./boost.css";
import ScoreBar from "../Home/components/ScoreBar/ScoreBar";
import InformationModal from "../../modals/InformationModal";
import Rocket from "../../assets/icons/rocketImage.svg";
import Ticket from "../../assets/icons/ticket.svg";
import { copyText } from "../../utils/utils";

//todo: full energy / tap bot / da riformattare /  translations / issued and burned / boost subtitles
const mapNametoDescription = {
  multiclick: () => (
    <p className="text-center text-md">
      Increase the amount of Yescoin <br />
      you can earn per one tap.
    </p>
  ),
  autoclick: () => (
    <p className="text-center text-md">
      Increase the amount of Yescoin <br />
      you can earn offline.
    </p>
  ),

  rechargingSpeed: () => (
    <p className="text-center text-md">
      Increase the amount of Speed <br />
      Energy will be recharged
    </p>
  ),
  energyLimit: () => (
    <p className="text-center text-md">
      Increase the energy limit <br />
    </p>
  ),
};
const Boosts: FC = () => {
  const [loadingBoosts, setLoadingBoosts] = useState(false);
  const [boosts, setBoosts] = useState<any>(null);
  const [dailyBoosts, setDailyBoosts] = useState<any>(null);
  const [selectedBoost, setSelectedBoost] = useState<{
    level: number;
    icon: string;
    price: number;
    title: string;
  } | null>(null);
  const { t } = useTranslation();
  const { setActiveModal } = useModal();
  /* const rocket = useSelector((selector: DefaultStateType) => selector.rocket); */
  const gold = useSelector((selector: DefaultStateType) => selector.gold);
  /* const usdt = useSelector((selector: DefaultStateType) => selector.usdt); */
  const lastAutoClickActivityMs = useSelector(
    (selector: DefaultStateType) => selector.lastAutoClickActivityMs
  );
  const dailyEnergy = useSelector(
    (selector: DefaultStateType) => selector.dailyEnergy
  );
  const rocket = useSelector((selector: DefaultStateType) => selector.rocket);
  const ticket = useSelector((selector: DefaultStateType) => selector.ticket);
  const dispatch = useDispatch();
  console.log({ rocket, ticket });
  // todo
  const availableEnergy = 172800 - ((dailyEnergy ?? 172800) - 172800);

  useEffect(() => {
    fetchBoosts().then();
  }, []);

  const fetchBoosts = async () => {
    setLoadingBoosts(true);

    const response = await fetchData("/boosts/get");
    if (response.error) {
      return;
    }
    setBoosts(response.result?.result);
    setDailyBoosts(response.result?.dailyBoost[0]);
    // copyText(response.result?.dailyBoost[0]?.lastUse)

    setLoadingBoosts(false);
  };

  const buy = async (boost: any, withRockets?: boolean) => {
    if (withRockets && rocket && rocket < boost.updateCostRocket) {
      dispatch(
        getDispatchObject(SET_TOAST, {
          open: true,
          message: "Not enough rockets",
          type: "error",
        })
      );
      return;
    }
    if (!withRockets && gold && gold < boost.updateCost) {
      dispatch(
        getDispatchObject(SET_TOAST, {
          open: true,
          message: "Not enough $Yescoin",
          type: "error",
        })
      );
      return;
    }
    const response = await fetchData("/boosts/buy", {
      boost: boost.id,
      payWithRocket: withRockets,
    });
    setSelectedBoost(null);
    if (response.error) {
      return;
    }

    const result = response.result;

    if (result["newGoldPerClick"]) {
      dispatch(
        getDispatchObject(SET_GOLD_PER_CLICK, result["newGoldPerClick"])
      );
    }

    if (result["newGoldPerClick"]) {
      dispatch(
        getDispatchObject(SET_GOLD_PER_CLICK, result["newGoldPerClick"])
      );
    }
    if (withRockets) {
      dispatch(getDispatchObject(REDUCE_ROCKET, boost["updateCostRocket"]));
    } else {
      dispatch(getDispatchObject(REDUCE_GOLD, boost["updateCost"]));
    }
    dispatch(
      getDispatchObject(SET_TOAST, {
        open: true,
        message: "Boost purchased successfully",
        type: "success",
      })
    );
    fetchBoosts().then();
  };

  const confirm = async (boost: any) => {
    if (boost.id === "energy") {
      setActiveModal(MODAL_BOOST_ENERGY);
      return;
    }

    if (boost["updateCost"] === -1 || gold === null) {
      return;
    }

    if (
      boost["updateCost"] > gold &&
      boost["updateCostRocket"] > (rocket || 0)
    ) {
      // // @ts-ignore
// tg.showAlert(t("boostsNotEnoughROCKETError"), () => {
      // });
      dispatch(
        getDispatchObject(SET_TOAST, {
          open: true,
          message: t("boostsNotEnoughROCKETError"),
          type: "error",
        })
      );
      return;
    }
    setSelectedBoost({
      level: boost.level,
      icon: boost.emoji,
      price: boost.updateCost,
      title: boost.title,
      ...boost,
    });
  };

  return (
    <Panel>
      <TelegramBackButton />

      <BackgroundGlow
        color1="#FE2B3A"
        color2="#B01908"
        color3="#000"
        vertical="bottom"
      />

      <Spacing size={(window.innerHeight / 800) * 6} />
      <Spacing size={12} />
      <p className={"text-center"}>Your balance</p>
      <Spacing size={24} />
      <ScoreBar noLeague />
      {/* <div className="flex justify-center items-center gap-4 mt-4">
        <div className="flex items-center gap-2 text-white ">
          <img src={Rocket} alt="Rocket" />
          {rocket}
        </div>
        <div className="flex items-center gap-2 text-white">
          <img src={Ticket} alt="Ticket" />
          {ticket}
        </div>
      </div> */}
      <Spacing size={16} />
      <p className={"font-bold"}>Free daily Boosts</p>
      <Spacing size={24} />
      <div className={"flex gap-1"}>
        <CellContainer xs>
          <Cell
            title={"Full Energy"}
            onClick={async () => {
              try {
                const res = await fetchData("/boosts/useDailyReward", {
                  dailyBoostName: "fullEnergyBoost",
                });
                if (res.error) {
                  dispatch(
                    getDispatchObject(SET_TOAST, {
                      open: true,
                      message: "Boost needs to be recharged",
                      type: "error",
                    })
                  );
                  return;
                }
                dispatch(
                  getDispatchObject(SET_TOAST, {
                    open: true,
                    message: "Energy recharged successfully",
                    type: "success",
                  })
                );
                await fetchBoosts();
              } catch (e) {
                dispatch(
                  getDispatchObject(SET_TOAST, {
                    open: true,
                    message: "Boost needs to be recharged",
                    type: "error",
                  })
                );
              }
            }}
            before={
              <EmojiRectangle>
                <Img src={require(`../../assets/images/emoji/lightning.png`)} />
              </EmojiRectangle>
            }
          >
            <span className={"text-sm"}>
              {(() => {
                const lastUseTime = new Date(
                  dailyBoosts?.lastUse || 0
                ).getTime();
                const currentTime = Date.now();
                const timeDifference = currentTime - lastUseTime;
                const hoursPassed = timeDifference / (1000 * 60 * 60);

                return hoursPassed >= 24
                  ? "Ready"
                  : Math.floor(24 - hoursPassed) + " hours left";
              })()}
            </span>
          </Cell>
        </CellContainer>
      </div>
      <Spacing size={24} />
      <p className={"font-bold"}>Boosts</p>
      <Spacing size={24} />

      <CellContainer>
        {loadingBoosts && (
          <Skeleton
            style={{
              width: "100%",
              height: 48,
              borderRadius: 16,
            }}
          />
        )}

        {!loadingBoosts &&
          boosts !== null &&
          boosts &&
          boosts?.map((boost: any, index: number) => (
            <Cell
              key={index}
              title={boost.name}
              after={(gold ?? 0) >= boost.cost ? <Icon16Chevron /> : null}
              onClick={() => confirm(boost)}
              before={
                <EmojiRectangle>
                  <Img
                    src={require(`../../assets/images/emoji/${boost.emoji}.png`)}
                  />
                </EmojiRectangle>
              }
            >
              {!["energy"].includes(boost.id) && (
                <>
                  <div>{boost["level"]} lvl</div>

                  {boost["updateCost"] !== -1 && (
                    <>
                      <div>·</div>
                      <IconText
                        size="small"
                        imgPath={require("../../assets/images/coins/rocket_coin_back_36x36.png")}
                        text={`${boost["updateCost"]}`}
                        textColor={
                          boost["updateCost"] > (gold || 0)
                            ? "red"
                            : "var(--gray_light_color)"
                        }
                      />
                      {/* <div>·</div> */}
                      {/* <IconText
                        size="small"
                        imgPath={Rocket}
                        text={`${boost["updateCostRocket"]}`}
                        textColor={
                          boost["updateCostRocket"] > (rocket || 0)
                            ? "red"
                            : "var(--gray_light_color)"
                        }
                      /> */}
                    </>
                  )}
                </>
              )}

              {boost.id === "energy" && (
                <IconText
                  size="small"
                  imgPath={require("../../assets/images/emoji/lightning.png")}
                  text={`${formatNumberWithSpaces(availableEnergy)} / 172,800`}
                  textColor={
                    boost["updateCost"] > (gold || 0)
                      ? "red"
                      : "var(--gray_light_color)"
                  }
                />
              )}

              {boost.id === "autoclick" && lastAutoClickActivityMs === null && (
                <IconText
                  size="small"
                  imgPath={
                    (gold ?? 0) < boost.cost
                      ? require("../../assets/images/emoji/lock.png")
                      : require("../../assets/images/coins/rocket_coin_back_36x36.png")
                  }
                  text={`${formatNumberWithSpaces(boost["cost"])}`}
                  textColor={
                    boost["updateCost"] > (gold || 0)
                      ? "red"
                      : "var(--gray_light_color)"
                  }
                />
              )}

              {/*{boost.id === "autoclick" && lastAutoClickActivityMs !== null && (*/}
              {/*    <IconText*/}
              {/*        size="small"*/}
              {/*        imgPath={require("../../assets/images/emoji/white_check_mark.png")}*/}
              {/*        text={`Active`}*/}
              {/*        textColor={boost["updateCost"] > (gold||0) ? "red":"var(--gray_light_color)"}*/}
              {/*    />*/}
              {/*)}*/}
            </Cell>
          ))}
      </CellContainer>
      {selectedBoost && (
        <InformationModal
          isBoost
          itemData={{
            title: selectedBoost.title,
            value: selectedBoost.price,
            // @ts-ignore
            Description: mapNametoDescription[selectedBoost.id],
            level: selectedBoost.level,
            icon: (
              <Img
                style={{ objectFit: "contain" , width: "120px"}}
                src={require(`../../assets/images/emoji/${selectedBoost?.icon}_big.png`)}
              />
            ),
          }}
          close={() => setSelectedBoost(null)}
          callback={(withRockets) => buy(selectedBoost, withRockets)}
        />
      )}
    </Panel>
  );
};

export default Boosts;
