import styled from 'styled-components'
import { Link, NavLink } from 'react-router-dom'
import { theme } from '../../theme'

export const AdminShell = styled.div`
  display: flex;
  min-height: calc(100vh - 80px);
  background: ${theme.colors.greyBg};

  @media (max-width: 768px) {
    flex-direction: column;
  }
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
    flex-wrap: nowrap;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
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
    flex-shrink: 0;
    border-bottom: none;
    border-right: 1px solid rgba(255, 255, 255, 0.15);
    margin-bottom: 0;
    margin-right: 0.25rem;
    padding: 0.35rem 1rem 0.35rem 0;
    display: flex;
    align-items: center;
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
    flex-shrink: 0;
    padding: 0.4rem 0.75rem;
    border-radius: ${theme.radius.sm};
    border-left: none;
    white-space: nowrap;
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

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
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

export const SortTh = styled.th<{ $active: boolean; $asc: boolean }>`
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  &::after {
    content: '${({ $active, $asc }) => ($active ? ($asc ? ' ▲' : ' ▼') : ' ⇅')}';
    font-size: 0.7rem;
    opacity: ${({ $active }) => ($active ? 1 : 0.35)};
    margin-left: 0.2rem;
  }
  &:hover { background: ${theme.colors.border}; }
`

export const Thumb = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.greyBg};
  transition: opacity 0.15s;
  &:hover { opacity: 0.8; }
`

export const ThumbWrap = styled.span`
  position: relative;
  display: inline-block;
  cursor: zoom-in;

  &[data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: ${theme.colors.charcoal};
    color: #fff;
    font-size: 0.72rem;
    white-space: nowrap;
    padding: 0.25rem 0.5rem;
    border-radius: ${theme.radius.sm};
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }
  &[data-tooltip]:hover::after { opacity: 1; }
`

export const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  cursor: zoom-out;
`

export const LightboxImg = styled.img`
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: ${theme.radius.md};
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
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


export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

export const ModalBox = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.radius.md};
  padding: 2rem;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);

  @media (max-width: 480px) {
    padding: 1.25rem;
    margin: 0 0.75rem;
    width: calc(100% - 1.5rem);
  }
`

export const ModalTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.25rem;
  color: ${theme.colors.charcoal};
`

export const BodyPreview = styled.pre`
  margin: 0.75rem 0 0;
  padding: 0.75rem;
  background: ${theme.colors.greyBg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  font-size: 0.82rem;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  color: ${theme.colors.charcoal};
`

export const IconBtn = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: ${theme.colors.grey};
  font-size: 1rem;
  line-height: 1;
  border-radius: ${theme.radius.sm};
  &:hover { color: ${theme.colors.charcoal}; background: ${theme.colors.greyBg}; }

  &[data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: ${theme.colors.charcoal};
    color: #fff;
    font-size: 0.72rem;
    white-space: nowrap;
    padding: 0.25rem 0.5rem;
    border-radius: ${theme.radius.sm};
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }
  &[data-tooltip]:hover::after {
    opacity: 1;
  }
`
