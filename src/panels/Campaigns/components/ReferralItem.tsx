import { useTranslation } from "react-i18next";

import Spacing from "../../../components/Spacing/Spacing";

import { ROUTE_REFERRAL_LINK_INPUT } from "../../../routes";
import { useNavigate } from "react-router-dom";

type IProps = {
  data: any;
};
const ReferralItem = ({ data }: IProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate()

  const handleStepClick = () => {
    navigate(`${ROUTE_REFERRAL_LINK_INPUT}/${data.id}/${data.supertask_id}`)
    // setActiveModal(MODAL_REFERRAL, data);
  };

  const ReferralHeader = () => {
    let subtitle = ''
    if (data?.additional_info && typeof data.additional_info === 'string') {
      subtitle = JSON.parse(data.additional_info)?.subtitle;
    } else {
      subtitle = data?.additional_info?.subtitle;
    }

    return (
      <div className="banner-content mt-8">
        <div className="banner-card flex items-center gap-1">
          <h3 className="h3">{subtitle}</h3>
        </div>
        <div className={"my-5"}>
          <p>{data.description}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <ReferralHeader />
      <div onClick={() => handleStepClick()} className={`step-card `}>
        <img src={data.media_url} alt={data.title} className="step-image" />{" "}
        <div className="step-content">
          <h4
            style={{
              marginBottom: 0,
              color: "white",
            }}
          >
            {data.title}
          </h4>
          <Spacing size={8} />
        </div>
        <ChevronRight isStepDisabled={false} />
      </div>
    </>
  );
};

const ChevronRight = ({ isStepDisabled }: { isStepDisabled: boolean }) => (
  <svg
    style={{ opacity: isStepDisabled ? 0.5 : 1 }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default ReferralItem;
