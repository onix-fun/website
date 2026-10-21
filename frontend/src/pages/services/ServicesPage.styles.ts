import styled from 'styled-components'
import { Page } from '@/common/ui/page'
import { BREAKPOINTS } from '@/common/styles/breakpoints'

export const ServicesPageStyles = styled(Page)`& {
  padding-block: var(--space-2xl);
}

& [data-part=content] {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

& [data-part=section],& [data-part=process] {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

& [data-part=sectionHeading] {
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

& [data-part=sectionHeading] h2,& [data-part=callout] h2 {
  max-width: 20ch;
  margin: 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-section);
  line-height: var(--line-height-tight);
}

& [data-part=services] {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
  margin: 0;
  padding: 0;
  list-style: none;
}

& [data-part=service] {
  height: 100%;
  border: var(--border-width) solid var(--color-hairline);
  border-radius: var(--radius-panel);
  background: color-mix(in srgb, var(--surface-raised) 84%, transparent);
  transition:
    border-color var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}

& [data-part=service]:hover {
  border-color: var(--color-hairline-strong);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

& [data-part=serviceContent] {
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

& [data-part=title] {
  margin: var(--space-lg) 0 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-title);
  font-weight: 600;
}

& [data-part=description] {
  max-width: 52ch;
  margin: 0;
  color: var(--color-text-muted);
  line-height: var(--line-height-body);
}

& [data-part=process] {
  border-block: var(--border-width) solid var(--onix-hero-divider);
  padding-block: var(--space-2xl);
}

& [data-part=processList] {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-md);
  margin: 0;
  padding: 0;
  list-style: none;
}

& [data-part=processList] li {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md);
  border-top: var(--border-width) solid var(--color-hairline);
  padding-top: var(--space-md);
}

& [data-part=processList] h3 {
  margin: 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-title);
}

& [data-part=processList] p {
  margin: 0;
  color: var(--color-text-muted);
  line-height: var(--line-height-body);
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

@media (max-width: ${BREAKPOINTS.xl}) {
  & [data-part=processList] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & {
    padding-block: var(--space-xl);
  }

  & [data-part=content] {
    gap: var(--space-2xl);
  }

  & [data-part=services],& [data-part=processList] {
    grid-template-columns: 1fr;
  }

  & [data-part=serviceContent],& [data-part=calloutContent] {
    padding: var(--space-lg);
  }

  & [data-part=calloutContent] {
    align-items: flex-start;
    flex-direction: column;
  }
}
`
