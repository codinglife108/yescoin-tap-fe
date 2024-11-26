export function formatNumberShort(value: number): string {
    const suffixes = ['', 'K', 'M', 'B', 'T']
    const tier = (Math.log10(Math.abs(value)) / 3) | 0
    if (tier === 0) return String(value)
    const suffix = suffixes[tier]
    const scale = Math.pow(10, tier * 3)
    const scaledValue = value / scale
    return (scaledValue || 0).toFixed(1) + suffix
}

export function formatNumberWithSpaces(value: any): string {
    value = parseInt(value)
    return new Intl.NumberFormat()
        .format(parseInt((value || 0).toFixed(0)))
        .replace(/\./g, ',')
    //return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const rgba2hex = (color: string) => {
    const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',')
    return `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1)}`
}
