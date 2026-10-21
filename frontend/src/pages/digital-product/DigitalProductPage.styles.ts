import styled from 'styled-components'
import { Page } from '@/common/ui/page'
import { BREAKPOINTS } from '@/common/styles/breakpoints'

export const DigitalProductPageStyles = styled(Page)`& {
  padding-block: var(--space-xl);
}

@media (max-width: ${BREAKPOINTS.sm}) {
  & {
    padding-block: var(--space-lg);
  }
}
`
