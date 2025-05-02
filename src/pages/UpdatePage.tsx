import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  maritalStatus: string;
  nationality: string;
  dualNational: string;
  countryOfBirth: string;
  cityOfBirth: string;
  countryOfResidence: string;
  customerVisuallyImpaired: string;
  nicIssueDate: string;
  nicExpiryDate: string;
  motherMaidenName: string;
  husbandName: string;
  citizenTaxResidenceOtherThanPakistan: string;
  pep: string;
  permanentCity: string;
  typeOfAddress: string;
  nextOfKinName: string;
  nextOfKinRelation: string;
  nextOfKinPhoneNumber: string;
}

const UpdatePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log(
          "UpdatePage: Loaded userData from localStorage",
          parsedData
        );
        setUserData(parsedData);
        setFormData(parsedData);
      } catch (err) {
        console.error(
          "UpdatePage: Failed to parse userData from localStorage",
          err
        );
        setError("Failed to load user data. Please try again.");
      }
    } else {
      console.log("UpdatePage: No userData found in localStorage");
      setError("No user data found. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      // Upload photo if a new one is selected
      if (photoFile) {
        const photoFormData = new FormData();
        photoFormData.append("file", photoFile);
        const photoResponse = await axios.post(
          "http://localhost:8000/auth/user/upload-photo",
          photoFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(
          "UpdatePage: Photo uploaded successfully",
          photoResponse.data
        );
        if (formData) {
          formData.imageUrl = photoResponse.data.profilephoto;
        }
      }

      // Map formData to API expected field names
      const updateData = {
        fullName: formData.name,
        DateOfBirth: formData.birthDate,
        maritalStatus: formData.maritalStatus || "",
        education: formData.education,
        phoneNumber: formData.mobile,
        address: formData.address,
        accountName: formData.bankName,
        accountHolderName: formData.accountHolderName,
        accountBranchCode: formData.branchCode,
        accountNumber: formData.accountNumber,
        accountIbn: formData.ibanNumber,
        accountType: formData.accountType,
        nationality: formData.nationality || "",
        dualNational: formData.dualNational || "",
        countryOfBirth: formData.countryOfBirth || "",
        cityOfBirth: formData.cityOfBirth || "",
        countryOfResidence: formData.countryOfResidence || "",
        customerVisuallyImpaired: formData.customerVisuallyImpaired || "",
        nicIssueDate: formData.nicIssueDate || "",
        nicExpiryDate: formData.nicExpiryDate || "",
        motherMaidenName: formData.motherMaidenName || "",
        husbandName: formData.husbandName || "",
        citizenTaxResidenceOtherThanPakistan:
          formData.citizenTaxResidenceOtherThanPakistan || "",
        pep: formData.pep || "",
        permanentCity: formData.permanentCity || "",
        typeOfAddress: formData.typeOfAddress || "",
        nextOfKinName: formData.nextOfKinName || "",
        nextOfKinRelation: formData.nextOfKinRelation || "",
        nextOfKinPhoneNumber: formData.nextOfKinPhoneNumber || "",
        facebook: formData.facebook,
        linkedIn: formData.linkedin,
        skype: formData.skype,
        github: formData.github,
      };

      const response = await axios.put(
        "http://localhost:8000/auth/user",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("UpdatePage: User data updated successfully", response.data);

      // Update localStorage with new user data
      const updatedUserData = { ...formData };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      navigate("/home");
    } catch (err: any) {
      console.error("UpdatePage: Failed to update user data", err);
      setError(
        err.response?.data?.detail ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/home");
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

  if (!formData) {
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
        <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>
        {error && (
          <div className="p-4 mb-4 rounded-md bg-red-100 text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center space-x-4">
            <img
              src={formData.imageUrl || "https://via.placeholder.com/128"}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Change Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CNIC
              </label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Education
              </label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rank Title
              </label>
              <input
                type="text"
                name="rankTitle"
                value={formData.rankTitle}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Type
              </label>
              <input
                type="text"
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Joining Date
              </label>
              <input
                type="text"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="text"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Experience
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Holder Name
              </label>
              <input
                type="text"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Branch Code
              </label>
              <input
                type="text"
                name="branchCode"
                value={formData.branchCode}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                IBAN Number
              </label>
              <input
                type="text"
                name="ibanNumber"
                value={formData.ibanNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <input
                type="text"
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Facebook
              </label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                GitHub
              </label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skype
              </label>
              <input
                type="text"
                name="skype"
                value={formData.skype}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Marital Status
              </label>
              <input
                type="text"
                name="maritalStatus"
                value={formData.maritalStatus || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dual National
              </label>
              <input
                type="text"
                name="dualNational"
                value={formData.dualNational || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country of Birth
              </label>
              <input
                type="text"
                name="countryOfBirth"
                value={formData.countryOfBirth || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City of Birth
              </label>
              <input
                type="text"
                name="cityOfBirth"
                value={formData.cityOfBirth || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country of Residence
              </label>
              <input
                type="text"
                name="countryOfResidence"
                value={formData.countryOfResidence || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Visually Impaired
              </label>
              <input
                type="text"
                name="customerVisuallyImpaired"
                value={formData.customerVisuallyImpaired || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                NIC Issue Date
              </label>
              <input
                type="text"
                name="nicIssueDate"
                value={formData.nicIssueDate || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                NIC Expiry Date
              </label>
              <input
                type="text"
                name="nicExpiryDate"
                value={formData.nicExpiryDate || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mother's Maiden Name
              </label>
              <input
                type="text"
                name="motherMaidenName"
                value={formData.motherMaidenName || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Husband's Name
              </label>
              <input
                type="text"
                name="husbandName"
                value={formData.husbandName || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax Residence Other Than Pakistan
              </label>
              <input
                type="text"
                name="citizenTaxResidenceOtherThanPakistan"
                value={formData.citizenTaxResidenceOtherThanPakistan || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                PEP
              </label>
              <input
                type="text"
                name="pep"
                value={formData.pep || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Permanent City
              </label>
              <input
                type="text"
                name="permanentCity"
                value={formData.permanentCity || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type of Address
              </label>
              <input
                type="text"
                name="typeOfAddress"
                value={formData.typeOfAddress || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Next of Kin Name
              </label>
              <input
                type="text"
                name="nextOfKinName"
                value={formData.nextOfKinName || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Next of Kin Relation
              </label>
              <input
                type="text"
                name="nextOfKinRelation"
                value={formData.nextOfKinRelation || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Next of Kin Phone Number
              </label>
              <input
                type="text"
                name="nextOfKinPhoneNumber"
                value={formData.nextOfKinPhoneNumber || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`py-2 px-4 rounded-md text-white font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="py-2 px-4 rounded-md text-white font-semibold bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UpdatePage;
