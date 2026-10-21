import { useEffect, useRef } from 'react'
import type { AnimationItem } from 'lottie-web'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { ButtonLink, SITE_CONTACT_URL } from '@/common'
import styles from '../styles/HeroSection.module.scss'

const INTRO_END_FRAME = 150
const LOOP_END_FRAME = 2510

export function HeroSection() {
  const animationContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = animationContainerRef.current
    if (!container) return

    let disposed = false
    let animation: AnimationItem | null = null
    let playIntro: (() => void) | null = null
    let playLoop: (() => void) | null = null

    void Promise.all([
      import('lottie-web'),
      import('../assets/onix-orbit.json'),
    ]).then(([{ default: lottie }, { default: orbitAnimation }]) => {
      if (disposed) return

      animation = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: orbitAnimation,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
        },
      })

      playLoop = () => {
        if (!animation || !playLoop) return
        animation.removeEventListener('complete', playLoop)
        animation.loop = true
        animation.playSegments([INTRO_END_FRAME, LOOP_END_FRAME], true)
      }

      playIntro = () => {
        if (!animation) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          animation.goToAndStop(INTRO_END_FRAME, true)
          return
        }

        animation.addEventListener('complete', playLoop!)
        animation.playSegments([0, INTRO_END_FRAME], true)
      }

      animation.addEventListener('DOMLoaded', playIntro)
    })

    return () => {
      disposed = true
      if (!animation) return
      if (playIntro) animation.removeEventListener('DOMLoaded', playIntro)
      if (playLoop) animation.removeEventListener('complete', playLoop)
      animation.destroy()
    }
  }, [])

  return (
    <main id="main-content" className={styles.hero}>
      <div className={styles.visual} aria-hidden="true">
        <div ref={animationContainerRef} className={styles.animation} />
      </div>

      <section className={styles.content} aria-labelledby="hero-title">
        <p className={styles.eyebrow}>СТУДИЯ ПРЕДМЕТНОГО ДИЗАЙНА И 3D-ПЕЧАТИ</p>
        <h1 id="hero-title" className={styles.title}>
          Рождённый
          <br />
          слой за слоем
        </h1>
        <p className={styles.description}>
          Превращаем идеи в предметы. Разрабатываем объекты и мерч, моделируем и
          создаём их с помощью 3D-печати.
        </p>
        <div className={styles.actions}>
          <ButtonLink
            render={<a href={SITE_CONTACT_URL} target="_blank" rel="noreferrer noopener" />}
            size="lg"
            className={styles.primaryAction}
          >
            Обсудить проект <ArrowUpRight aria-hidden="true" size={18} />
          </ButtonLink>
          <ButtonLink
            render={<Link to="/catalog" />}
            size="lg"
            variant="ghost"
            className={styles.textAction}
          >
            Что можно создать <ArrowUpRight aria-hidden="true" size={18} />
          </ButtonLink>
        </div>
      </section>

      <footer className={styles.footer}>
        <p className={styles.categories}>Предметы · Мерч · Прототипы</p>
        <div className={styles.orbitCaption}>
          <p>У КАЖДОЙ ИДЕИ СВОЯ ОРБИТА</p>
          <span aria-hidden="true">↗</span>
        </div>
        <Link className={styles.aboutLink} to="/about">
          Познакомиться со студией <span aria-hidden="true">↓</span>
        </Link>
      </footer>
    </main>
  )
}
