import { useState } from 'react'
import {
  PageContainer,
  FeedWrapper,
  PageHeader,
  Title,
  Subtitle,
  Feed,
  ArticleCard,
  ArticleImage,
  ArticleBody,
  ArticleMeta,
  ArticleTitle,
  ArticleExcerpt,
  ArticlePreview,
  ArticleFullContent,
  ExpandHint,
} from './BlogPage.styles'

const ARTICLES = [
  {
    id: 1,
    title: '5 Tips for Choosing the Best Cat Food',
    excerpt:
      'From reading labels to understanding your cat\'s life stage, learn how to pick nutritious food that keeps your feline friend healthy and happy.',
    date: 'Mar 15, 2025',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop',
    content: (
      <>
        <p>
          Choosing the right cat food can feel overwhelming with so many options on the shelf. Here are five practical tips to help you make the best choice for your feline friend.
        </p>
        <h3>1. Read the ingredient list</h3>
        <p>
          The first few ingredients make up the bulk of the food. Look for named protein sources like chicken, salmon, or turkey—not vague terms like "meat by-products." Avoid foods where fillers like corn or wheat dominate the list.
        </p>
        <h3>2. Match food to life stage</h3>
        <p>
          Kittens need more calories and nutrients for growth, while senior cats may benefit from formulas with joint support. Adult cats in their prime have different needs than growing or aging cats.
        </p>
        <h3>3. Consider your cat&apos;s health</h3>
        <p>
          If your cat has allergies, weight issues, or urinary problems, look for formulas designed to address those concerns. Your vet can recommend prescription or specialty diets when needed.
        </p>
        <h3>4. Check for AAFCO approval</h3>
        <p>
          Foods that meet AAFCO (Association of American Feed Control Officials) standards have been tested for nutritional adequacy. This ensures the food provides complete and balanced nutrition.
        </p>
        <h3>5. Transition slowly</h3>
        <p>
          When switching foods, mix the new food with the old over 7–10 days to avoid digestive upset. Start with 25% new food and gradually increase the ratio.
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: 'How to Keep Your Cat Active and Happy',
    excerpt:
      'Indoor cats need mental and physical stimulation. Discover fun toys, play routines, and enrichment ideas to prevent boredom.',
    date: 'Mar 10, 2025',
    image: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=600&h=400&fit=crop',
    content: (
      <>
        <p>
          Indoor cats live longer, safer lives—but they can easily become bored without enough stimulation. Here&apos;s how to keep your cat engaged and content.
        </p>
        <h3>Daily play sessions</h3>
        <p>
          Aim for at least two 15-minute play sessions per day. Use wand toys, laser pointers (with a treat reward at the end), or crinkle balls. Mimic prey behavior: quick movements, pauses, and "escapes" to trigger your cat&apos;s hunting instinct.
        </p>
        <h3>Rotate toys</h3>
        <p>
          Cats lose interest in toys they see every day. Keep a few out and rotate them weekly. A "new" toy from the closet can feel exciting again after a break.
        </p>
        <h3>Vertical space</h3>
        <p>
          Cat trees, shelves, and window perches give cats territory to explore and observe. Climbing and jumping are natural behaviors that keep muscles toned and minds sharp.
        </p>
        <h3>Puzzle feeders</h3>
        <p>
          Food puzzles and treat-dispensing toys turn mealtime into a game. They slow down eating, reduce boredom, and satisfy the urge to "hunt" for food.
        </p>
        <h3>Window entertainment</h3>
        <p>
          A bird feeder outside the window or a fish tank can provide hours of passive entertainment. Just make sure your cat has a comfortable perch to watch from.
        </p>
      </>
    ),
  },
  {
    id: 3,
    title: 'Understanding Your Cat\'s Body Language',
    excerpt:
      'Tail flicks, ear positions, and purring—decode what your cat is really telling you and strengthen your bond.',
    date: 'Mar 5, 2025',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&h=400&fit=crop',
    content: (
      <>
        <p>
          Cats communicate constantly through body language. Learning to read their signals helps you understand their mood, avoid stress, and build a stronger relationship.
        </p>
        <h3>The tail</h3>
        <p>
          A tail held high with a slight curve means a happy, confident cat. A puffed-up tail signals fear or aggression. A low, tucked tail suggests submission or fear. Slow swishing can mean focus or mild irritation; fast flicks often indicate annoyance.
        </p>
        <h3>Ears</h3>
        <p>
          Forward-facing ears show interest. Ears flattened sideways ("airplane ears") mean fear or irritation. Ears pinned back flat against the head signal aggression or extreme fear.
        </p>
        <h3>Eyes</h3>
        <p>
          Slow blinks are a sign of trust and affection—try slow-blinking back! Dilated pupils can mean excitement, fear, or playfulness depending on context. A fixed stare with constricted pupils can be a challenge or threat.
        </p>
        <h3>Purring</h3>
        <p>
          Purring usually means contentment, but cats also purr when stressed or in pain. Pay attention to context: relaxed posture + purring = happy; tense body + purring = may need comfort.
        </p>
        <h3>Kneading and head bunting</h3>
        <p>
          Kneading with paws is a leftover kitten behavior—a sign of comfort. Head bunting (rubbing their head on you) marks you as family and shows affection.
        </p>
      </>
    ),
  },
]

export function BlogPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <PageContainer>
      <FeedWrapper>
        <PageHeader>
          <Title>The Purrfect Blog</Title>
          <Subtitle>Tips, guides, and stories for cat lovers</Subtitle>
        </PageHeader>

        <Feed>
          {ARTICLES.map((article) => {
            const isExpanded = expandedId === article.id
            return (
              <ArticleCard key={article.id} $expanded={isExpanded}>
                <ArticlePreview
                  onClick={() => setExpandedId(isExpanded ? null : article.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setExpandedId(isExpanded ? null : article.id)
                    }
                  }}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Collapse article' : 'Expand article'}
                >
                  <ArticleImage>
                    <img src={article.image} alt="" />
                  </ArticleImage>
                  <ArticleBody>
                    <ArticleMeta>{article.date}</ArticleMeta>
                    <ArticleTitle>{article.title}</ArticleTitle>
                    <ArticleExcerpt>{article.excerpt}</ArticleExcerpt>
                    <ExpandHint>{isExpanded ? 'Click to collapse' : 'Click to read more'}</ExpandHint>
                  </ArticleBody>
                </ArticlePreview>
                {isExpanded && (
                  <ArticleFullContent>
                    {article.content}
                  </ArticleFullContent>
                )}
              </ArticleCard>
            )
          })}
        </Feed>
      </FeedWrapper>
    </PageContainer>
  )
}
