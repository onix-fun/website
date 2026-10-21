import styled from 'styled-components'
import { Page } from '@/common/ui/page'
import { BREAKPOINTS } from '@/common/styles/breakpoints'

export const AboutPageStyles = styled(Page)`& {
  padding-block: var(--space-2xl);
}

& [data-part=content] {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

& [data-part=section] {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

& [data-part=sectionHeading],& [data-part=processIntro] {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md);
}

& [data-part=sectionIndex] {
  color: var(--color-text-muted);
  font-size: var(--font-size-caption);
  font-weight: 600;
  letter-spacing: var(--letter-spacing-label);
}

& [data-part=sectionHeading] h2,& [data-part=processIntro] h2,& [data-part=callout] h2 {
  max-width: 18ch;
  margin: 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-section);
  line-height: var(--line-height-tight);
}

& [data-part=principles] {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-md);
}

& [data-part=principle] {
  border: var(--border-width) solid var(--color-hairline);
  border-radius: var(--radius-panel);
  background: color-mix(in srgb, var(--surface-raised) 84%, transparent);
}

& [data-part=principleContent] {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-xl);
}

& [data-part=number] {
  color: var(--color-accent-hover);
  font-size: var(--font-size-caption);
  font-weight: 700;
  letter-spacing: var(--letter-spacing-label);
}

& [data-part=principle] h3 {
  margin: var(--space-md) 0 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-title);
}

& [data-part=principle] p,& [data-part=processIntro] p {
  max-width: 50ch;
  margin: 0;
  color: var(--color-text-muted);
  line-height: var(--line-height-body);
}

& [data-part=process] {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: var(--space-2xl);
  border-block: var(--border-width) solid var(--onix-hero-divider);
  padding-block: var(--space-2xl);
}

& [data-part=steps] {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
  margin: 0;
  padding: 0;
  list-style: none;
}

& [data-part=steps] li {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  border-top: var(--border-width) solid var(--color-hairline);
  padding-top: var(--space-md);
}

& [data-part=steps] li span {
  color: var(--color-accent-hover);
  font-size: var(--font-size-caption);
  font-weight: 700;
  letter-spacing: var(--letter-spacing-label);
}

& [data-part=steps] li p {
  margin: 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-title);
  font-weight: 600;
}

& [data-part=callout] {
  border: var(--border-width) solid var(--color-hairline-strong);
  border-radius: var(--radius-panel);
  background: color-mix(in srgb, var(--color-accent-soft) 28%, var(--surface-raised));
}

& [data-part=calloutContent] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  padding: var(--space-xl);
}

& [data-part=calloutContent] > div {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

@media (max-width: ${BREAKPOINTS.lg}) {
  & [data-part=process] {
    grid-template-columns: 1fr;
  }
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & {
    padding-block: var(--space-xl);
  }

  & [data-part=content] {
    gap: var(--space-2xl);
  }

  & [data-part=principles] {
    grid-template-columns: 1fr;
  }

  & [data-part=principleContent],& [data-part=calloutContent] {
    padding: var(--space-lg);
  }

  & [data-part=calloutContent] {
    align-items: flex-start;
    flex-direction: column;
  }
}
`
