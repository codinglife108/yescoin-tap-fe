export const copyText = (text: string) => {
    if (navigator.clipboard) {
        // Use the clipboard API
        try {
            navigator.clipboard.writeText(text)
            console.log('Text copied to clipboard')
        } catch (error) {
            console.error('Failed to copy text:', error)
        }
    } else {
        // Fallback for browsers that don't support the clipboard API
        const tempTextArea = document.createElement('textarea')
        tempTextArea.value = text
        // Avoid scrolling to bottom
        tempTextArea.style.position = 'fixed'
        tempTextArea.style.top = '0'
        tempTextArea.style.left = '0'
        document.body.appendChild(tempTextArea)
        tempTextArea.focus()
        tempTextArea.select()

        try {
            document.execCommand('copy')
            console.log('Fallback: Text copied to clipboard')
        } catch (error) {
            console.error('Fallback: Failed to copy text:', error)
        }

        document.body.removeChild(tempTextArea)
    }
}

export const getTG = () => {
    // @ts-ignore
    return window.Telegram.WebApp
}

export const getUnixTime = () => {
    return parseInt(String(new Date().getTime() / 1000))
}
export const parseStringWithNewLine = (str: string) => {
    const parts = str.split('\n')

    return (
        <>
            {parts.map((part, index) => (
                <span key={index}>
                    {part}
                    {index !== parts.length - 1 ? <br /> : ''}
                </span>
            ))}
        </>
    )
}

export function truncateNumber(num: number) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
    }
    if (num >= 1e6) {
        return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return num.toString()
}
export function isDesktop() {
    const tg = getTG()
    const isDesktop =
        // @ts-ignore
        tg.platform === 'tdesktop'
    return isDesktop
}
