import { FooterSection, TopRow, Brand, Logo, Description, SocialLinks, LinkColumns, Column, ColumnTitle, ColumnLink, BottomRow, Copyright, PaymentIcons } from './Footer.styles'

const shopLinks = [
  { label: 'Shop All', href: '#' },
  { label: 'Food & Treats', href: '#' },
  { label: 'Toys', href: '#' },
  { label: 'Beds & Furniture', href: '#' },
]

const supportLinks = [
  { label: 'Contact Us', href: '#' },
  { label: 'FAQs', href: '#' },
  { label: 'Shipping Info', href: '#' },
  { label: 'Returns', href: '#' },
]

const companyLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
]

const socialIcons = [
  { name: 'Instagram', href: '#', icon: '📷' },
  { name: 'Facebook', href: '#', icon: '📘' },
  { name: 'TikTok', href: '#', icon: '🎵' },
  { name: 'Pinterest', href: '#', icon: '📌' },
]

export function Footer() {
  return (
    <FooterSection>
      <TopRow>
        <Brand>
          <Logo href="#">PurrfectMarket</Logo>
          <Description>
            Premium cat care products for the modern pet parent. Quality, safety, and happiness in every purchase.
          </Description>
          <SocialLinks>
            {socialIcons.map(({ name, href, icon }) => (
              <a key={name} href={href} aria-label={name}>
                {icon}
              </a>
            ))}
          </SocialLinks>
        </Brand>
        <LinkColumns>
          <Column>
            <ColumnTitle>Shop</ColumnTitle>
            {shopLinks.map((link) => (
              <ColumnLink key={link.label} href={link.href}>{link.label}</ColumnLink>
            ))}
          </Column>
          <Column>
            <ColumnTitle>Support</ColumnTitle>
            {supportLinks.map((link) => (
              <ColumnLink key={link.label} href={link.href}>{link.label}</ColumnLink>
            ))}
          </Column>
          <Column>
            <ColumnTitle>Company</ColumnTitle>
            {companyLinks.map((link) => (
              <ColumnLink key={link.label} href={link.href}>{link.label}</ColumnLink>
            ))}
          </Column>
        </LinkColumns>
      </TopRow>
      <BottomRow>
        <Copyright>© 2024 Purrfect Market. All rights reserved.</Copyright>
        <PaymentIcons>
          <span>Visa</span>
          <span>Mastercard</span>
          <span>Amex</span>
          <span>PayPal</span>
        </PaymentIcons>
      </BottomRow>
    </FooterSection>
  )
}
