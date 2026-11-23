import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@onix/ui-kit/styles.css'
import { App } from '@/app/App'
import { restoreDeepLink } from '@/app/navigation'

restoreDeepLink()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
