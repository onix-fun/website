import styled from 'styled-components'

export const ContactFormStyles = styled.form`& {
  display: flex;
  max-width: 28rem;
  flex-direction: column;
  gap: var(--space-md);
}

& [data-part=label] {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-ink);
}

& [data-part=field] {
  width: 100%;
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-sm);
  background-color: var(--surface-solid);
  padding: var(--space-sm) var(--space-md);
  font-size: 0.875rem;
  outline: none;
}

& [data-part=field]:focus-visible {
  border-color: var(--color-focus);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-focus) 50%, transparent);
}

& [data-part=note] {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
`
