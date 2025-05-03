import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  name: string;
  email: string;
  cnic: string;
  education: string;
  rankTitle: string;
  jobType: string;
  joiningDate: string;
  birthDate: string;
  mobile: string;
  address: string;
  gender: string;
  experience: string;
  bankName: string;
  accountHolderName: string;
  branchCode: string;
  accountNumber: string;
  ibanNumber: string;
  accountType: string;
  linkedin: string;
  facebook: string;
  github: string;
  skype: string;
  imageUrl?: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log('HomePage: Loaded userData from localStorage', parsedData);
        setUserData(parsedData);
      } catch (err) {
        console.error('HomePage: Failed to parse userData from localStorage', err);
        setError('Failed to load user data. Please log in again.');
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    } else {
      console.log('HomePage: No userData found in localStorage');
      setError('No user data found. Please log in again.');
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handlePopState = () => {
      console.log('HomePage: Back button pressed, redirecting to Google');
      window.location.replace('https://www.google.com');
    };

    window.addEventListener('popstate', handlePopState);
    console.log('HomePage: Added popstate listener');

    window.history.pushState(null, '', window.location.href);
    console.log('HomePage: Pushed extra history state');

    return () => {
      window.removeEventListener('popstate', handlePopState);
      console.log('HomePage: Removed popstate listener');
    };
  }, []);

  const handleLogout = () => {
    console.log('HomePage: Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login', { replace: true });
  };

  const handleEditProfile = () => {
    console.log('HomePage: Navigating to /update');
    navigate('/update');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <p className="text-red-700 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <p className="text-gray-700 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
          <div className="w-32 h-32">
            <img
              src={userData.imageUrl || 'https://via.placeholder.com/128'}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Name</strong></p>
                <p>{userData.name}</p>
              </div>
              <div>
                <p><strong>Rank Title</strong></p>
                <p>{userData.rankTitle}</p>
              </div>
              <div>
                <p><strong>Email</strong></p>
                <p>{userData.email}</p>
              </div>
              <div>
                <p><strong>Job Type</strong></p>
                <p>{userData.jobType}</p>
              </div>
              <div>
                <p><strong>CNIC</strong></p>
                <p>{userData.cnic}</p>
              </div>
              <div>
                <p><strong>Joining Date</strong></p>
                <p>{userData.joiningDate}</p>
              </div>
              <div>
                <p><strong>Education</strong></p>
                <p>{userData.education}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Information</h3>
            <div className="space-y-2">
              <p><strong>Birth Date</strong> {userData.birthDate}</p>
              <p><strong>Mobile</strong> {userData.mobile}</p>
              <p><strong>CNIC</strong> {userData.cnic}</p>
              <p><strong>Address</strong> {userData.address}</p>
              <p><strong>Gender</strong> {userData.gender}</p>
              <p><strong>Experience</strong> {userData.experience}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Bank Details</h3>
            <div className="space-y-2">
              <p><strong>Bank Name</strong> {userData.bankName}</p>
              <p><strong>Account Holder Name</strong> {userData.accountHolderName}</p>
              <p><strong>Branch Code</strong> {userData.branchCode}</p>
              <p><strong>Account Number</strong> {userData.accountNumber}</p>
              <p><strong>IBAN Number</strong> {userData.ibanNumber}</p>
              <p><strong>Account Type</strong> {userData.accountType}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Social Links</h3>
          <div className="space-y-2">
            <p><strong>LinkedIn</strong> <a href={userData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{userData.linkedin}</a></p>
            <p><strong>Facebook</strong> <a href={userData.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{userData.facebook}</a></p>
            <p><strong>Skype</strong> <a href={userData.skype} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{userData.skype}</a></p>
            <p><strong>GitHub</strong> <a href={userData.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{userData.github}</a></p>
          </div>
        </div>

        <div className="mt-6 text-center flex justify-center space-x-4">
          <button
            onClick={handleEditProfile}
            className="text-blue-600 hover:underline"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-blue-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;