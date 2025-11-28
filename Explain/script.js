setInterval(() => {
    gsap.set(`img`, {
        rotate: 2,
        stagger: 0.2
    })
}, 500)
setInterval(() => {
    setTimeout(() => {
        gsap.set(`img`, {
            rotate: -2,
            stagger: 0.2
        })
    }, 250)
}, 500)
setInterval(() => {
    gsap.set(`:root`, {
        "--hueShift": `${window.scrollY / 3}deg`,
    })    
}, 10);
tl = gsap.timeline({
    repeat: -1
})
tl.to(`:root`, {
    "--color1": `rgba(14, 66, 255, 1)`
}).to(`:root`, {
    "--color1": `rgba(72, 53, 128, 1)`
}).to(`:root`, {
    "--color1": `rgba(234, 75, 255, 1)`
}).to(`:root`, {
    "--color1": `rgba(255, 160, 52, 1)`
})

function iniciate(){
    window.location.href = `/game/game.html`
}