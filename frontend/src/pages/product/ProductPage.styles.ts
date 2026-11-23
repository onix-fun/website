import styled from 'styled-components'
import { Page } from '@onix/ui-kit'
import { BREAKPOINTS } from '@onix/ui-kit'

export const ProductPageStyles = styled(Page)`& {
  padding-block: var(--space-xl);
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & {
    padding-block: var(--space-lg);
  }
}
`
