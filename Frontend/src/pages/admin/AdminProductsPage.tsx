import { useEffect, useState } from 'react'
import { adminApi, type AdminProduct } from '../../api/admin'
import { fetchCategories } from '../../api/products'
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal'
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
  FormGrid,
  Field,
  ModalOverlay,
  ModalBox,
  ModalTitle,
  IconBtn,
  LightboxOverlay,
  LightboxImg,
  ThumbWrap,
  SortTh,
} from './AdminPages.styles'

interface EditDraft {
  name: string
  description: string
  price: string
  category: string
  categoryOther: boolean
  inventory: string
  imageUrl: string
  rating: string
  reviewCount: string
  badge: string
  inStock: boolean
  imageFile: File | null
}

const BADGE_OPTIONS = ['N/A', 'New', 'Sale', 'Hot', 'Best Seller']

function draftFromProduct(p: AdminProduct): EditDraft {
  return {
    name: p.name,
    description: p.description ?? '',
    price: String(p.price),
    category: p.category,
    categoryOther: false,
    inventory: String(p.inventoryQuantity),
    imageUrl: p.imageUrl ?? '',
    rating: p.rating != null ? String(p.rating) : '',
    reviewCount: p.reviewCount != null ? String(p.reviewCount) : '',
    badge: p.badge && BADGE_OPTIONS.includes(p.badge) ? p.badge : 'N/A',
    inStock: p.inStock,
    imageFile: null,
  }
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [inventoryDraft, setInventoryDraft] = useState<Record<number, string>>({})
  const [savingId, setSavingId] = useState<number | null>(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newInventory, setNewInventory] = useState('100')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newRating, setNewRating] = useState('4.5')
  const [newReviewCount, setNewReviewCount] = useState('0')
  const [newBadge, setNewBadge] = useState('N/A')
  const [newInStock, setNewInStock] = useState(true)
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [creating, setCreating] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [categoryOther, setCategoryOther] = useState(false)

  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  type SortKey = 'id' | 'name' | 'category' | 'price' | 'inventoryQuantity' | 'rating' | 'badge'
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [sortAsc, setSortAsc] = useState(true)

  const sortedProducts = [...products].sort((a, b) => {
    const av = a[sortKey] ?? ''
    const bv = b[sortKey] ?? ''
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortAsc ? cmp : -cmp
  })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v)
    else { setSortKey(key); setSortAsc(true) }
  }

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

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

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setError(null)
    try {
      await adminApi.deleteProduct(deleteTarget.id)
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setMessage(`Product "${deleteTarget.name}" deleted`)
      setDeleteTarget(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

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

  const openEdit = (p: AdminProduct) => {
    setEditProduct(p)
    setEditDraft(draftFromProduct(p))
  }

  const closeEdit = () => {
    setEditProduct(null)
    setEditDraft(null)
  }

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editProduct || !editDraft) return
    const price = parseFloat(editDraft.price)
    if (!editDraft.name.trim() || !editDraft.category.trim() || Number.isNaN(price)) {
      setError('Name, category, and valid price are required')
      return
    }
    setSaving(true)
    setError(null)
    const form = new FormData()
    form.append('name', editDraft.name.trim())
    form.append('description', editDraft.description)
    form.append('price', String(price))
    form.append('category', editDraft.category.trim())
    form.append('inventory', String(parseInt(editDraft.inventory, 10) || 0))
    if (editDraft.imageUrl.trim()) form.append('imageUrl', editDraft.imageUrl.trim())
    const r = parseFloat(editDraft.rating)
    if (!Number.isNaN(r)) form.append('rating', String(r))
    const rc = parseInt(editDraft.reviewCount, 10)
    if (!Number.isNaN(rc)) form.append('reviewCount', String(rc))
    if (editDraft.badge && editDraft.badge !== 'N/A') form.append('badge', editDraft.badge)
    form.append('inStock', String(editDraft.inStock))
    if (editDraft.imageFile) form.append('image', editDraft.imageFile)
    try {
      const updated = await adminApi.updateProduct(editProduct.id, form)
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setInventoryDraft((d) => ({ ...d, [updated.id]: String(updated.inventoryQuantity) }))
      setMessage(`Product #${updated.id} updated`)
      closeEdit()
      fetchCategories().then(setCategories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
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
    if (newBadge && newBadge !== 'N/A') form.append('badge', newBadge)
    form.append('inStock', String(newInStock))
    if (newImageFile) form.append('image', newImageFile)

    try {
      await adminApi.createProduct(form)
      setMessage('Product created')
      setNewName('')
      setNewDesc('')
      setNewPrice('')
      setNewCategory('')
      setCategoryOther(false)
      setNewInventory('100')
      setNewImageUrl('')
      setNewRating('4.5')
      setNewReviewCount('0')
      setNewBadge('N/A')
      setNewInStock(true)
      setNewImageFile(null)
      setShowAddModal(false)
      await load()
      fetchCategories().then(setCategories)
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

      <div style={{ marginBottom: '1.25rem' }}>
        <Btn type="button" onClick={() => setShowAddModal(true)}>+ Add product</Btn>
      </div>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th></th>
              <SortTh $active={sortKey === 'id'} $asc={sortAsc} onClick={() => toggleSort('id')}>ID</SortTh>
              <SortTh $active={sortKey === 'name'} $asc={sortAsc} onClick={() => toggleSort('name')}>Name</SortTh>
              <SortTh $active={sortKey === 'category'} $asc={sortAsc} onClick={() => toggleSort('category')}>Category</SortTh>
              <SortTh $active={sortKey === 'price'} $asc={sortAsc} onClick={() => toggleSort('price')}>Price</SortTh>
              <SortTh $active={sortKey === 'inventoryQuantity'} $asc={sortAsc} onClick={() => toggleSort('inventoryQuantity')}>Inventory</SortTh>
              <SortTh $active={sortKey === 'rating'} $asc={sortAsc} onClick={() => toggleSort('rating')}>Rating</SortTh>
              <SortTh $active={sortKey === 'badge'} $asc={sortAsc} onClick={() => toggleSort('badge')}>Badge</SortTh>
              <th>Image</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((p) => (
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
                <td>{p.rating ?? '—'}</td>
                <td>{p.badge ?? '—'}</td>
                <td>
                  {p.imageUrl ? (
                    <ThumbWrap data-tooltip="Click to enlarge" onClick={() => setLightboxSrc(p.imageUrl!)}>
                      <Thumb src={p.imageUrl} alt={p.name} />
                    </ThumbWrap>
                  ) : (
                    <span style={{ color: '#9ca3af' }}>—</span>
                  )}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <IconBtn type="button" data-tooltip="Edit product" onClick={() => openEdit(p)}>✏️</IconBtn>
                  <IconBtn type="button" data-tooltip="Delete product" style={{ color: '#dc2626' }} onClick={() => setDeleteTarget(p)}>🗑️</IconBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete product"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.` : ''}
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {showAddModal && (
        <ModalOverlay onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false) }}>
          <ModalBox>
            <ModalTitle>Add product</ModalTitle>
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
                  <select
                    value={categoryOther ? '__other__' : newCategory}
                    onChange={(e) => {
                      if (e.target.value === '__other__') {
                        setCategoryOther(true)
                        setNewCategory('')
                      } else {
                        setCategoryOther(false)
                        setNewCategory(e.target.value)
                      }
                    }}
                    required={!categoryOther}
                  >
                    <option value="">— select —</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="__other__">Other…</option>
                  </select>
                  {categoryOther && (
                    <input
                      style={{ marginTop: '0.4rem' }}
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category name"
                      required
                      autoFocus
                    />
                  )}
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
                  <select value={newBadge} onChange={(e) => setNewBadge(e.target.value)}>
                    {BADGE_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
                <Field style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={newInStock} onChange={(e) => setNewInStock(e.target.checked)} />
                  <span style={{ fontWeight: 400 }}>In stock flag</span>
                </Field>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Btn type="submit" disabled={creating}>{creating ? 'Creating…' : 'Create product'}</Btn>
                  <Btn type="button" style={{ background: 'transparent', color: '#6b7280', border: '1px solid #d1d5db' }} onClick={() => setShowAddModal(false)}>Cancel</Btn>
                </div>
              </FormGrid>
            </form>
          </ModalBox>
        </ModalOverlay>
      )}

      {lightboxSrc && (
        <LightboxOverlay onClick={() => setLightboxSrc(null)}>
          <LightboxImg src={lightboxSrc} alt="Product preview" onClick={(e) => e.stopPropagation()} />
        </LightboxOverlay>
      )}

      {editProduct && editDraft && (
        <ModalOverlay onClick={(e) => { if (e.target === e.currentTarget) closeEdit() }}>
          <ModalBox>
            <ModalTitle>Edit product #{editProduct.id}</ModalTitle>
            <form onSubmit={saveEdit}>
              <FormGrid>
                <Field>
                  Name *
                  <input value={editDraft.name} onChange={(e) => setEditDraft((d) => d && { ...d, name: e.target.value })} required />
                </Field>
                <Field>
                  Description
                  <textarea value={editDraft.description} onChange={(e) => setEditDraft((d) => d && { ...d, description: e.target.value })} />
                </Field>
                <Field>
                  Price *
                  <input type="number" step="0.01" min="0" value={editDraft.price} onChange={(e) => setEditDraft((d) => d && { ...d, price: e.target.value })} required />
                </Field>
                <Field>
                  Category *
                  <select
                    value={editDraft.categoryOther ? '__other__' : editDraft.category}
                    onChange={(e) => {
                      if (e.target.value === '__other__') {
                        setEditDraft((d) => d && { ...d, categoryOther: true, category: '' })
                      } else {
                        setEditDraft((d) => d && { ...d, categoryOther: false, category: e.target.value })
                      }
                    }}
                    required={!editDraft.categoryOther}
                  >
                    <option value="">— select —</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="__other__">Other…</option>
                  </select>
                  {editDraft.categoryOther && (
                    <input
                      style={{ marginTop: '0.4rem' }}
                      value={editDraft.category}
                      onChange={(e) => setEditDraft((d) => d && { ...d, category: e.target.value })}
                      placeholder="New category name"
                      required
                      autoFocus
                    />
                  )}
                </Field>
                <Field>
                  Inventory
                  <input type="number" min="0" value={editDraft.inventory} onChange={(e) => setEditDraft((d) => d && { ...d, inventory: e.target.value })} />
                </Field>
                <Field>
                  Image URL
                  <input value={editDraft.imageUrl} onChange={(e) => setEditDraft((d) => d && { ...d, imageUrl: e.target.value })} placeholder="https://..." />
                </Field>
                <Field>
                  Replace image (upload new file)
                  <input type="file" accept="image/*" onChange={(e) => setEditDraft((d) => d && { ...d, imageFile: e.target.files?.[0] ?? null })} />
                </Field>
                <Field>
                  Rating
                  <input type="number" step="0.1" value={editDraft.rating} onChange={(e) => setEditDraft((d) => d && { ...d, rating: e.target.value })} />
                </Field>
                <Field>
                  Review count
                  <input type="number" min="0" value={editDraft.reviewCount} onChange={(e) => setEditDraft((d) => d && { ...d, reviewCount: e.target.value })} />
                </Field>
                <Field>
                  Badge
                  <select value={editDraft.badge} onChange={(e) => setEditDraft((d) => d && { ...d, badge: e.target.value })}>
                    {BADGE_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
                <Field style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={editDraft.inStock} onChange={(e) => setEditDraft((d) => d && { ...d, inStock: e.target.checked })} />
                  <span style={{ fontWeight: 400 }}>In stock flag</span>
                </Field>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Btn type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Btn>
                  <Btn type="button" style={{ background: 'transparent', color: '#6b7280', border: '1px solid #d1d5db' }} onClick={closeEdit}>Cancel</Btn>
                </div>
              </FormGrid>
            </form>
          </ModalBox>
        </ModalOverlay>
      )}
    </>
  )
}
