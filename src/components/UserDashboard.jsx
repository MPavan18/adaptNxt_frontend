import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//const API_URL = 'http://localhost:8000/api';
const API_URL = 'https://adaptnxt-backend-nag1.onrender.com/api';

function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        setError(data.message || 'Error loading products');
      }
    } catch (error) {
      setError('Error loading products');
      console.error('Fetch products error:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in');
        navigate('/');
        return;
      }
      console.log('Fetching cart with token:', token); // Debug
      const response = await fetch(`${API_URL}/cart`, {
        headers: { 'token': token },
      });
      const data = await response.json();
      console.log('Cart response:', data); // Debug
      if (response.ok) {
        // Add quantity to each cart item
        setCart(data.cart ? data.cart.map(item => ({ product: item, quantity: 1 })) : []);
      } else {
        setError(data.message || 'Error loading cart');
        if (response.status === 401) {
          setError('Session expired, please log in again');
          logout();
        }
      }
    } catch (error) {
      setError('Server error while fetching cart');
      console.error('Fetch cart error:', error);
      setCart([]);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in');
        navigate('/');
        return;
      }
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchCart();
      } else {
        setError(data.message || 'Error adding to cart');
        if (response.status === 401) {
          setError('Session expired, please log in again');
          logout();
        }
      }
    } catch (error) {
      setError('Server error');
      console.error('Add to cart error:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in');
        navigate('/');
        return;
      }
      const response = await fetch(`${API_URL}/cart/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchCart();
      } else {
        setError(data.message || 'Error removing from cart');
        if (response.status === 401) {
          setError('Session expired, please log in again');
          logout();
        }
      }
    } catch (error) {
      setError('Server error');
      console.error('Remove from cart error:', error);
    }
  };

  const handleOrder = () => {
    setShowOrderModal(true);
  };

  const handleIncrement = (productId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrement = (productId) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product._id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const closeModal = () => {
    setShowOrderModal(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchCart();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">User Dashboard</h1>
      <button className="btn btn-danger mb-3" onClick={logout}>
        Logout
      </button>
      <h2>Products (Created by Admins)</h2>
      <div className="row">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text"><strong>Price:</strong> ${product.price}</p>
                  <p className="card-text"><strong>Created by:</strong> {product.createdBy?.email || 'Unknown Admin'}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(product._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <h2 className="mt-4">Your Cart</h2>
      <div className="row">
        {cart && cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart && cart.map((item) => (
            <div key={item.product._id} className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{item.product.name}</h5>
                  <p className="card-text">{item.product.description}</p>
                  <p className="card-text"><strong>Price:</strong> ${item.product.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <button
        className="btn btn-success mt-3"
        onClick={handleOrder}
        disabled={cart.length === 0}
      >
        Place Order
      </button>
      {showOrderModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Successful</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>Your order has been placed successfully!</p>
                <h6>Ordered Items:</h6>
                {cart.length === 0 ? (
                  <p>No items in your order.</p>
                ) : (
                  <ul className="list-group">
                    {cart.map((item) => (
                      <li key={item.product._id} className="list-group-item">
                        <div>
                          <strong>{item.product.name}</strong>
                          <p>{item.product.description}</p>
                          <p><strong>Price:</strong> ${item.product.price}</p>
                          <p><strong>Quantity:</strong> {item.quantity}</p>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleIncrement(item.product._id)}
                          >
                            +
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDecrement(item.product._id)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
}

export default UserDashboard;
