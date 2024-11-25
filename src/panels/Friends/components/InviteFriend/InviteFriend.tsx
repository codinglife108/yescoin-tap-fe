import { FC, useState, useEffect } from 'react';
import Div from "../../../../components/Div/Div";
import { Button } from "@nextui-org/react";
import Spacing from "../../../../components/Spacing/Spacing";
import BottomLayout from "../../../../components/BottomLayout/BottomLayout";
import { useTranslation } from "react-i18next";
import { fetchData } from "../../../../utils/api";
import { hideButton, setButtonLoader, setButtonText, showButton } from "../../../../utils/tgButtonUtils";
import { copyText } from '../../../../utils/utils';
import { useDispatch } from 'react-redux';
import { SET_TOAST, getDispatchObject } from '../../../../store/reducer';
import InviteModal from '../../../../modals/inviteModal';

// @ts-ignore
const tg = window["Telegram"]['WebApp'];

interface InviteFriendProps {

}

const InviteFriend: FC<InviteFriendProps> = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [buttonTextState, setButtonTextState] = useState(t('friendsInviteButton'));
  const [buttonColor, setButtonColor] = useState<"success" | "primary">('primary');
  const [openInviteModal, setOpenInviteModal] = useState<boolean>(false);
  const [inviteLink, setInviteLink] = useState<string>('');
  const copyLink = async () => {
    setButtonTextState(t('friendsInviteButton1'));
    setButtonColor('success');

    setTimeout(() => {
      setButtonTextState(t('friendsInviteButton'));
      setButtonColor('primary')
    }, 5000);
    setOpenInviteModal(true);
    // @ts-ignore
    tg.MainButton.hide();
  }


  const closeModal = () => {
    setOpenInviteModal(false)
    // @ts-ignore
    tg.MainButton.setText("Share & Earn");
    // @ts-ignore
    tg.MainButton.show();
    // @ts-ignore
    tg.MainButton.onClick(copyLink);
    return () => {
      // @ts-ignore
      tg.MainButton.offClick(copyLink);
      // @ts-ignore
      tg.MainButton.hide();
    }
  }
  const setCopyLink = async () => {
    // @ts-ignore
    const startAppParams = JSON.stringify({ inviter: `r_${tg['initDataUnsafe']['user']['id']}` });
    // @ts-ignore
    const linkRes = await fetchData('/user/invite-link', { link: btoa(startAppParams) });
    const myLink = `${process.env.REACT_APP_TELEGRAM_MINIAPP_URL}/something?startapp=${linkRes.result?.linkId}`;
    setInviteLink(myLink);
  }

  const linkSend = () => {
    // @ts-ignore
    tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=\n\nYou are invited to participate in yescoin. Click the link above to play`);
    setOpenInviteModal(false);
  }

  const inviteLinkCopied = () => {
    copyText(inviteLink);
    dispatch(getDispatchObject(SET_TOAST, { open: true, message: t('friendsInviteButton1'), type: 'success' }));
  }

  useEffect(() => {
    setCopyLink();
  }, []);

  useEffect(() => {
    // @ts-ignore
    tg.MainButton.onClick(copyLink);
    hideButton();
    setTimeout(() => {
      setButtonText(buttonTextState);
      showButton();
    }, 50);
    return () => {
      // @ts-ignore
      tg.MainButton.offClick(copyLink);
      hideButton()
    };
  }, []);

  return (
    <div>
      {openInviteModal && (
        <InviteModal
          sendButtonText={"Send"}
          copyButtonText={"Copy link"}
          containerStyle={{
            height: "min-content",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
          close={closeModal}
          sendCallback={linkSend}
          copyCallback={inviteLinkCopied}
          itemData={{
            title: "Invite a Fren",
            subtitle: "",
          }}
        />
      )}
    </div>
  );
};

export default InviteFriend;