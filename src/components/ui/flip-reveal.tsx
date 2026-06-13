"use client"

import { useRef, useState, useEffect, type ComponentProps } from "react"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Flip from "gsap/Flip"

gsap.registerPlugin(Flip)

const mql = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null

type FlipRevealItemProps = {
    flipKey: string;
} & ComponentProps<"div">

export const FlipRevealItem = ({ flipKey, ...props }: FlipRevealItemProps) => {
    return <div data-flip={flipKey} {...props} />
}

type FlipRevealProps = {
    keys: string[];
    showClass?: string;
    hideClass?: string;
} & ComponentProps<"div">

export const FlipReveal = ({ keys, hideClass = "", showClass = "", ...props }: FlipRevealProps) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const [reduced, setReduced] = useState(mql?.matches ?? false)

    useEffect(() => {
        if (!mql) return
        const handler = () => setReduced(mql.matches)
        mql.addEventListener("change", handler)
        return () => mql.removeEventListener("change", handler)
    }, [])

    const isShow = (key: string | null) => !!key && (keys.includes("all") || keys.includes(key))

    useGSAP(
        () => {
            if (!wrapperRef.current) return

            const items = gsap.utils.toArray<HTMLDivElement>(["[data-flip]"])
            const state = Flip.getState(items)

            items.forEach((item) => {
                const key = item.getAttribute("data-flip")
                if (isShow(key)) {
                    item.classList.add(showClass)
                    item.classList.remove(hideClass)
                } else {
                    item.classList.remove(showClass)
                    item.classList.add(hideClass)
                }
            })

            if (reduced) return

            Flip.from(state, {
                duration: 0.6,
                scale: true,
                ease: "power1.inOut",
                stagger: 0.05,
                absolute: true,
                onEnter: (elements) =>
                    gsap.fromTo(
                        elements,
                        { opacity: 0, scale: 0 },
                        {
                            opacity: 1,
                            scale: 1,
                            duration: 0.8,
                        },
                    ),
                onLeave: (elements) => gsap.to(elements, { opacity: 0, scale: 0, duration: 0.8 }),
            })
        },

        { scope: wrapperRef, dependencies: [keys, reduced] },
    )

    return <div {...props} ref={wrapperRef} />
}
