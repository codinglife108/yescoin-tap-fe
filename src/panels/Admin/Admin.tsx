import React, { FC, useCallback, useEffect, useState } from 'react';
import Panel from "../../components/Panel/Panel";
import Placeholder from "../../components/Placeholder/Placeholder";
import Container from "../../components/Container/Container";
import { Button, Skeleton } from "@nextui-org/react";
import Spacing from "../../components/Spacing/Spacing";
import CellContainer from "../../components/CellContainer/CellContainer";
import Cell from "../../components/Cell/Cell";
import Icon16Chevron from "../../assets/icons/Icon16Chevron";
import EmojiRectangle from "../../components/EmojiRectangle/EmojiRectangle";
import Img from "../../components/Img/Img";
import IconText from "../../components/IconText/IconText";
import { formatNumberWithSpaces } from "../../utils/mathUtils";
import { fetchData } from "../../utils/api";
import useModal from "../../hooks/useModal";
import { MODAL_ADMIN_TASK } from "../../routes";
//test
const Admin: FC = () => {

  const [data, setData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(false);

  const [, setRocketCostInput] = useState("");
  const [, setTeamLinkMonthCostInput] = useState("");

  const {setActiveModal } = useModal();
  
  const createEventListeners = useCallback(() => {
    document.addEventListener("admin_update", fetch);
  },[])

  const removeEventListeners = useCallback(() => {
    document.removeEventListener("admin_update", fetch);
  },[])

  useEffect(() => {
    fetch().then();

    createEventListeners();
    return removeEventListeners;
  }, [createEventListeners, removeEventListeners]);

  useEffect(() => {
    if (data) {
      setRocketCostInput(data['rocketCost']);
      setTeamLinkMonthCostInput(data['teamLinkMonthCost']);
    }
  }, [data]);

  const fetch = async () => {
    setDataLoading(true);

    const response = await fetchData('/admin/get');

    if (response.error) {
      return;
    }

    setData(response.result);
    setDataLoading(false);
  }

  

  /* const save = async (field: 'rocketCost' | 'teamLinkMonthCost', value: any) => {
    await fetchData('/admin/update', {
      field,
      value,
    });
  }
 */
  return (
    <Panel>
      <Placeholder title="Admin panel" />
      <Spacing size={32} />

      <Spacing size={24} />

      <Container title="Channels (for earning)">
        <CellContainer>
          {dataLoading && (
            <Skeleton
              style={{
                width: '100%',
                height: 48,
                borderRadius: 16
              }}
            />
          )}

          {!dataLoading && data !== null && (
            <>
              <Button
                fullWidth
                color="primary"
                onClick={() => setActiveModal(MODAL_ADMIN_TASK)}
              >
                Add
              </Button>

              <Spacing />

              {data['tasks']['channels'].map((channel: any, index: number) => (
                <Cell
                  key={index}
                  title={channel['channelAddress'] ?? channel['link'] ?? channel['botaddress']}
                  after={<Icon16Chevron />}
                  onClick={() => setActiveModal(MODAL_ADMIN_TASK, channel)}
                  before={
                    <EmojiRectangle>
                      <Img src={require('../../assets/images/emoji/loudspeaker.png')} />
                    </EmojiRectangle>
                  }
                >
                  <IconText
                    size="small"
                    imgPath={require('../../assets/images/coins/rocket_coin_back_36x36.png')}
                    text={`+ ${formatNumberWithSpaces(channel['award'])}`}
                    textColor="var(--yellow_color)"
                  />
                </Cell>
              ))}
            </>
          )}
        </CellContainer>
      </Container>
    </Panel>
  );
};

export default Admin;