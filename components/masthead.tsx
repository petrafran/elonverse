'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import mars from '@/public/hero-mars.png'
import rocket from '@/public/hero-rocket.png'
import portrait from '@/public/hero-portrait.png'
import hyperloop from '@/public/hero-hyperloop.png'

const layers = [
  { className: 'hero-mars', depth: 0.18, image: mars, sizes: '(max-width: 700px) 80vw, (max-width: 1050px) 60vw, 640px', preload: true },
  { className: 'hero-rocket', depth: 0.45, lift: 420, image: rocket, sizes: '(max-width: 700px) 30vw, 220px', preload: false },
  { className: 'hero-hyperloop', depth: 0.55, image: hyperloop, sizes: '(max-width: 700px) 150vw, (max-width: 1050px) 100vw, 1150px', preload: false },
  { className: 'hero-portrait', depth: 0.8, image: portrait, sizes: '(max-width: 700px) 72vw, (max-width: 1050px) 55vw, 560px', preload: true },
]

// Motion stays confined to the artwork; the title and navigation remain steady.
function useHeaderDepth(heroRef: React.RefObject<HTMLElement | null>, sceneRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const hero = heroRef.current
    const scene = sceneRef.current
    if (!hero || !scene) return
    const layerEls = [...hero.querySelectorAll<HTMLElement>('[data-depth]')]
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)')
    let frame = 0, visible = false, targetX = 0, targetY = 0, targetScroll = 0, x = 0, y = 0, scroll = 0, lastTime = 0
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

    const reset = () => {
      cancelAnimationFrame(frame)
      frame = 0; lastTime = 0
      x = y = scroll = targetX = targetY = targetScroll = 0
      scene.style.removeProperty('--scene-rx')
      scene.style.removeProperty('--scene-ry')
      layerEls.forEach((layer) => {
        layer.style.removeProperty('--layer-x')
        layer.style.removeProperty('--layer-y')
      })
      hero.classList.remove('motion-active')
    }
    const draw = (time: number) => {
      frame = 0
      if (reduced.matches || !visible || document.hidden) { lastTime = 0; return }
      const alpha = lastTime ? 1 - Math.exp(-Math.min(time - lastTime, 64) / 95) : 0.18
      lastTime = time
      x += (targetX - x) * alpha
      y += (targetY - y) * alpha
      scroll += (targetScroll - scroll) * alpha
      const small = hero.clientWidth < 700 ? 0.55 : 1
      layerEls.forEach((layer) => {
        const depth = Number(layer.dataset.depth)
        const lift = Number(layer.dataset.lift ?? 0)
        const scrollShift = lift ? -scroll * lift : scroll * 76 * depth
        layer.style.setProperty('--layer-x', `${(-x * 35 * depth * small).toFixed(2)}px`)
        layer.style.setProperty('--layer-y', `${((-y * 18 * depth + scrollShift) * small).toFixed(2)}px`)
      })
      scene.style.setProperty('--scene-rx', `${(y * 1.2).toFixed(3)}deg`)
      scene.style.setProperty('--scene-ry', `${(-x * 2).toFixed(3)}deg`)
      if (Math.abs(targetX - x) + Math.abs(targetY - y) + Math.abs(targetScroll - scroll) > 0.002) frame = requestAnimationFrame(draw)
      else lastTime = 0
    }
    const schedule = () => {
      if (!frame && visible && !reduced.matches && !document.hidden) frame = requestAnimationFrame(draw)
    }
    const measureScroll = () => {
      const r = hero.getBoundingClientRect()
      targetScroll = clamp(window.scrollY / (r.height + r.top + window.scrollY), 0, 1)
      schedule()
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === 'touch' || reduced.matches) return
      const r = hero.getBoundingClientRect()
      targetX = clamp(((event.clientX - r.left) / r.width) * 2 - 1, -1, 1)
      targetY = clamp(((event.clientY - r.top) / r.height) * 2 - 1, -1, 1)
      schedule()
    }
    const onPointerLeave = () => { targetX = targetY = 0; schedule() }
    const onReducedChange = () => {
      reset()
      if (!reduced.matches) { hero.classList.toggle('motion-active', visible); measureScroll() }
    }
    const onPointerChange = () => { targetX = targetY = 0; schedule() }
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0 } else measureScroll()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting
        hero.classList.toggle('motion-active', visible && !reduced.matches)
        if (visible) measureScroll()
        else { cancelAnimationFrame(frame); frame = 0; lastTime = 0 }
      },
      { threshold: 0 },
    )
    observer.observe(hero)
    hero.addEventListener('pointermove', onPointerMove, { passive: true })
    hero.addEventListener('pointerleave', onPointerLeave, { passive: true })
    window.addEventListener('scroll', measureScroll, { passive: true })
    window.addEventListener('resize', measureScroll, { passive: true })
    reduced.addEventListener('change', onReducedChange)
    finePointer.addEventListener('change', onPointerChange)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      reset()
      observer.disconnect()
      hero.removeEventListener('pointermove', onPointerMove)
      hero.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('scroll', measureScroll)
      window.removeEventListener('resize', measureScroll)
      reduced.removeEventListener('change', onReducedChange)
      finePointer.removeEventListener('change', onPointerChange)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [heroRef, sceneRef])
}

export function Masthead() {
  const heroRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  useHeaderDepth(heroRef, sceneRef)

  return (
    <section className="masthead" aria-labelledby="masthead-title" ref={heroRef}>
      <div className="masthead-copy">
        <span className="eyebrow orange">MISSIONS · MACHINES · MAYHEM</span>
        <h1 id="masthead-title">
          The future,
          <br />
          according to Elon.
        </h1>
        <p>
          Big promises. Bigger questions.
          <br />
          Follow the odds from Earth to Mars.
        </p>
      </div>
      <div
        className="masthead-art"
        role="img"
        aria-label="Layered illustration of Elon Musk looking toward Mars, a rocket and a Hyperloop"
      >
        <div className="hero-scene" aria-hidden="true" ref={sceneRef}>
          <div className="depth-layer hero-stars" data-depth="0.08" />
          {layers.map((layer) => (
            <div key={layer.className} className={`depth-layer ${layer.className}`} data-depth={layer.depth}
              data-lift={'lift' in layer ? layer.lift : undefined}
            >
              <Image
                src={layer.image}
                alt=""
                sizes={layer.sizes}
                quality={80}
                preload={layer.preload}
                loading={layer.preload ? undefined : 'eager'}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
      <span className="coordinate">25.9972° N / 97.1566° W</span>
    </section>
  )
}
