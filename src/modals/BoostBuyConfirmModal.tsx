import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from '@nextui-org/react';
import React, {FC} from 'react';
import {MODAL_BOOST_BUY_CONFIRM} from "../routes";
import useModal from "../hooks/useModal";
import {useTranslation} from "react-i18next";

interface BoostBuyConfirmModalProps {

}

const BoostBuyConfirmModal: FC<BoostBuyConfirmModalProps> = () => {

    const { t } = useTranslation();

    const {activeModal, setActiveModal} = useModal();

    return (
        <Modal
            isOpen={activeModal === MODAL_BOOST_BUY_CONFIRM}
            placement='center'
            onClose={() => setActiveModal(null)}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{t('boostsConfirmTitle')}</ModalHeader>
                        <ModalBody>
                            <p className="text-16-medium">{t('boostsConfirmText')}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                fullWidth
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                {t('boostsConfirmCancelButton')}
                            </Button>
                            <Button
                                fullWidth
                                color="primary"
                            >
                                {t('boostsConfirmButton')}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default BoostBuyConfirmModal;