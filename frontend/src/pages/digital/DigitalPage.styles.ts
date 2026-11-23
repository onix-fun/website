import styled from 'styled-components'
import { Page } from '@onix/ui-kit'
import { BREAKPOINTS } from '@onix/ui-kit'

export const DigitalPageStyles = styled(Page)`& {
  padding-block: var(--space-2xl);
}

& [data-part=content] {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & {
    padding-block: var(--space-xl);
  }
}
`
