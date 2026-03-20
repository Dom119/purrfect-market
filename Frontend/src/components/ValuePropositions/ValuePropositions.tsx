import { Bar, Item, Icon, Text } from './ValuePropositions.styles'

const items = [
  { icon: LeafIcon, text: '100% Safe & Natural', color: '#6bcb77' },
  { icon: TruckIcon, text: 'Fast, Free Shipping', color: '#F2A365' },
  { icon: ReturnIcon, text: '30-Day Easy Returns', color: '#4d96ff' },
]

export function ValuePropositions() {
  return (
    <Bar>
      {items.map(({ icon: IconComponent, text, color }) => (
        <Item key={text}>
          <Icon $color={color}>
            <IconComponent />
          </Icon>
          <Text>{text}</Text>
        </Item>
      ))}
    </Bar>
  )
}

function LeafIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.49.4C8.5 16 10 12 17 8z" />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9.5 1.96 2.5H17V9.5h2.5zm-1.5 9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  )
}

function ReturnIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    </svg>
  )
}
