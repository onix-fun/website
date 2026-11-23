import { HeroSectionStyles } from "../styles/HeroSection.styles";
import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { ButtonLink } from "@onix/ui-kit";

const INTRO_END_FRAME = 150;
const LOOP_END_FRAME = 2510;

export function HeroSection() {
    const animationContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = animationContainerRef.current;
        if (!container) return;

        let disposed = false;
        let animation: AnimationItem | null = null;
        let playIntro: (() => void) | null = null;
        let playLoop: (() => void) | null = null;

        // The orbit uses the SVG renderer only; the light build omits canvas
        // and HTML renderers without changing the rendered animation.
        void Promise.all([
            import("lottie-web/build/player/lottie_light"),
            import("../assets/onix-orbit.json"),
        ]).then(
            ([{ default: lottie }, { default: orbitAnimation }]) => {
                if (disposed) return;

                animation = lottie.loadAnimation({
                    container,
                    renderer: "svg",
                    loop: false,
                    autoplay: false,
                    animationData: orbitAnimation,
                    rendererSettings: {
                        preserveAspectRatio: "xMidYMid meet",
                    },
                });

                playLoop = () => {
                    if (!animation || !playLoop) return;
                    animation.removeEventListener("complete", playLoop);
                    animation.loop = true;
                    animation.playSegments([INTRO_END_FRAME, LOOP_END_FRAME], true);
                };

                playIntro = () => {
                    if (!animation) return;
                    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                        animation.goToAndStop(INTRO_END_FRAME, true);
                        return;
                    }

                    animation.addEventListener("complete", playLoop!);
                    animation.playSegments([0, INTRO_END_FRAME], true);
                };

                animation.addEventListener("DOMLoaded", playIntro);
            },
        );

        return () => {
            disposed = true;
            if (!animation) return;
            if (playIntro) animation.removeEventListener("DOMLoaded", playIntro);
            if (playLoop) animation.removeEventListener("complete", playLoop);
            animation.destroy();
        };
    }, []);

    return (
        <HeroSectionStyles id="main-content" data-part="hero">
            <div data-part="visual" aria-hidden="true">
                <div ref={animationContainerRef} data-part="animation" />
            </div>

            <section data-part="content" aria-labelledby="hero-title">
                <p data-part="eyebrow">ЦИФРОВЫЕ ПРОДУКТЫ · ПРОТОТИПЫ · СВЕТИЛЬНИКИ</p>
                <h1 id="hero-title" data-part="title">
                    Собираем системы.
                    <br />
                    Проверяем в деле.
                </h1>
                <p data-part="description">
                    Создаём цифровые продукты на собственных open-source low-code системах, проверяем идеи
                    прототипами и делаем светильники с плафонами, напечатанными на 3D-принтере.
                </p>
                <div data-part="actions">
                    <ButtonLink
                        render={<Link to="/form" />}
                        size="lg"
                        data-part="primaryAction"
                    >
                        Обсудить задачу <ArrowUpRight aria-hidden="true" size={18} />
                    </ButtonLink>
                    <ButtonLink render={<Link to="/digital" />} size="lg" variant="ghost" data-part="textAction">
                        Наши решения <ArrowUpRight aria-hidden="true" size={18} />
                    </ButtonLink>
                </div>
            </section>

            {/*<footer data-part="footer">
        <p data-part="categories">Open-source системы · Прототипы · Светильники</p>
        <div data-part="orbitCaption">
          <p>У КАЖДОЙ ИДЕИ СВОЯ ОРБИТА</p>
          <span aria-hidden="true">↗</span>
        </div>
        <Link data-part="aboutLink" to="/about">
          Познакомиться со студией <span aria-hidden="true">↓</span>
        </Link>
      </footer>*/}
        </HeroSectionStyles>
    );
}
