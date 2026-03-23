import styled from 'styled-components'
import { theme } from '../theme'

export const PageContainer = styled.main`
  max-width: ${theme.spacing.container};
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`

export const PageHeader = styled.div`
  margin-bottom: 2rem;
`

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin-bottom: 0.5rem;
`

export const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.grey};
`

export const CartLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const CartItemCard = styled.div`
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid #eee;
`

export const CartItemImage = styled.div`
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: ${theme.radius.md};
  overflow: hidden;
  background: ${theme.colors.greyBg};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const CartItemDetails = styled.div`
  flex: 1;
  min-width: 0;
`

export const CartItemName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.colors.navy};
  margin-bottom: 0.25rem;
`

export const CartItemPrice = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.primary};
  margin-bottom: 0.5rem;
`

export const CartItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const QtyButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.colors.greyLight};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.white};
  color: ${theme.colors.charcoal};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;

  &:hover:not(:disabled) {
    background: ${theme.colors.greyBg};
    border-color: ${theme.colors.grey};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const QtyDisplay = styled.span`
  min-width: 2rem;
  text-align: center;
  font-weight: 600;
  color: ${theme.colors.charcoal};
`

export const RemoveBtn = styled.button`
  margin-left: auto;
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  color: ${theme.colors.grey};
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #b91c1c;
  }
`

export const CartItemSubtotal = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.navy};
  flex-shrink: 0;
`

export const SummaryCard = styled.aside`
  position: sticky;
  top: 1rem;
  padding: 1.5rem;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.md};
  border: 1px solid #eee;
`

export const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin-bottom: 1rem;
`

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: ${theme.colors.charcoal};
`

export const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${theme.colors.navy};
`

export const CheckoutBtn = styled.button`
  width: 100%;
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.colors.white};
  background: ${theme.colors.primary};
  border: none;
  border-radius: ${theme.radius.md};
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const EmptyMessage = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: ${theme.colors.grey};
  padding: 3rem;
`

export const EmptyLink = styled.a`
  font-weight: 600;
  color: ${theme.colors.primary};
  text-decoration: underline;
  text-underline-offset: 2px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;

  &:hover {
    color: ${theme.colors.primaryDark};
  }
`

export const Loading = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: ${theme.colors.grey};
  padding: 3rem;
`

export const ErrorMessage = styled.p`
  padding: 1rem;
  font-size: 1rem;
  color: #b91c1c;
  background: #fef2f2;
  border-radius: ${theme.radius.md};
`

export const OrdersSection = styled.section`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
`

export const OrderCard = styled.div`
  padding: 1.25rem;
  margin-bottom: 1rem;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid #eee;
`

export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const OrderId = styled.span`
  font-weight: 600;
  color: ${theme.colors.navy};
`

export const OrderDate = styled.span`
  font-size: 0.9rem;
  color: ${theme.colors.grey};
`

export const OrderTotal = styled.span`
  font-weight: 700;
  color: ${theme.colors.primary};
`

export const OrderItemsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.95rem;
  color: ${theme.colors.charcoal};
`

export const OrderItemRow = styled.li`
  padding: 0.35rem 0;
  display: flex;
  justify-content: space-between;
`

export const SuccessMessage = styled.div`
  padding: 2rem;
  text-align: center;
  background: #f0fdf4;
  border-radius: ${theme.radius.lg};
  border: 1px solid #bbf7d0;
  margin-bottom: 2rem;
`

export const SuccessTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #166534;
  margin-bottom: 0.5rem;
`

export const SuccessText = styled.p`
  color: #15803d;
  margin-bottom: 1rem;
`
