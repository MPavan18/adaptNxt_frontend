import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//const API_URL = 'http://localhost:8000/api';
const API_URL = 'https://adaptnxt-backend-nag1.onrender.com/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('Login response:', data); // Debug

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role || 'user'); // Fallback to 'user'
        if (data.role === 'admin') {
          navigate('/admin-panel');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Server error');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">AdaptNxt - Login</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="loginEmail" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="loginEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="loginPassword" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="loginPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </form>
          {error && <div className="text-danger mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;