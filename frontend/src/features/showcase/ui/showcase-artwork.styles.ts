import styled from 'styled-components'
import { BREAKPOINTS } from '@/common/styles/breakpoints'

export const ShowcaseArtworkStyles = styled.div`& {
  position: relative;
  display: grid;
  aspect-ratio: 1.28;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 44%, color-mix(in srgb, var(--color-accent-soft) 36%, transparent), transparent 54%),
    linear-gradient(145deg, var(--surface-solid), color-mix(in srgb, var(--surface-solid) 54%, var(--surface-raised)));
}

&[data-size=large] {
  aspect-ratio: 1;
  border: var(--border-width) solid var(--color-hairline);
  border-radius: var(--radius-panel);
}

& [data-part=orbit] {
  position: absolute;
  width: 66%;
  aspect-ratio: 1;
  border: var(--border-width) solid color-mix(in srgb, var(--color-ink) 14%, transparent);
  border-radius: 50%;
  transform: rotate(-22deg) scaleY(0.42);
}

& [data-part=object] {
  position: absolute;
  width: 28%;
  aspect-ratio: 0.76;
  border: var(--border-width) solid color-mix(in srgb, var(--color-ink) 10%, transparent);
  border-radius: 44% 44% 28% 28%;
  background: linear-gradient(145deg, var(--surface-raised), color-mix(in srgb, var(--color-accent-soft) 50%, var(--surface-raised)));
  box-shadow: var(--shadow-md);
  transform: rotate(-14deg) translateY(-4%);
}

&[data-kind='digital'] [data-part=object] {
  width: 32%;
  aspect-ratio: 1;
  border-radius: 28% 56% 32% 52%;
  background: linear-gradient(145deg, var(--color-accent-soft), var(--surface-raised));
  transform: rotate(18deg);
}

&[data-kind='digital'] [data-part=orbit] {
  width: 76%;
  transform: rotate(24deg) scaleY(0.74);
}

& [data-part=index],& [data-part=caption] {
  position: absolute;
  z-index: 1;
  color: var(--color-text-muted);
  font-size: var(--font-size-caption);
  letter-spacing: var(--letter-spacing-label);
}

& [data-part=index] {
  top: var(--space-md);
  left: var(--space-md);
  font-weight: 600;
}

& [data-part=caption] {
  right: var(--space-md);
  bottom: var(--space-md);
  letter-spacing: normal;
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & [data-part=index],& [data-part=caption] {
    font-size: 0.625rem;
  }
}
`
