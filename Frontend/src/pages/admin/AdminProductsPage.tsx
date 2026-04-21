import { useEffect, useState } from 'react'
import { adminApi, type AdminProduct } from '../../api/admin'
import {
  PageTitle,
  PageHint,
  TableWrap,
  Table,
  Thumb,
  InputSm,
  Btn,
  ErrorBox,
  SuccessBox,
  Card,
  CardTitle,
  FormGrid,
  Field,
} from './AdminPages.styles'

export function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [inventoryDraft, setInventoryDraft] = useState<Record<number, string>>({})
  const [savingId, setSavingId] = useState<number | null>(null)

  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newInventory, setNewInventory] = useState('100')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newRating, setNewRating] = useState('4.5')
  const [newReviewCount, setNewReviewCount] = useState('0')
  const [newBadge, setNewBadge] = useState('')
  const [newInStock, setNewInStock] = useState(true)
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [creating, setCreating] = useState(false)

  const load = () => {
    setError(null)
    return adminApi
      .getProducts()
      .then((list) => {
        setProducts(list)
        const draft: Record<number, string> = {}
        list.forEach((p) => {
          draft[p.id] = String(p.inventoryQuantity)
        })
        setInventoryDraft(draft)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
  }

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const saveInventory = async (id: number) => {
    const raw = inventoryDraft[id]
    const n = parseInt(raw, 10)
    if (Number.isNaN(n) || n < 0) {
      setError('Inventory must be a non-negative number')
      return
    }
    setSavingId(id)
    setError(null)
    try {
      const updated = await adminApi.updateInventory(id, n)
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
      setMessage(`Inventory updated for #${id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setSavingId(null)
    }
  }

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError(null)
    setMessage(null)
    const price = parseFloat(newPrice)
    if (!newName.trim() || !newCategory.trim() || Number.isNaN(price)) {
      setError('Name, category, and valid price are required')
      setCreating(false)
      return
    }
    const form = new FormData()
    form.append('name', newName.trim())
    form.append('description', newDesc)
    form.append('price', String(price))
    form.append('category', newCategory.trim())
    form.append('inventory', String(parseInt(newInventory, 10) || 0))
    if (newImageUrl.trim()) form.append('imageUrl', newImageUrl.trim())
    if (newRating) {
      const r = parseFloat(newRating)
      if (!Number.isNaN(r)) form.append('rating', String(r))
    }
    if (newReviewCount) {
      const rc = parseInt(newReviewCount, 10)
      if (!Number.isNaN(rc)) form.append('reviewCount', String(rc))
    }
    if (newBadge.trim()) form.append('badge', newBadge.trim())
    form.append('inStock', String(newInStock))
    if (newImageFile) form.append('image', newImageFile)

    try {
      await adminApi.createProduct(form)
      setMessage('Product created')
      setNewName('')
      setNewDesc('')
      setNewPrice('')
      setNewCategory('')
      setNewInventory('100')
      setNewImageUrl('')
      setNewRating('4.5')
      setNewReviewCount('0')
      setNewBadge('')
      setNewInStock(true)
      setNewImageFile(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <PageTitle>Loading products…</PageTitle>

  return (
    <>
      <PageTitle>Products & inventory</PageTitle>
      <PageHint>Update stock counts or add products. Images can be a URL or an uploaded file (stored in the database).</PageHint>
      {error && <ErrorBox>{error}</ErrorBox>}
      {message && <SuccessBox>{message}</SuccessBox>}

      <Card>
        <CardTitle>Add product</CardTitle>
        <form onSubmit={createProduct}>
          <FormGrid>
            <Field>
              Name *
              <input value={newName} onChange={(e) => setNewName(e.target.value)} required />
            </Field>
            <Field>
              Description
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            </Field>
            <Field>
              Price *
              <input type="number" step="0.01" min="0" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
            </Field>
            <Field>
              Category *
              <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Toys" required />
            </Field>
            <Field>
              Initial inventory
              <input type="number" min="0" value={newInventory} onChange={(e) => setNewInventory(e.target.value)} />
            </Field>
            <Field>
              Image URL (optional if you upload a file)
              <input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="https://..." />
            </Field>
            <Field>
              Upload image (optional, stored in DB)
              <input type="file" accept="image/*" onChange={(e) => setNewImageFile(e.target.files?.[0] ?? null)} />
            </Field>
            <Field>
              Rating
              <input type="number" step="0.1" value={newRating} onChange={(e) => setNewRating(e.target.value)} />
            </Field>
            <Field>
              Review count
              <input type="number" min="0" value={newReviewCount} onChange={(e) => setNewReviewCount(e.target.value)} />
            </Field>
            <Field>
              Badge
              <input value={newBadge} onChange={(e) => setNewBadge(e.target.value)} placeholder="New / Sale" />
            </Field>
            <Field style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={newInStock} onChange={(e) => setNewInStock(e.target.checked)} id="inStock" />
              <span style={{ fontWeight: 400 }}>In stock flag</span>
            </Field>
            <Btn type="submit" disabled={creating}>
              {creating ? 'Creating…' : 'Create product'}
            </Btn>
          </FormGrid>
        </form>
      </Card>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Inventory</th>
              <th>In stock</th>
              <th>Rating</th>
              <th>Badge</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={p.inventoryQuantity <= 10 ? { background: '#fff8e1' } : undefined}>
                <td>{p.inventoryQuantity <= 10 && <span title="Low stock" style={{ color: '#e67e22', fontWeight: 700 }}>⚠</span>}</td>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>
                  <InputSm
                    type="number"
                    min={0}
                    value={inventoryDraft[p.id] ?? ''}
                    onChange={(e) => setInventoryDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                  />
                  <Btn
                    type="button"
                    style={{ marginLeft: '0.35rem' }}
                    disabled={savingId === p.id}
                    onClick={() => saveInventory(p.id)}
                  >
                    Save
                  </Btn>
                  {p.inventoryQuantity <= 10 && (
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#e67e22', fontWeight: 600 }}>
                      Low stock
                    </span>
                  )}
                </td>
                <td>{p.inStock ? 'Yes' : 'No'}</td>
                <td>{p.rating ?? '—'}</td>
                <td>{p.badge ?? '—'}</td>
                <td>
                  {p.imageUrl ? (
                    <Thumb src={p.imageUrl} alt="" />
                  ) : (
                    <span style={{ color: '#9ca3af' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </>
  )
}
