import styled from 'styled-components'
import { Page } from '@onix/ui-kit'
import { BREAKPOINTS } from '@onix/ui-kit'

export const ErrorPageStyles = styled(Page)`& {
  padding-block: var(--space-3xl);
}

& [data-part=card] {
  display: flex;
  width: min(100%, 36rem);
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  border: var(--border-width) solid var(--color-hairline);
  border-radius: var(--radius-panel);
  background: var(--surface-raised);
  padding: var(--space-2xl);
  text-align: center;
}

& [data-part=code] {
  color: var(--color-accent-text);
  font-size: var(--font-size-caption);
  font-weight: 700;
  letter-spacing: var(--letter-spacing-label);
}

& [data-part=lead] {
  max-width: 42ch;
  margin: 0;
  color: var(--color-text-muted);
  line-height: var(--line-height-body);
}

& [data-part=actions] {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & [data-part=card] {
    padding: var(--space-xl);
  }
}
`
