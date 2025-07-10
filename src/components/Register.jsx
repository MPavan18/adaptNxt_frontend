import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//const API_URL = 'http://localhost:8000/api';
const API_URL = 'https://adaptnxt-backend-nag1.onrender.com/api';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful! Please login.');
        setIsError(false);
      } else {
        setMessage(data.message || 'Registration failed');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Server error');
      setIsError(true);
      console.error('Register error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">AdaptNxt - Register</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="registerEmail" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="registerEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="registerPassword" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="registerPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => navigate('/')}
            >
              Back to Login
            </button>
          </form>
          {message && (
            <div className={isError ? 'text-danger mt-2' : 'text-success mt-2'}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;