//@ts-nocheck
const tg = window.Telegram.WebApp
// Alternative way to set background color if setBackgroundColor is unavailable
const setMainButtonBackgroundColor = (color) => {
    let mainButtonElement = document.querySelector(
        '.telegram-webapp-main-button'
    ) // Replace with the correct selector if needed
    if (mainButtonElement) {
        mainButtonElement.style.backgroundColor = color
    }
}

setMainButtonBackgroundColor('#1D1D1D')

export const showButton = () => {
    if (
        !(
            // @ts-ignore
            tg.MainButton.isVisible
        )
    ) {
        // @ts-ignore
        tg.MainButton.show()
    }
}

export const hideButton = () => {
    if (
        // @ts-ignore
        tg.MainButton.isVisible
    ) {
        // @ts-ignore
        tg.MainButton.hide()
    }
}

export const enableButton = () => {
    if (
        !(
            // @ts-ignore
            tg.MainButton.isActive
        )
    ) {
        // @ts-ignore
        tg.MainButton.enable()
    }
}

export const disableButton = () => {
    if (
        // @ts-ignore
        tg.MainButton.isActive
    ) {
        // @ts-ignore
        tg.MainButton.disable()
    }
}

export const setButtonText = (text: string) => {
    // @ts-ignore
    tg.MainButton.setText(text)
}

export const setButtonLoader = (
    isLoading: boolean,
    leaveActive: boolean = false
) => {
    const isProgress = tg.MainButton.isProgressVisible // @ts-ignore
    if (isLoading && !isProgress) {
        // @ts-ignore
        tg.MainButton.showProgress(leaveActive)
    } else if (!isLoading && isProgress) {
        // @ts-ignore
        tg.MainButton.hideProgress()
    }
}

export const resetMainButton = () => {
    tg.MainButton.hide()
    tg.MainButton.offClick()
}
