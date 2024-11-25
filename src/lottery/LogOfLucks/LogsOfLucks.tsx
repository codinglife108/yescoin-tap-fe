import React, { useEffect, useState } from "react";
import Panel from "../../components/Panel/Panel";
import BackgroundGlow from "../../components/BackgroundGlow/BackgroundGlow";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import { fetchData } from "../../utils/api";
import rocket from "../../assets/lottery/logsLuck/rocket.png";
import spin from "../../assets/lottery/logsLuck/spin.png";
import telegram from "../../assets/lottery/logsLuck/telegram.png";
import usdt from "../../assets/lottery/logsLuck/usdt.png";
import yescoin from "../../assets/lottery/logsLuck/yescoin.png";
import refferal from "../../assets/lottery/logsLuck/gift.png";
import moment from "moment";
import { useDispatch } from "react-redux";
import { getDispatchObject, SET_TOAST } from "../../store/reducer";
import InformationModal from "../../modals/InformationModal";
import { useLocation } from "react-router-dom";

const icons = {
  rocket,
  spin,
  "telegram gratis": telegram,
  USDT: usdt,
  yescoin,
};

type LogItemProps = {
  claimed: boolean;
  claimed_time: string;
  is_refferal: boolean;
  won_time: string;
  prize: "spin" | "telegram gratis" | "USDT" | "yescoin" | "rocket";
  quantity: number;
  uuid: string;
  is_claimable: boolean;
  fetchDbData: () => void;
  setOpenVerifyModal?: (value: boolean) => void;
};
const LogItem = ({
  claimed,
  claimed_time,
  won_time,
  is_refferal,
  prize,
  quantity,
  uuid,
  is_claimable,
  fetchDbData,
  setOpenVerifyModal,
}: LogItemProps) => {
 
  const icon = is_refferal ? refferal : icons[prize];
  const title = prize?.replace("gratis", "premium");
  const amount = quantity > 0 ? `+${quantity}` : `+${Math.abs(quantity)}`;
  const dispatch = useDispatch();
  const isWhite = Math.abs(quantity) === 1;
  const date = claimed
    ? moment(claimed_time).format("DD MMMM [at] HH:mm")
    : moment(won_time).format("DD MMMM [at] HH:mm");
  function handleClaim() {
    fetchData("/wheel/claim", { rewardId: uuid }).then((res) => {
      if (res.error) {
        dispatch(
          getDispatchObject(SET_TOAST, {
            open: true,
            message: res.error.description,
            type: "error",
          })
        );
        return;
      }
      setOpenVerifyModal && setOpenVerifyModal(true);
      fetchDbData();
    });
  }
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="LogItem--icon">
        <img src={icon} alt={title} width={56} height={56} />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <strong className="capitalize">{title}</strong>
        {!claimed && is_claimable ? (
          <div onClick={handleClaim} className="LogItem--subtitle-claim">
            CLAIM
          </div>
        ) : (
          <div className="LogItem--subtitle">Received</div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <span
          className={`LogItem--amount ${
            title === "USDT" || is_refferal
              ? "gradient"
              : amount.startsWith("+")
              ? "positive"
              : "negative"
          } ${isWhite && title !== "USDT" ? "white" : ""}`}
        >
          {amount}
        </span>
        <div className="LogItem--date">{date}</div>
      </div>
    </div>
  );
};

const LogsOfLuck = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const {state} = useLocation();
  const type = state?.type;
  useEffect(() => {
    fetchDbData();
  }, []);
  function fetchDbData() {
    fetchData("/wheel/getLogsOfLuck")
      .then((res) => {
        if (res.error) return setError(true);
        console.log(res.result);
        if(type === "refferal") {
          setData(res.result?.logsOfLuck.filter((log: any) => log.is_refferal));
        } else {
          setData(res.result?.logsOfLuck.filter((log: any) => log.prize === type));
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }

  return (
    <>
      <Panel>
        <BackgroundGlow color1="#000000" color2="#000" vertical="top" fromTop />
        <TelegramBackButton />
        <h1 className="LogsOfLuck--title">Logs of Luck</h1>
        <span className="gap-3 flex flex-col">
          {data?.map(
            (log: Omit<LogItemProps, "fetchDbData">, index: number) => (
              <LogItem key={index} fetchDbData={fetchDbData} {...log} setOpenVerifyModal={setOpenVerifyModal} />
            )
          )}
        </span>
        {openVerifyModal && (
          <InformationModal
            floatingCenter
            buttonText={"Thank you"}
            isBoost={false}
            containerStyle={{
              width: "80vw",
              height: "min-content",
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
            close={() => setOpenVerifyModal(false)}
            callback={() => {
              setOpenVerifyModal(false);
            }}
            itemData={{
              icon: <img src={"/lens.png"} width={120} alt={"modal-from-bottom"} />,
              title: "",
              Description: () => (
                <span className="text-center">
                  <p className="text-white text-center my-6 font-semibold px-4 text-xl" style={{lineHeight: "1.05"}}>
                    We are verifying that everything within the app has been
                    completed correctly and that there have been no violations
                    of the terms and conditions. Your rewards will be
                    distributed within 90 days to the wallet linked
                    to your account.
                  </p>
                </span>
              ),
              value: 0,
              level: 1,
            }}
          />
        )}
      </Panel>
    </>
  );
};

export default LogsOfLuck;
