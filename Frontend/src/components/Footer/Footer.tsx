import { Link } from 'react-router-dom'
import { FooterSection, TopRow, Brand, Logo, Description, SocialLinks, LinkColumns, Column, ColumnTitle, ColumnLink, BottomRow, Copyright, PaymentIcons } from './Footer.styles'

const shopLinks = [
  { label: 'Shop All', to: '/products' },
  { label: 'Food & Treats', to: `/products?category=${encodeURIComponent('Food & Treats')}` },
  { label: 'Toys', to: '/products?category=Toys' },
  { label: 'Beds', to: '/products?category=Beds' },
]

const supportLinks = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'FAQs', to: '/faq' },
  { label: 'Shipping Info', to: '/shipping' },
  { label: 'Returns', to: '/shipping' },
]

const companyLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Careers', to: '/about' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
]

const socialIcons = [
  { name: 'Instagram', href: 'https://instagram.com', icon: '📷' },
  { name: 'Facebook', href: 'https://facebook.com', icon: '📘' },
  { name: 'TikTok', href: 'https://tiktok.com', icon: '🎵' },
  { name: 'Pinterest', href: 'https://pinterest.com', icon: '📌' },
]

export function Footer() {
  return (
    <FooterSection>
      <TopRow>
        <Brand>
          <Logo as={Link} to="/">
            PurrfectMarket
          </Logo>
          <Description>
            Premium cat care products for the modern pet parent. Quality, safety, and happiness in every purchase.
          </Description>
          <SocialLinks>
            {socialIcons.map(({ name, href, icon }) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}>
                {icon}
              </a>
            ))}
          </SocialLinks>
        </Brand>
        <LinkColumns>
          <Column>
            <ColumnTitle>Shop</ColumnTitle>
            {shopLinks.map((link) => (
              <ColumnLink key={link.label} as={Link} to={link.to}>
                {link.label}
              </ColumnLink>
            ))}
          </Column>
          <Column>
            <ColumnTitle>Support</ColumnTitle>
            {supportLinks.map((link) => (
              <ColumnLink key={link.label} as={Link} to={link.to}>
                {link.label}
              </ColumnLink>
            ))}
          </Column>
          <Column>
            <ColumnTitle>Company</ColumnTitle>
            {companyLinks.map((link) => (
              <ColumnLink key={link.label} as={Link} to={link.to}>
                {link.label}
              </ColumnLink>
            ))}
          </Column>
        </LinkColumns>
      </TopRow>
      <BottomRow>
        <Copyright>© 2026 Purrfect Market. All rights reserved.</Copyright>
        <PaymentIcons>
          <span>Visa</span>
          <span>Mastercard</span>
        </PaymentIcons>
      </BottomRow>
    </FooterSection>
  )
}
