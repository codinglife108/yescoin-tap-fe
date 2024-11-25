import BackgroundGlow from "../../components/BackgroundGlow/BackgroundGlow";
import Panel from "../../components/Panel/Panel";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import rocket from "../../assets/lottery/logsLuck/rocket.png";
import spin from "../../assets/lottery/logsLuck/spin.png";
import telegram from "../../assets/lottery/logsLuck/telegram.png";
import usdt from "../../assets/lottery/logsLuck/usdt.png";
import yescoin from "../../assets/lottery/logsLuck/yescoin.png";
import refferal from "../../assets/lottery/logsLuck/gift.png";
import { ROUTE_LOG_OF_LUCK_DETAIL } from "../../routes";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { type } from "os";
import { fetchData } from "../../utils/api";

const sections = [
  {
    icon: yescoin,
    title: "Yescoin",
    type: "yescoin",
  },
  {
    icon: usdt,
    title: "USDT",
    type: "USDT",
  },
  {
    icon: refferal,
    title: "Referral",
    type: "refferal",
  },
  {
    icon: telegram,
    title: "Telegram Premium",
    type: "telegram gratis",
  },
  {
    icon: spin,
    title: "Spin",
    type: "spin",
  },
  {
    icon: rocket,
    title: "Rocket",
    type: "rocket",
  },
];

export default function LogsOfLuckList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetchDbData();
  }, []);
  function fetchDbData() {
    fetchData("/wheel/getLogsOfLuck")
      .then((res) => {
        if (res.error) return setError(true);
        console.log(res.result);
        setData(res.result?.logsOfLuck);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }
  return (
    <Panel>
      <BackgroundGlow color1="#000000" color2="#000" vertical="top" fromTop />
      <TelegramBackButton />
      <h1 className="LogsOfLuck--title">Logs of Luck</h1>
      <div className="flex flex-col gap-2">
        {sections.map((section, index) => (
          <div
            onClick={() => {
              if (
                data.filter((log: any) => log.prize === section.type).length > 0
              ) {
                navigate(ROUTE_LOG_OF_LUCK_DETAIL, {
                  state: { type: section.type },
                });
              }
              if (
                section.type === "refferal" &&
                data.filter((log: any) => log.is_refferal).length > 0
              ) {
                navigate(ROUTE_LOG_OF_LUCK_DETAIL, {
                  state: { type: section.type },
                });
              }
            }}
            className="flex items-center justify-between gap-4 "
          >
            <div className="flex items-center font-semibold gap-2">
              <img
                src={section.icon}
                alt={section.title}
                style={{ width: 56, height: 56 }}
              />
              <span>{section.title}</span>
            </div>
            <span className="text-xl opacity-50">{">"}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
