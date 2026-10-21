import styled from 'styled-components'
import { BREAKPOINTS } from '@/common/styles/breakpoints'

export const ShowcaseDetailStyles = styled.div`& {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

& [data-part=breadcrumb] {
  color: var(--color-text-muted);
}

& [data-part=hero] {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  align-items: center;
  gap: var(--space-2xl);
}

& [data-part=copy] {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md);
}

& [data-part=eyebrow],& [data-part=sectionIndex] {
  color: var(--color-text-muted);
  font-size: var(--font-size-caption);
  font-weight: 600;
  letter-spacing: var(--letter-spacing-label);
}

& [data-part=copy] h1,& h1 {
  margin: 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-page-title);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-display);
}

& [data-part=summary] {
  max-width: 48ch;
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-lead);
  line-height: var(--line-height-body);
}

& [data-part=contactButton] {
  min-height: var(--onix-hero-action-height);
  border-radius: var(--radius-lg);
  padding-inline: var(--space-lg);
}

& [data-part=backButton] {
  padding-inline: 0;
}

& [data-part=information] {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--border-width) minmax(0, 0.8fr);
  gap: var(--space-2xl);
  border-top: var(--border-width) solid var(--onix-hero-divider);
  border-bottom: var(--border-width) solid var(--onix-hero-divider);
  padding-block: var(--space-2xl);
}

& [data-part=description],& [data-part=facts] {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md);
}

& [data-part=description] h2,& [data-part=facts] h2,& [data-part=relatedHeading] h2 {
  margin: 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-section);
  line-height: var(--line-height-tight);
}

& [data-part=description] p {
  max-width: 62ch;
  margin: 0;
  color: var(--color-text-muted);
  line-height: var(--line-height-body);
}

& [data-part=verticalSeparator] {
  background: var(--onix-hero-divider);
}

& [data-part=facts] dl {
  display: flex;
  width: 100%;
  flex-direction: column;
  margin: 0;
}

& [data-part=fact] {
  display: flex;
  justify-content: space-between;
  gap: var(--space-md);
  border-bottom: var(--border-width) solid var(--color-hairline);
  padding-block: var(--space-md);
}

& [data-part=fact] dt {
  color: var(--color-text-muted);
}

& [data-part=fact] dd {
  margin: 0;
  color: var(--onix-hero-text-primary);
  text-align: right;
}

& [data-part=related] {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

& [data-part=relatedHeading] {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

& [data-part=relatedGrid] {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
}

& {
  display: flex;
  max-width: 48rem;
  min-height: 48svh;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--space-md);
}

& p {
  max-width: 48ch;
  margin: 0;
  color: var(--color-text-muted);
  line-height: var(--line-height-body);
}

@media (max-width: ${BREAKPOINTS.lg}) {
  & [data-part=hero] {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }

  & [data-part=hero] > :first-child {
    order: 1;
  }

  & [data-part=copy] {
    order: 0;
  }
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & {
    gap: var(--space-2xl);
  }

  & [data-part=information] {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
    padding-block: var(--space-lg);
  }

  & [data-part=verticalSeparator] {
    display: none;
  }

  & [data-part=relatedGrid] {
    grid-template-columns: 1fr;
  }
}
`
