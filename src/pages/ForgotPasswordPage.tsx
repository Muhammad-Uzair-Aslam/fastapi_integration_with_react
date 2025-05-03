import { useState } from 'react';
import { sendForgotPasswordEmail } from '../api';
import { ApiError } from '../types';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ForgotPasswordPage: Form submitted', { email });
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await sendForgotPasswordEmail(email);
      console.log('ForgotPasswordPage: Forgot password request successful', {
        message: response.message,
        reset_link: response.reset_link,
      });
      setMessage(response.message);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.response?.data.detail || 'Failed to send email';
      console.error('ForgotPasswordPage: Forgot password error', {
        error: errorMessage,
        status: apiError.response?.status,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('ForgotPasswordPage: Request completed', { loading: false });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        {error && (
          <div className="p-4 mb-4 rounded-md bg-red-100 text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="p-4 mb-4 rounded-md bg-green-100 text-green-700">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;