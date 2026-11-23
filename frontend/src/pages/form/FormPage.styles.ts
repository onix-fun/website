import styled from 'styled-components'
import { Page } from '@/common/ui/page'
import { BREAKPOINTS } from '@/common/styles/breakpoints'

export const FormPageStyles = styled(Page)`& {
  padding-block: var(--space-2xl);
}

& [data-part=content] {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

& [data-part=layout] {
  display: grid;
  grid-template-columns: minmax(14rem, 0.72fr) minmax(0, 1.28fr);
  align-items: start;
  gap: var(--space-2xl);
}

& [data-part=topics] {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding-top: var(--space-sm);
}

& [data-part=topics] h2 {
  max-width: 18ch;
  margin: 0;
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-section);
  line-height: var(--line-height-tight);
}

& [data-part=topics] ul {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

& [data-part=topics] li {
  border-top: var(--border-width) solid var(--onix-hero-divider);
  padding-block: var(--space-md);
}

& [data-part=topics] h3 {
  margin: 0 0 var(--space-xs);
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-title);
  font-weight: 600;
}

& [data-part=topics] p {
  max-width: 34ch;
  margin: 0;
  color: var(--color-text-muted);
  line-height: var(--line-height-body);
}

@media (max-width: ${BREAKPOINTS.lg}) {
  & [data-part=layout] {
    grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
    gap: var(--space-lg);
  }
}

@media (max-width: ${BREAKPOINTS.md}) {
  & {
    padding-block: var(--space-xl);
  }

  & [data-part=layout] {
    grid-template-columns: 1fr;
  }

  & [data-part=topics] ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-md);
  }
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & [data-part=content] {
    gap: var(--space-xl);
  }

  & [data-part=topics] ul {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
`
