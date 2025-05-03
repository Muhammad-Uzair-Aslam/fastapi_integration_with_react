import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { ApiError } from '../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('LoginPage: Form submitted', { email, password: '****' });
    setLoading(true);
    setError('');

    // Clear any existing token to avoid sending it in /login request
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    console.log('LoginPage: Cleared token and userData from localStorage');

    try {
      const response = await loginUser(email, password);
      console.log('LoginPage: Login successful, storing token', { token: response.data.access_token });
      localStorage.setItem('token', response.data.access_token);

      // Map API response to the expected UserData structure
      const userData = {
        name: response.data.user?.extra_fields?.fullName || 'Unknown',
        email: email,
        cnic: response.data.user?.extra_fields?.idCardNumber  ,
        education: response.data.user?.extra_fields?.education ,
        rankTitle: response.data.user?.extra_fields?.rankTitle,
        jobType: response.data.user?.extra_fields?.jobType ,
        joiningDate: response.data.user?.extra_fields?.joiningDate ,
        birthDate: response.data.user?.extra_fields?.DateOfBirth ,
        mobile: response.data.user?.extra_fields?.phoneNumber,
        address: response.data.user?.extra_fields?.address,
        gender: response.data.user?.extra_fields?.gender,
        experience: response.data.user?.extra_fields?.experience,
        bankName: response.data.user?.extra_fields?.accountName ,
        accountHolderName: response.data.user?.extra_fields?.accountHolderName || '-',
        branchCode: response.data.user?.extra_fields?.branchCode || '-',
        accountNumber: response.data.user?.extra_fields?.accountNumber || '-',
        ibanNumber: response.data.user?.extra_fields?.ibanNumber || '-',
        accountType: response.data.user?.extra_fields?.accountType || '-',
        linkedin: response.data.user?.extra_fields?.linkedIn ,
        facebook: response.data.user?.extra_fields?.facebook ,
        github: response.data.user?.extra_fields?.github ,
        skype: response.data.user?.extra_fields?.skype ,
        imageUrl: response.data.user?.extra_fields?.profilephoto,
      };

      console.log('LoginPage: Storing userData in localStorage', userData);
      localStorage.setItem('userData', JSON.stringify(userData));

      console.log('LoginPage: Navigating to /home with replace');
      navigate('/home', { replace: true });
    } catch (err) {
      const apiError = err as ApiError | Error;
      if (apiError instanceof Error && apiError.message === 'Invalid login response') {
        console.error('LoginPage: Invalid response from server', { error: apiError.message });
        setError('Server returned invalid response. Please try again.');
      } else if ((apiError as ApiError).response?.data.detail?.includes('Please change your password')) {
        console.log('LoginPage: Temp password detected, navigating to /reset-password');
        navigate('/reset-password');
      } else {
        const errorMessage = (apiError as ApiError).response?.data.detail || 'Login failed';
        console.error('LoginPage: Login error', { error: errorMessage, status: (apiError as ApiError).response?.status });
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      console.log('LoginPage: Login attempt completed', { loading: false });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && (
          <div className="p-4 mb-4 rounded-md bg-red-100 text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;