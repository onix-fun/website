import { Moon, Sun } from 'lucide-react'
import { useColorTheme } from '@/common/hooks/useColorTheme'
export function ThemeToggle({ visible }: { visible: boolean }) {
  const { theme, toggleTheme } = useColorTheme()
  const nextThemeLabel = theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'
  const Icon = theme === 'dark' ? Sun : Moon

  return (
    <div
      data-part="themeToggleSlot"
      data-state={visible ? 'visible' : 'hidden'}
      aria-hidden={!visible}
    >
      <button
        type="button"
        data-part="themeToggle"
        aria-label={nextThemeLabel}
        aria-pressed={theme === 'dark'}
        title={nextThemeLabel}
        tabIndex={visible ? 0 : -1}
        onClick={toggleTheme}
      >
        <Icon aria-hidden="true" strokeWidth={1.8} />
      </button>
    </div>
  )
}
