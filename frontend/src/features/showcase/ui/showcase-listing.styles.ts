import styled from 'styled-components'
import { BREAKPOINTS } from '@/common/styles/breakpoints'

export const ShowcaseListingStyles = styled.section`& {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

& [data-part=toolbar] {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-md);
}

& [data-part=searchField] {
  position: relative;
  width: min(100%, 28rem);
}

& [data-part=searchIcon] {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: var(--space-md);
  width: var(--font-size-body);
  height: var(--font-size-body);
  color: var(--color-text-muted);
  transform: translateY(-50%);
}

& [data-part=searchInput] {
  min-height: var(--onix-hero-action-height);
  border-color: var(--color-hairline);
  border-radius: var(--radius-pill);
  background: var(--surface-raised);
  padding-left: var(--space-2xl);
}

& [data-part=filters] {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--space-xs);
}

& [data-part=resultCount] {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-caption);
}

& [data-part=grid] {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-md);
}

& [data-part=empty] {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  border: var(--border-width) solid var(--color-hairline);
  border-radius: var(--radius-panel);
  background: var(--surface);
  padding: var(--space-2xl);
}

& [data-part=emptyEyebrow] {
  color: var(--color-accent-hover);
  font-size: var(--font-size-caption);
  font-weight: 700;
  letter-spacing: var(--letter-spacing-label);
  text-transform: uppercase;
}

& [data-part=empty] h2 {
  margin: 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-section);
}

& [data-part=empty] p {
  max-width: 48ch;
  margin: 0;
  color: var(--color-text-muted);
  line-height: var(--line-height-body);
}

@media (max-width: ${BREAKPOINTS.xl}) {
  & [data-part=toolbar] {
    grid-template-columns: 1fr;
  }

  & [data-part=searchField] {
    width: 100%;
  }

  & [data-part=filters] {
    justify-content: flex-start;
  }

  & [data-part=grid] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & [data-part=grid] {
    grid-template-columns: 1fr;
  }

  & [data-part=empty] {
    padding: var(--space-lg);
  }
}
`
