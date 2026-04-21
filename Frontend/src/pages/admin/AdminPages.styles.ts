import styled from 'styled-components'
import { Link, NavLink } from 'react-router-dom'
import { theme } from '../../theme'

export const AdminShell = styled.div`
  display: flex;
  min-height: calc(100vh - 80px);
  background: ${theme.colors.greyBg};
`

export const AdminSidebar = styled.aside`
  width: 220px;
  flex-shrink: 0;
  background: ${theme.colors.alwaysDark};
  color: white;
  padding: 1.5rem 0;

  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 1rem;
  }
`

export const AdminBrand = styled(Link)`
  display: block;
  padding: 0 1.25rem 1.25rem;
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0.5rem;
  }
`

export const SideNavLink = styled(NavLink)`
  display: block;
  padding: 0.65rem 1.25rem;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  font-size: 0.95rem;
  border-left: 3px solid transparent;

  &.active {
    color: white;
    background: rgba(255, 255, 255, 0.08);
    border-left-color: ${theme.colors.primary};
  }

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    border-radius: ${theme.radius.sm};
    border-left: none;
    &.active {
      background: rgba(255, 255, 255, 0.15);
    }
  }
`

export const AdminMain = styled.main`
  flex: 1;
  padding: 2rem 1.5rem;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
`

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin-bottom: 0.5rem;
`

export const PageHint = styled.p`
  color: ${theme.colors.grey};
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`

export const TableWrap = styled.div`
  overflow-x: auto;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid ${theme.colors.border};
    color: ${theme.colors.charcoal};
  }

  th {
    background: ${theme.colors.greyBg};
    font-weight: 600;
    color: ${theme.colors.navy};
  }
`

export const Thumb = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.greyBg};
`

export const InputSm = styled.input`
  width: 4.5rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid ${theme.colors.greyLight};
  border-radius: ${theme.radius.sm};
  font-size: 0.9rem;
  background: ${theme.colors.white};
  color: ${theme.colors.charcoal};
`

export const Btn = styled.button`
  padding: 0.4rem 0.85rem;
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  border-radius: ${theme.radius.sm};
  cursor: pointer;
  background: ${theme.colors.primary};
  color: white;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const BtnSecondary = styled(Btn)`
  background: ${theme.colors.alwaysDark};
  &:hover:not(:disabled) {
    background: #2a2a4a;
  }
`

export const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
  max-width: 520px;
  margin-top: 1rem;
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${theme.colors.charcoal};

  input,
  textarea,
  select {
    font-weight: 400;
    padding: 0.6rem 0.75rem;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius.sm};
    font-size: 1rem;
    background: ${theme.colors.greyBg};
    color: ${theme.colors.charcoal};
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`

export const ErrorBox = styled.div`
  padding: 1rem;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: ${theme.radius.md};
  margin-bottom: 1rem;
  font-size: 0.95rem;
`

export const SuccessBox = styled.div`
  padding: 1rem;
  background: #f0fdf4;
  color: #166534;
  border-radius: ${theme.radius.md};
  margin-bottom: 1rem;
  font-size: 0.95rem;
`

export const Card = styled.div`
  background: ${theme.colors.white};
  padding: 1.5rem;
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
  margin-bottom: 1.5rem;
`

export const CardTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${theme.colors.navy};
  margin-bottom: 1rem;
`

export const TableToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
`

export const CheckboxHeader = styled.th`
  width: 2.5rem;
  text-align: center;
`

export const CheckboxCell = styled.td`
  text-align: center;
  vertical-align: middle;
`

export const RowCheckbox = styled.input`
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
`

export const SelectSm = styled.select`
  padding: 0.4rem 0.6rem;
  font-size: 0.9rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.white};
  color: ${theme.colors.charcoal};
  min-width: 10rem;
`

export const FilterInput = styled.input`
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding: 0.35rem 0.45rem;
  font-size: 0.8rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  box-sizing: border-box;
  background: ${theme.colors.white};
  color: ${theme.colors.charcoal};

  &::placeholder {
    color: ${theme.colors.grey};
  }
`

export const FilterSelect = styled.select`
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding: 0.35rem 1.75rem 0.35rem 0.45rem;
  font-size: 0.8rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  box-sizing: border-box;
  background: ${theme.colors.white};
  color: ${theme.colors.charcoal};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.4rem center;
`

export const FilterMeta = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.grey};
  margin: 0 0 0.75rem;
`
