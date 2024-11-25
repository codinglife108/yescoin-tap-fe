import {formatNumberWithSpaces} from "../../utils/mathUtils";

const PENCIL_LONG_DESCRIPTION = ()=> <span>🎁 Join this social campaign for a chance to access an airdrop pool of up to $200,000 in Pencil Protocol App Tokens. To participate, simply complete the tasks listed below and submit the form with your wallet address, where the airdrop may be credited. By participating, you agree to the terms and conditions of this campaign</span>
const Pencils: { id: string, shortDescription: string, longDescription: JSX.Element, termConditionButtonLink: string, extraCoinValue?: string, extraCoinLogo?: string, intruction_url?: string, taskLearnMoreType?: string } = {
    id: 'ae6d10f7-1098-41f9-9e29-4c37072fa497',
    shortDescription: 'Join this social campaign for a chance to access an airdrop pool of up to $200,000 in Pencil Protocol App Tokens.',
    // extraCoinValue: "$"+formatNumberWithSpaces(200_000)+" in DAPP",
    // extraCoinLogo: '/DappCoin.png',
    longDescription: PENCIL_LONG_DESCRIPTION(),
    termConditionButtonLink: 'https://telegra.ph/PENCILS--YESCOIN-Giveaway-Tutorial--Terms-and-Conditions-08-28',
    // intruction_url: "https://telegra.ph/INSTRUCTIONS-TO-CLAIM-SOUL-NFT-08-28",
    // taskLearnMoreType : "pencil-mint-type"
}

const BingX: {
    termConditionButtonLink: string, title: string
} = {
    title: "BingX x Yescoin",
    termConditionButtonLink: 'https://telegra.ph/YESCOIN--BingX-10-29' 
}

const Mantle: {
    termConditionButtonLink: string, title: string
} = {
    title: "MANTLE X YESCOIN X OKX",
    termConditionButtonLink: 'https://telegra.ph/Terms-and-conditions-10-21-7' 
}

export { Pencils, BingX, Mantle }