import styled from 'styled-components'
import { BREAKPOINTS } from '@/common/styles/breakpoints'

export const HeroSectionStyles = styled.main`& {
  position: relative;
  isolation: isolate;
  min-height: max(100svh, 690px);
  overflow: hidden;
  background: var(--surface-solid);
  color: var(--onix-hero-text-primary);
}

& [data-part=visual] {
  position: absolute;
  z-index: -1;
  inset: 0 0 calc(-1 * var(--onix-hero-stage-extra));
  overflow: hidden;
  pointer-events: none;
}

& [data-part=animation] {
  position: absolute;
  top: var(--onix-hero-art-top);
  left: var(--onix-hero-art-left);
  width: var(--onix-hero-art-width);
  aspect-ratio: 1674 / 1525;
}

& [data-part=animation] svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

& [data-part=content] {
  position: absolute;
  z-index: 1;
  left: max(var(--onix-hero-gutter), calc((100vw - 1296px) / 2));
  bottom: var(--onix-hero-content-bottom);
  width: min(var(--onix-hero-copy-width), calc(100vw - 2 * var(--onix-hero-gutter)));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--onix-hero-content-gap);
}

& [data-part=eyebrow] {
  margin: 0;
  color: var(--onix-hero-text-secondary);
  font-size: var(--onix-hero-label-size);
  font-weight: 600;
  line-height: var(--onix-hero-label-line-height);
  letter-spacing: var(--onix-hero-label-tracking);
}

& [data-part=title] {
  margin: 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--onix-hero-display-size);
  font-weight: 900;
  line-height: var(--onix-hero-display-line-height);
  letter-spacing: var(--onix-hero-display-tracking);
}

& [data-part=description] {
  max-width: var(--onix-hero-description-width);
  margin: 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--onix-hero-body-size);
  font-weight: 400;
  line-height: var(--onix-hero-body-line-height);
}

& [data-part=actions] {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--onix-hero-action-gap);
}

& [data-part=primaryAction],& [data-part=textAction] {
  display: inline-flex;
  min-height: var(--onix-hero-action-height);
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  border: 0;
  border-radius: var(--radius-lg);
  padding: 0 var(--space-lg);
  color: var(--onix-hero-text-primary);
  font: inherit;
  font-size: var(--onix-hero-action-size);
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

& [data-part=primaryAction] {
  background: var(--onix-hero-action-background);
  box-shadow: var(--onix-hero-action-shadow);
}

& [data-part=textAction] {
  background: transparent;
}

& [data-part=primaryAction] svg,& [data-part=textAction] svg {
  flex: 0 0 auto;
}

& [data-part=footer] {
  position: absolute;
  z-index: 1;
  right: max(var(--onix-hero-gutter), calc((100vw - 1296px) / 2));
  bottom: var(--onix-hero-footer-bottom);
  left: max(var(--onix-hero-gutter), calc((100vw - 1296px) / 2));
  display: grid;
  min-height: 48px;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: start;
  border-top: 1px solid var(--onix-hero-divider);
  padding-top: var(--onix-hero-footer-padding-top);
  color: var(--onix-hero-text-secondary);
  font-size: var(--onix-hero-footnote-size);
  line-height: 1.25;
}

& [data-part=categories],& [data-part=orbitCaption] p {
  margin: 0;
}

& [data-part=orbitCaption] {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  color: var(--onix-hero-text-secondary);
  font-size: var(--onix-hero-label-size);
  font-weight: 600;
  letter-spacing: var(--onix-hero-label-tracking);
}

& [data-part=orbitCaption] span {
  color: var(--onix-hero-text-primary);
  font-size: var(--onix-hero-caption-arrow-size);
  font-weight: 400;
  line-height: 1;
}

& [data-part=aboutLink] {
  justify-self: end;
  color: inherit;
  text-decoration: none;
}

& [data-part=aboutLink]:focus-visible,& [data-part=primaryAction]:focus-visible,& [data-part=textAction]:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 4px;
}

@media (max-width: ${BREAKPOINTS.xl}) {
  & [data-part=content] {
    left: var(--onix-hero-gutter);
  }

  & [data-part=footer] {
    right: var(--onix-hero-gutter);
    left: var(--onix-hero-gutter);
  }
}

@media (max-width: ${BREAKPOINTS.md}) {
  & {
    min-height: max(100svh, 760px);
  }

  & [data-part=visual] {
    inset: 0 0 240px;
    overflow: hidden;
  }

  & [data-part=visual]::after {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 25%,
      color-mix(in srgb, var(--surface-solid) 35%, transparent) 58%,
      var(--surface-solid) 100%
    );
    content: '';
  }

  & [data-part=content] {
    right: var(--onix-hero-gutter);
    bottom: 140px;
    width: auto;
    gap: var(--onix-hero-content-gap);
  }

  & [data-part=description] {
    max-width: 38rem;
  }

  & [data-part=footer] {
    grid-template-columns: 1fr auto;
    row-gap: var(--space-md);
    padding-top: var(--space-md);
  }

  & [data-part=orbitCaption] {
    grid-column: 1 / -1;
    grid-row: 2;
    justify-content: flex-start;
  }

  & [data-part=aboutLink] {
    grid-column: 2;
    grid-row: 1;
  }
}

@media (max-width: ${BREAKPOINTS.xs}) {
  & [data-part=actions] {
    align-items: flex-start;
    flex-direction: column;
  }

  & [data-part=primaryAction],& [data-part=textAction] {
    min-height: 48px;
    padding-inline: var(--space-md);
  }
}
`
