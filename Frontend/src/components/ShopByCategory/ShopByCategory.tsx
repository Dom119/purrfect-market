import { Link } from 'react-router-dom'
import { Section, SectionHeader, Title, Subtitle, Grid, Card } from './ShopByCategory.styles'

const categories = [
  {
    id: 'food',
    title: 'Food & Treats',
    category: 'Food & Treats',
    description: 'Nutritious meals',
    iconBg: '#F2A365',
    icon: '🍽️',
  },
  {
    id: 'toys',
    title: 'Toys',
    category: 'Toys',
    description: 'Interactive fun',
    iconBg: '#5bc0be',
    icon: '🎾',
  },
  {
    id: 'beds',
    title: 'Beds',
    category: 'Beds',
    description: 'Cozy resting spots',
    iconBg: '#f4d35e',
    icon: '🛏️',
  },
  {
    id: 'grooming',
    title: 'Grooming',
    category: 'Grooming',
    description: 'Health & hygiene',
    iconBg: '#9b8ec2',
    icon: '✨',
  },
]

export function ShopByCategory() {
  return (
    <Section>
      <SectionHeader>
        <Title>Shop by Category</Title>
        <Subtitle>Find everything your cat needs in one place</Subtitle>
      </SectionHeader>
      <Grid>
        {categories.map((cat) => (
          <Card
            key={cat.id}
            as={Link}
            to={`/products?category=${encodeURIComponent(cat.category)}`}
            $iconBg={cat.iconBg}
          >
            <span className="icon">{cat.icon}</span>
            <h3>{cat.title}</h3>
            <p>{cat.description}</p>
          </Card>
        ))}
      </Grid>
    </Section>
  )
}
