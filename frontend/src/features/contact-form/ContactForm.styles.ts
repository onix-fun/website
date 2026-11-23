import styled from 'styled-components'
import { BREAKPOINTS } from '@onix/ui-kit'

export const ContactFormStyles = styled.form`& {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  border: var(--border-width) solid var(--color-hairline);
  border-radius: var(--radius-panel);
  background: color-mix(in srgb, var(--surface-raised) 88%, transparent);
  padding: var(--space-xl);
  box-shadow: var(--shadow-sm);
}

& [data-part=types] {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin: 0;
  border: 0;
  padding: 0;
}

& [data-part=types] legend {
  margin-bottom: var(--space-md);
  color: var(--onix-hero-text-primary);
  font-size: var(--font-size-title);
  font-weight: 600;
}

& [data-part=typeOptions] {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-sm);
}

& [data-part=typeOption] {
  display: flex;
  min-height: 4rem;
  align-items: center;
  gap: var(--space-sm);
  border: var(--border-width) solid var(--color-hairline);
  border-radius: var(--radius-md);
  background: var(--surface-solid);
  padding: var(--space-md);
  color: var(--onix-hero-text-primary);
  cursor: pointer;
  line-height: var(--line-height-body);
  transition:
    border-color var(--duration-fast) var(--ease-out),
    background var(--duration-fast) var(--ease-out);
}

& [data-part=typeOption][data-selected=true] {
  border-color: var(--color-accent-hover);
  background: color-mix(in srgb, var(--color-accent-soft) 22%, var(--surface-raised));
}

& [data-part=typeOption] input {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  accent-color: var(--color-accent-hover);
}

& [data-part=typeOption]:focus-within {
  outline: var(--border-width) solid var(--color-focus);
  outline-offset: var(--space-xs);
}

& [data-part=fieldGrid] {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
}

& [data-part=label] {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  color: var(--onix-hero-text-primary);
  font-size: 0.875rem;
  font-weight: 500;
}

& [data-part=optional] {
  color: var(--color-text-muted);
  font-size: var(--font-size-caption);
  font-weight: 400;
}

& [data-part=field] {
  width: 100%;
  min-height: 3rem;
  border: var(--border-width) solid var(--color-hairline-strong);
  border-radius: var(--radius-sm);
  background: var(--surface-solid);
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text);
  font: inherit;
  font-weight: 400;
  outline: none;
}

& textarea[data-part=field] {
  min-height: 8rem;
  resize: vertical;
  line-height: var(--line-height-body);
}

& [data-part=field]::placeholder {
  color: var(--color-text-muted);
  opacity: 0.8;
}

& [data-part=field]:focus-visible {
  border-color: var(--color-focus);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-focus) 30%, transparent);
}

& [data-part=consent] {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: var(--line-height-body);
}

& [data-part=consent] input {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  margin-top: 0.2rem;
  accent-color: var(--color-accent-hover);
}

& [data-part=consent] a,& [data-part=status] a {
  color: var(--onix-hero-text-primary);
  font-weight: 600;
  text-decoration-line: underline;
  text-decoration-color: var(--color-accent-hover);
  text-underline-offset: 0.2em;
}

& [data-part=consent] a:focus-visible,& [data-part=status] a:focus-visible {
  border-radius: var(--radius-sm);
  outline: var(--border-width) solid var(--color-focus);
  outline-offset: var(--space-xs);
}

& [data-part=submitRow] {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

& [data-part=submitRow] button {
  min-height: var(--onix-hero-action-height);
  gap: var(--space-sm);
  border-radius: var(--radius-lg);
  padding-inline: var(--space-lg);
}

& [data-part=formNote],& [data-part=status] {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-caption);
  line-height: var(--line-height-body);
}

& [data-part=status] {
  border-top: var(--border-width) solid var(--color-hairline);
  padding-top: var(--space-md);
}

& [data-part=honeypot] {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

@media (max-width: ${BREAKPOINTS.md}) {
  & [data-part=typeOptions] {
    grid-template-columns: 1fr;
  }
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & {
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
  }

  & [data-part=fieldGrid] {
    grid-template-columns: 1fr;
  }

  & [data-part=submitRow] {
    align-items: flex-start;
    flex-direction: column;
  }
}
`
