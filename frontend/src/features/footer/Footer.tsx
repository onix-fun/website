import { FooterStyles } from './Footer.styles'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Container, Logo, Separator, SITE_CONTACT_URL } from '@onix/ui-kit'

const links = [
  { to: '/about', label: 'О нас' },
  { to: '/services', label: 'Услуги' },
  { to: '/catalog', label: 'Прототипы и мерч' },
  { to: '/digital', label: 'Цифровые продукты' },
]

const legalLinks = [
  { to: '/privacy', label: 'Политика конфиденциальности' },
  { to: '/personal-data', label: 'Согласие на обработку данных' },
  { to: '/cookies', label: 'Политика cookie' },
]

export function Footer() {
  return (
    <FooterStyles data-part="footer">
      <Container as="div" data-part="container" innerDataPart="inner">
        <Separator data-part="separator" />
        <div data-part="top">
          <div data-part="brand">
            <Logo data-part="logo" sizes={{ height: 'var(--footer-logo-height)' }} />
            <p>Open-source системы<br />и прототипы</p>
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
          <p>ONIX · Цифровые продукты и светильники</p>
          <nav data-part="legal" aria-label="Правовая информация">
            <ul data-part="legalLinks">
              {legalLinks.map((link) => (
                <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
              ))}
            </ul>
          </nav>
          <a href={SITE_CONTACT_URL} target="_blank" rel="noreferrer noopener">@doc_up</a>
        </div>
      </Container>
    </FooterStyles>
  )
}
