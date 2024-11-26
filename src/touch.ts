const overflow = 0
document.body.style.overflowY = 'hidden'
document.body.style.marginTop = `${overflow}px`
document.body.style.height = window.innerHeight + overflow + 'px'
document.body.style.paddingBottom = `${overflow}px`
window.scrollTo(0, overflow)

let ts: number | undefined
const onTouchStart = (e: TouchEvent) => {
    ts = e.touches[0].clientY
}
const onTouchMove = (e: TouchEvent) => {
    const scrollableEl = document.getElementById('Panel')
    if (scrollableEl) {
        const scroll = scrollableEl.scrollTop
        const te = e.changedTouches[0].clientY
        if (scroll <= 0 && ts! < te) {
            e.preventDefault()
        }
    } else {
        e.preventDefault()
    }
}
document.documentElement.addEventListener('touchstart', onTouchStart, {
    passive: false,
})
document.documentElement.addEventListener('touchmove', onTouchMove, {
    passive: false,
})
