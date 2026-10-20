import type { ReactNode } from 'react'
import { cn } from '@/common/lib/utils'
import { Container } from './layout'

export interface PageProps {
  /** Page title rendered as a heading. Omit for fully custom content. */
  title?: string
  /** Centers the content on both axes (hero/empty states). */
  centered?: boolean
  /** Content alignment value passed through to the container. */
  className?: string
  /** Heading size; defaults to `lg`. */
  titleSize?: 'lg' | 'xl' | '2xl'
  children?: ReactNode
}

/**
 * Standard page shell: `main#main-content` on the shared header grid, with an
 * optional title. All spacing/typography come from the shell so pages carry no
 * styles of their own.
 */
export function Page({ title, centered = false, titleSize = 'lg', className, children }: PageProps) {
  return (
    <Container
      as="main"
      id="main-content"
      className={cn('flex flex-1', !centered && 'py-10', className)}
      innerClassName={cn(
        'flex flex-col',
        centered ? 'items-center justify-center gap-6 text-center' : 'gap-6',
        '[&_p]:text-muted-foreground',
      )}
    >
      {title ? (
        <h1
          className={cn(
            'font-medium tracking-tight',
            titleSize === '2xl' ? 'text-3xl' : titleSize === 'xl' ? 'text-4xl' : 'text-2xl',
          )}
        >
          {title}
        </h1>
      ) : null}
      {children}
    </Container>
  )
}
