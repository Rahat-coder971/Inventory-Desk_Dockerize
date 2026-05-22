import { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Edit3,
  Loader2,
  PackagePlus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from './api/products.js';

const emptyForm = {
  name: '',
  sku: '',
  category: '',
  price: '',
  quantity: '',
  status: 'active',
  description: '',
};

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value || 0));
}

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const stats = useMemo(() => {
    const totalValue = products.reduce(
      (sum, product) => sum + Number(product.price) * Number(product.quantity),
      0,
    );
    const activeCount = products.filter((product) => product.status === 'active').length;
    const lowStock = products.filter((product) => Number(product.quantity) <= 5).length;

    return { totalValue, activeCount, lowStock };
  }, [products]);

  async function loadProducts() {
    setLoading(true);
    setError('');

    try {
      const data = await getProducts({ search, status: statusFilter });
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(loadProducts, 250);
    return () => clearTimeout(timeout);
  }, [search, statusFilter]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  }

  function editProduct(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      status: product.status,
      description: product.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');

    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setNotice('Product updated successfully.');
      } else {
        await createProduct(payload);
        setNotice('Product created successfully.');
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(`Delete ${product.name}?`);
    if (!confirmed) {
      return;
    }

    setError('');
    setNotice('');

    try {
      await deleteProduct(product._id);
      setNotice('Product deleted.');
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app-shell">
      <section className="topbar">
        <div className="brand-block">
          <div className="brand-mark">
            <Boxes size={24} />
          </div>
          <div>
            <h1>Inventory updatededdddd</h1>
            <p>Product catalog and stock controlsssssssss</p>
          </div>
        </div>
        <button className="refresh-button" onClick={loadProducts} title="Refresh products">
          <RefreshCw size={18} />
          Refresh
        </button>
      </section>

      <section className="stats-grid" aria-label="Inventory summary">
        <div className="metric">
          <Boxes size={22} />
          <span>Total Items</span>
          <strong>{products.length}</strong>
        </div>
        <div className="metric">
          <CheckCircle2 size={22} />
          <span>Active</span>
          <strong>{stats.activeCount}</strong>
        </div>
        <div className="metric">
          <Archive size={22} />
          <span>Low Stock</span>
          <strong>{stats.lowStock}</strong>
        </div>
        <div className="metric">
          <ClipboardList size={22} />
          <span>Value</span>
          <strong>{formatCurrency(stats.totalValue)}</strong>
        </div>
      </section>

      <section className="workspace-grid">
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="section-title">
            <PackagePlus size={20} />
            <div>
              <h2>{editingId ? 'Edit Product' : 'New Product'}</h2>
              <p>{editingId ? 'Update the selected catalog item' : 'Add an item to inventory'}</p>
            </div>
          </div>

          <label>
            Product name
            <input name="name" value={form.name} onChange={updateField} required minLength="2" />
          </label>

          <div className="two-col">
            <label>
              SKU
              <input name="sku" value={form.sku} onChange={updateField} required />
            </label>
            <label>
              Category
              <input name="category" value={form.category} onChange={updateField} required />
            </label>
          </div>

          <div className="two-col">
            <label>
              Price
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={updateField}
                min="0"
                step="0.01"
                required
              />
            </label>
            <label>
              Quantity
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={updateField}
                min="0"
                required
              />
            </label>
          </div>

          <label>
            Status
            <select name="status" value={form.status} onChange={updateField}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              rows="4"
            />
          </label>

          {error ? <p className="alert error">{error}</p> : null}
          {notice ? <p className="alert success">{notice}</p> : null}

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? <Loader2 className="spin" size={18} /> : <PackagePlus size={18} />}
              {editingId ? 'Save Changes' : 'Create Product'}
            </button>
            {editingId ? (
              <button className="ghost-button" type="button" onClick={resetForm}>
                <X size={18} />
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <section className="product-list">
          <div className="list-toolbar">
            <div className="list-heading">
              <h2>Products</h2>
              <p>{products.length} records loaded</p>
            </div>
            <div className="toolbar-controls">
              <div className="search-box">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, SKU, category"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All statuses</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <Loader2 className="spin" size={24} />
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <Boxes size={28} />
              <p>No products found.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <strong>{product.name}</strong>
                        <span>{product.description || 'No description'}</span>
                      </td>
                      <td>{product.sku}</td>
                      <td>{product.category}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <span className={`status ${product.status}`}>{product.status}</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="icon-button"
                            onClick={() => editProduct(product)}
                            title="Edit product"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            className="icon-button danger"
                            onClick={() => handleDelete(product)}
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
