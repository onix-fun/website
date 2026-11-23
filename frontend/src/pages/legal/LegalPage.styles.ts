import styled from 'styled-components'
import { Page } from '@onix/ui-kit'
import { BREAKPOINTS } from '@onix/ui-kit'

export const LegalPageStyles = styled(Page)`& {
  padding-block: var(--space-2xl);
}

& [data-part=content] {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

& [data-part=draftNotice] {
  max-width: 82ch;
  margin: 0;
  border-left: 3px solid var(--color-accent);
  background: color-mix(in srgb, var(--color-accent-soft) 18%, var(--surface-raised));
  padding: var(--space-md) var(--space-lg);
  color: var(--onix-hero-text-primary);
  line-height: var(--line-height-body);
}

& [data-part=documentLayout] {
  display: grid;
  grid-template-columns: minmax(12rem, 0.4fr) minmax(0, 1fr);
  align-items: start;
  gap: var(--space-3xl);
}

& [data-part=contents] {
  position: sticky;
  top: calc(var(--header-fixed-top) + var(--header-spacer-height));
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  border-top: var(--border-width) solid var(--onix-hero-divider);
  padding-top: var(--space-md);
}

& [data-part=contentsTitle] {
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-caption);
  font-weight: 600;
}

& [data-part=contents] ul {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin: 0;
  padding: 0;
  list-style: none;
}

& [data-part=contents] a,& [data-part=backLink] a {
  color: var(--color-text-muted);
  line-height: var(--line-height-body);
  text-decoration-color: var(--color-hairline-strong);
  text-underline-offset: 0.2em;
  transition: color var(--duration-fast) var(--ease-out);
}

& [data-part=contents] a:hover,& [data-part=backLink] a:hover {
  color: var(--onix-hero-text-primary);
}

& [data-part=contents] a:focus-visible,& [data-part=backLink] a:focus-visible {
  border-radius: var(--radius-sm);
  outline: var(--border-width) solid var(--color-focus);
  outline-offset: var(--space-xs);
}

& [data-part=article] {
  display: flex;
  max-width: 76ch;
  flex-direction: column;
}

& [data-part=article] section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md);
  border-top: var(--border-width) solid var(--onix-hero-divider);
  padding-block: var(--space-xl);
  scroll-margin-top: calc(var(--header-fixed-top) + var(--header-spacer-height));
}

& [data-part=sectionIndex] {
  color: var(--color-accent-text);
  font-size: var(--font-size-caption);
  font-weight: 700;
}

& [data-part=article] h2 {
  margin: 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-section);
  line-height: var(--line-height-tight);
}

& [data-part=article] p,& [data-part=article] ul {
  max-width: 72ch;
  margin: 0;
  color: var(--color-text-muted);
  line-height: var(--line-height-body);
}

& [data-part=article] ul {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding-left: var(--space-lg);
}

& [data-part=backLink] {
  margin: 0;
}

@media (max-width: ${BREAKPOINTS.md}) {
  & [data-part=documentLayout] {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }

  & [data-part=contents] {
    position: static;
  }

  & [data-part=contents] ul {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & {
    padding-block: var(--space-xl);
  }

  & [data-part=content] {
    gap: var(--space-xl);
  }

  & [data-part=draftNotice] {
    padding: var(--space-md);
  }

  & [data-part=contents] ul {
    grid-template-columns: 1fr;
  }

  & [data-part=article] section {
    padding-block: var(--space-lg);
  }
}
`
