import styled from 'styled-components'
import { theme } from '../../theme'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`

export const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 640px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.xl};
  box-shadow: ${theme.shadows.lg};
  overflow: hidden;
`

export const Header = styled.div`
  padding: 1.5rem 1.75rem 1rem;
  border-bottom: 1px solid ${theme.colors.border};
  flex-shrink: 0;
`

export const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin: 0 0 0.35rem;
`

export const Summary = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: ${theme.colors.grey};
`

export const AvgRating = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.navy};
`

export const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.greyBg};
  border: none;
  border-radius: ${theme.radius.full};
  color: ${theme.colors.charcoal};
  cursor: pointer;

  &:hover { background: ${theme.colors.border}; }
`

export const List = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 1rem 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const ReviewCard = styled.div`
  display: flex;
  gap: 1rem;
`

export const Avatar = styled.div`
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: ${theme.radius.full};
  background: ${theme.colors.primary};
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Body = styled.div`
  flex: 1;
  min-width: 0;
`

export const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.15rem;
`

export const AuthorName = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${theme.colors.navy};
`

export const ReviewDate = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.grey};
`

export const ReviewTitle = styled.p`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${theme.colors.charcoal};
  margin: 0.25rem 0 0.2rem;
`

export const ReviewBody = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.charcoal};
  line-height: 1.55;
  margin: 0;
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border};
  margin: 0;
`

export const Empty = styled.p`
  color: ${theme.colors.grey};
  font-size: 0.9rem;
  text-align: center;
  padding: 2rem 0;
`
