import { FooterStyles } from './Footer.styles'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Container, Logo, Separator, SITE_CONTACT_URL } from '@/common'

const links = [
  { to: '/about', label: 'О нас' },
  { to: '/services', label: 'Услуги' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/digital', label: 'Цифровые продукты' },
]

export function Footer() {
  return (
    <FooterStyles data-part="footer">
      <Container as="div" data-part="container" innerDataPart="inner">
        <Separator data-part="separator" />
        <div data-part="top">
          <div data-part="brand">
            <Logo data-part="logo" sizes={{ height: 'var(--footer-logo-height)' }} />
            <p>Предметный дизайн<br />и 3D-печать</p>
          </div>
          <nav aria-label="Навигация в подвале">
            <ul data-part="links">
              {links.map((link) => (
                <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
              ))}
            </ul>
          </nav>
          <a data-part="contact" href={SITE_CONTACT_URL} target="_blank" rel="noreferrer noopener">
            <span>Написать в Telegram</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <Separator data-part="separator" />
        <div data-part="bottom">
          <p>ONIX · Студия предметного дизайна</p>
          <a href={SITE_CONTACT_URL} target="_blank" rel="noreferrer noopener">@doc_up</a>
        </div>
      </Container>
    </FooterStyles>
  )
}
