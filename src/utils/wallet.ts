export enum WalletType {
    METAMASK = 'metamask',
    BYBIT_WEB3 = 'bybit-web3',
    BITGET_WALLET = 'bitget-wallet',
    OKX_WALLET = 'okx-wallet',
}

type WalletIconType = {
    imgSrc: string
    type: WalletType
}

export const walletIcons: WalletIconType[] = [
    {
        imgSrc: 'https://yes-coin-img-teams.blr1.cdn.digitaloceanspaces.com/metamask_1.png',
        type: WalletType.METAMASK,
    },
    {
        imgSrc: 'https://yes-coin-img-teams.blr1.cdn.digitaloceanspaces.com/bybit.svg',
        type: WalletType.BYBIT_WEB3,
    },
    {
        imgSrc: 'https://yes-coin-img-teams.blr1.cdn.digitaloceanspaces.com/bitget.jpg',
        type: WalletType.BITGET_WALLET,
    },
    {
        imgSrc: 'https://yes-coin-img-teams.blr1.cdn.digitaloceanspaces.com/okx.png',
        type: WalletType.OKX_WALLET,
    },
]
