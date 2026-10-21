import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Container, Logo, Separator, SITE_CONTACT_URL } from '@/common'
import styles from './Footer.module.scss'

const links = [
  { to: '/about', label: 'О нас' },
  { to: '/services', label: 'Услуги' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/digital', label: 'Цифровые продукты' },
]

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container as="div" className={styles.container} innerClassName={styles.inner}>
        <Separator className={styles.separator} />
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo className={styles.logo} sizes={{ height: 'var(--footer-logo-height)' }} />
            <p>Предметный дизайн<br />и 3D-печать</p>
          </div>
          <nav aria-label="Навигация в подвале">
            <ul className={styles.links}>
              {links.map((link) => (
                <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
              ))}
            </ul>
          </nav>
          <a className={styles.contact} href={SITE_CONTACT_URL} target="_blank" rel="noreferrer noopener">
            <span>Написать в Telegram</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <Separator className={styles.separator} />
        <div className={styles.bottom}>
          <p>ONIX · Студия предметного дизайна</p>
          <a href={SITE_CONTACT_URL} target="_blank" rel="noreferrer noopener">@doc_up</a>
        </div>
      </Container>
    </footer>
  )
}
