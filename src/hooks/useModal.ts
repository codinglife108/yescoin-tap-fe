import {useDispatch, useSelector} from "react-redux";
import {getDispatchObject, SET_ACTIVE_MODAL, SET_ACTIVE_MODAL_PARAMS, SET_MODAL_TYPE} from "../store/reducer";
import { useState } from "react";

export enum ModalTypes {
    CONNECT_WALLET = "connect_wallet",
    VOTE_YESCOIN = 'vote_yescoin',
    INFORM_USER = 'inform_user',
}

const useModal = () => {
    const selector: any = useSelector((s) => s);
    const dispatch = useDispatch();

    const activeModal = selector['activeModal'];
    const activeModalParams = selector['activeModalParams'];
    const modalType = selector['modalType'];
    // console.log('active modal ------>', activeModalParams)
    if (activeModalParams && activeModalParams.hasOwnProperty("additional_info") && activeModalParams["additional_info"] !== null && activeModalParams["additional_info"] !== "") {
        if (activeModalParams["additional_info"] && typeof activeModalParams["additional_info"] === "string") {
            activeModalParams["additional_info"] = JSON.parse(activeModalParams["additional_info"])
        }
    }

    const setModalType = (modalType: ModalTypes ) => {
        dispatch(getDispatchObject(SET_MODAL_TYPE, modalType));
    }

    const setActiveModal = (modalId: string | null, params?: string | number | object) => {
        dispatch(getDispatchObject(SET_ACTIVE_MODAL, modalId));

        if (params) {
            dispatch(getDispatchObject(SET_ACTIVE_MODAL_PARAMS, params));
        }

        if (!params) {
            dispatch(getDispatchObject(SET_ACTIVE_MODAL_PARAMS, null));
        }
    }

    return { activeModal, setActiveModal, activeModalParams, modalType, setModalType };
};

export default useModal;