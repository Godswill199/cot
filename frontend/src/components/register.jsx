import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { GoogleLogin } from '@react-oauth/google';
import api from './utils/axiosConfig';
import { useAuth } from './context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: new Date(),
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userLogin } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      newErrors.dateOfBirth = 'You must be at least 18 years old';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const { confirmPassword, ...dataToSend } = formData;

    try {
      const response = await api.post('/register', dataToSend);
      await userLogin(response.data);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await api.post('/google-signup', {
        credential: credentialResponse.credential
      });
      await userLogin(response.data);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        general: 'Google sign-up failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    setErrors({
      general: 'Google sign-up failed. Please try again.'
    });
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#282828] py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.general && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
              {errors.general}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-400">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className={`mt-1 block w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-[#ffc107]`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-400">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className={`mt-1 block w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-[#ffc107]`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`mt-1 block w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-[#ffc107]`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`block w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border ${
                    errors.password ? 'border-red-500' : 'border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-[#ffc107]`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className={`block w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-[#ffc107]`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-400">
                Phone Number
              </label>
              <div className="mt-1">
                <PhoneInput
                  country={'us'}
                  value={formData.phoneNumber}
                  onChange={phone => setFormData(prevState => ({ ...prevState, phoneNumber: phone }))}
                  containerClass="!w-full"
                  inputClass={`!w-full !h-[42px] !bg-[#2a2a2a] !text-white !border ${
                    errors.phoneNumber ? '!border-red-500' : '!border-gray-600'
                  } focus:!ring-2 focus:!ring-[#ffc107] !rounded-md`}
                  buttonClass="!bg-[#2a2a2a] !border-gray-600 !border-r-0"
                  dropdownClass="!bg-[#2a2a2a] !text-white"
                  searchClass="!bg-[#2a2a2a] !text-white"
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-400">
                Date of Birth
              </label>
              <DatePicker
                selected={formData.dateOfBirth}
                onChange={date => setFormData(prevState => ({ ...prevState, dateOfBirth: date }))}
                className={`mt-1 block w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-white border ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-[#ffc107]`}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                className={`h-4 w-4 text-[#ffc107] border-gray-600 rounded focus:ring-[#ffc107] ${
                  errors.agreeTerms ? 'border-red-500' : ''
                }`}
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-400">
                I agree to the terms and conditions
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="mt-1 text-sm text-red-500">{errors.agreeTerms}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#ffc107] hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Registering...
                  </span>
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              disabled={isLoading}
            />
          </div>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-yellow-400 hover:text-yellow-500"
              tabIndex={isLoading ? -1 : 0}
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;