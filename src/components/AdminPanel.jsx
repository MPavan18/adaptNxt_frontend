import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//const API_URL = 'http://localhost:8000/api';
const API_URL = 'https://adaptnxt-backend-nag1.onrender.com/api';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [updateProduct, setUpdateProduct] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products`, {
        headers: { 'token': token },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError('Error loading products');
      console.error('Fetch products error:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products/createProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({ name, price: parseFloat(price), description }),
      });
      const data = await response.json();

      if (response.ok) {
        setName('');
        setPrice('');
        setDescription('');
        fetchProducts();
      } else {
        setError(data.message || 'Error creating product');
      }
    } catch (error) {
      setError('Server error');
      console.error('Create product error:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products/${updateProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({
          name: updateProduct.name,
          price: parseFloat(updateProduct.price),
          description: updateProduct.description,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setUpdateProduct(null);
        fetchProducts();
      } else {
        setError(data.message || 'Error updating product');
      }
    } catch (error) {
      setError('Server error');
      console.error('Update product error:', error);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: { 'token': token },
      });
      const data = await response.json();

      if (response.ok) {
        fetchProducts();
      } else {
        setError(data.message || 'Error deleting product');
      }
    } catch (error) {
      setError('Server error');
      console.error('Delete product error:', error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token') || localStorage.getItem('role') !== 'admin') {
      navigate('/');
    }
    fetchProducts();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Panel</h1>
      <button className="btn btn-danger mb-3" onClick={logout}>
        Logout
      </button>
      <h2>Create Product</h2>
      <form onSubmit={handleCreate}>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="productName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="productPrice" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="productPrice"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="productDescription" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="productDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Product</button>
      </form>
      {updateProduct && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setUpdateProduct(null)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label htmlFor="updateName" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="updateName"
                      value={updateProduct.name}
                      onChange={(e) =>
                        setUpdateProduct({ ...updateProduct, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="updatePrice" className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      id="updatePrice"
                      value={updateProduct.price}
                      onChange={(e) =>
                        setUpdateProduct({ ...updateProduct, price: e.target.value })
                      }
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="updateDescription" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="updateDescription"
                      value={updateProduct.description}
                      onChange={(e) =>
                        setUpdateProduct({ ...updateProduct, description: e.target.value })
                      }
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Product</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <h2 className="mt-4">Manage Products</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text"><strong>Price:</strong> ${product.price}</p>
                <button
                  className="btn btn-warning"
                  onClick={() => setUpdateProduct(product)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
}

export default AdminPanel;