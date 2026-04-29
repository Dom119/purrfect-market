import styled, { keyframes } from 'styled-components'
import { theme } from '../../theme'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

/* Inline SVG grain — fractalNoise creates the tactile printed feel */
const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)'/%3E%3C/svg%3E")`

export const HeroWrapper = styled.section`
  position: relative;
  background: ${theme.colors.offWhite};

  /* Grain texture overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${grain};
    background-repeat: repeat;
    background-size: 200px 200px;
    opacity: 0.045;
    pointer-events: none;
    z-index: 1;
  }
`

export const HeroInner = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 5rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 5.5rem 2rem 6.5rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 3.5rem;
    padding: 3.5rem 1.5rem 5rem;
  }

  @media (max-width: 480px) {
    gap: 2rem;
    padding: 2.5rem 1.25rem 3.5rem;
  }
`

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
`

export const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${fadeUp} 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.05s;
`

export const EyebrowRule = styled.span`
  display: block;
  width: 36px;
  height: 1px;
  background: #b89b6a;
  flex-shrink: 0;
`

export const EyebrowLabel = styled.span`
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #b89b6a;
`

export const Title = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(3.75rem, 5.5vw, 6.25rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.04;
  color: ${theme.colors.navy};
  margin-bottom: 2rem;
  animation: ${fadeUp} 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.2s;

  em {
    font-style: normal;
    color: #c4622d;
  }

  @media (max-width: 480px) {
    font-size: clamp(2.25rem, 8.5vw, 3rem);
    margin-bottom: 1.25rem;
  }
`

export const Subtitle = styled.p`
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.975rem;
  font-weight: 300;
  line-height: 1.85;
  color: ${theme.colors.grey};
  max-width: 390px;
  margin-bottom: 2.75rem;
  animation: ${fadeUp} 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.35s;

  @media (max-width: 480px) {
    margin-bottom: 1.75rem;
    max-width: 100%;
  }
`

export const CtaGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2.25rem;
  margin-bottom: 3rem;
  animation: ${fadeUp} 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.5s;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
    margin-bottom: 2rem;
  }
`

export const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.9rem 2rem;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #f0ebe1;
  background: #c4622d;
  border: 1px solid #c4622d;
  transition: background 0.22s ease, border-color 0.22s ease;

  svg {
    transition: transform 0.22s ease;
    flex-shrink: 0;
  }

  &:hover {
    background: #d9744a;
    border-color: #d9744a;

    svg {
      transform: translateX(5px);
    }
  }
`

export const SecondaryButton = styled.a`
  position: relative;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.82rem;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: ${theme.colors.charcoal};

  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 1px;
    background: rgba(184, 155, 106, 0.5);
    transform: scaleX(0.35);
    transform-origin: left center;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover::after {
    transform: scaleX(1);
  }
`

export const SocialProof = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: ${fadeUp} 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.65s;
`

export const Avatars = styled.div`
  display: flex;

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1.5px solid ${theme.colors.offWhite};
    margin-left: -7px;
    object-fit: cover;

    &:first-child {
      margin-left: 0;
    }
  }
`

export const SocialText = styled.span`
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 300;
  color: ${theme.colors.grey};
`

/* ── Right column: image ── */

export const HeroImageWrapper = styled.div`
  position: relative;
  animation: ${fadeIn} 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.25s;

  @media (max-width: 960px) {
    max-width: 440px;
    margin: 0 auto;
  }
`

export const HeroImageFrame = styled.div`
  position: relative;

  /* Decorative offset border */
  &::before {
    content: '';
    position: absolute;
    top: -14px;
    right: -14px;
    bottom: 14px;
    left: 14px;
    border: 1px solid rgba(184, 155, 106, 0.2);
    pointer-events: none;
    z-index: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 0.5;
  }

  img {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 540px;
    object-fit: cover;
    object-position: center 20%;
    display: block;
    filter: brightness(0.92) contrast(1.04);
  }

  @media (max-width: 960px) {
    img {
      height: 400px;
    }
  }

  @media (max-width: 480px) {
    &::before {
      display: none;
    }

    img {
      height: 280px;
    }
  }
`

export const VetBadge = styled.div`
  position: absolute;
  bottom: -1.25rem;
  left: -1.25rem;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.25rem;
  background: ${theme.colors.white};
  border: 1px solid rgba(184, 155, 106, 0.35);

  svg {
    color: #b89b6a;
    flex-shrink: 0;
  }

  span {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 0.72rem;
    font-weight: 400;
    letter-spacing: 0.05em;
    color: ${theme.colors.charcoal};
  }

  @media (max-width: 480px) {
    left: 0;
    bottom: -1rem;
    padding: 0.6rem 1rem;
  }
`

export const VerticalLabel = styled.div`
  position: absolute;
  top: 2rem;
  right: -0.75rem;
  z-index: 2;
  writing-mode: vertical-rl;
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(184, 155, 106, 0.4);
  user-select: none;
`
