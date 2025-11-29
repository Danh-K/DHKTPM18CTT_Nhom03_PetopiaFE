"use client";

import { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaDribbble,
  FaMapMarkerAlt,
  FaBriefcase,
  FaPencilAlt,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const Profile = () => {
  const [showEditPhoto, setShowEditPhoto] = useState(false);
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(
    "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png"
  );
  const [formData, setFormData] = useState({
    fullName: "Joseph McFall",
    biography:
      "I am Joseph McFall, a fervent explorer navigating the intricate landscapes of web design...",
    social: {
      linkedin: "https://linkedin.com/in/josephmcfall",
      instagram: "https://instagram.com/josephmcfall",
      facebook: "https://facebook.com/josephmcfall",
    },
    email: "helene@company.com",
    address: "California, United States of America",
    homeAddress: "92 Miles Drive, Newark, NJ 07103",
    phone: "+1234 567 890 / +12 345 678",
    skill: "InVision, Sketch, Figma, HTML5, Adobe XD",
    language: "English, French, Spanish",
    timezone: "UTC+07:00 - Vietnam",
    languageProfile: "English",
    dateOfBirth: "",
    gender: "Male",
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [name]: value,
      },
    }));
  };

  const handleSavePhoto = () => {
    setShowEditPhoto(false);
    alert("Profile photo updated successfully!");
  };

  const handleSaveInfo = () => {
    setShowEditInfo(false);
    alert("Personal information updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information</p>
        </div>

        {/* Top Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Profile Picture + Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="relative group">
                <img
                  src={profilePhoto || "/placeholder.svg"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => setShowEditPhoto(true)}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                >
                  <FaPencilAlt className="text-sm" />
                </button>
              </div>
              <div className="ml-6">
                <span className="inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full mb-2 shadow-md">
                  PRO
                </span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {formData.fullName}
                </h2>
                <p className="text-gray-600 mt-1">Frontend Developer</p>
              </div>
            </div>
          </div>

          {/* Quick Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option>UTC-08:00 - Pacific Standard Time</option>
                  <option>UTC+07:00 - Vietnam</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Language
                </label>
                <select
                  name="languageProfile"
                  value={formData.languageProfile}
                  onChange={handleInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option>English</option>
                  <option>Vietnamese</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleSaveInfo}
                className="relative px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FaSave /> Save Changes
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Personal Information
            </h3>
            <button
              onClick={() => setShowEditInfo(true)}
              className="relative px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <MdEdit /> Edit
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="font-semibold text-gray-900 mb-1">Full Name</p>
                <p className="text-gray-700">{formData.fullName}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="font-semibold text-gray-900 mb-1">Biography</p>
                <p className="text-gray-700">{formData.biography}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="font-semibold text-gray-900 mb-2">Social Media</p>
                <div className="flex gap-3 text-xl">
                  <a
                    href={formData.social.facebook}
                    className="text-blue-600 hover:text-blue-700 transition-colors duration-300 hover:scale-110 transform"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href={formData.social.instagram}
                    className="text-pink-500 hover:text-pink-600 transition-colors duration-300 hover:scale-110 transform"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="#"
                    className="text-red-500 hover:text-red-600 transition-colors duration-300 hover:scale-110 transform"
                  >
                    <FaDribbble />
                  </a>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="font-semibold text-gray-900 mb-1">
                  <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
                  Location
                </p>
                <p className="text-gray-700">{formData.address}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="font-semibold text-gray-900 mb-1">
                  <FaBriefcase className="inline mr-2 text-blue-600" />
                  Position
                </p>
                <p className="text-gray-700">Frontend Developer</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="font-semibold text-gray-900 mb-1">
                  Email Address
                </p>
                <p className="text-gray-700">{formData.email}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="font-semibold text-gray-900 mb-1">Home Address</p>
                <p className="text-gray-700">{formData.homeAddress}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="font-semibold text-gray-900 mb-1">Phone Number</p>
                <p className="text-gray-700">{formData.phone}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="font-semibold text-gray-900 mb-1">
                  Software Skills
                </p>
                <p className="text-gray-700">{formData.skill}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="font-semibold text-gray-900 mb-1">Languages</p>
                <p className="text-gray-700">{formData.language}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Photo Modal */}
      {showEditPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slideUp">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Profile Photo
              </h3>
              <button
                onClick={() => setShowEditPhoto(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Upload New Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <div className="mt-6 text-center">
                <img
                  src={profilePhoto || "/placeholder.svg"}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-500 shadow-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditPhoto(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                <FaTimes className="inline mr-2" /> Cancel
              </button>
              <button
                onClick={handleSavePhoto}
                className="relative px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium overflow-hidden group"
              >
                <span className="relative z-10">Save Changes</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Info Modal */}
      {showEditInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 animate-slideUp">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Personal Information
              </h3>
              <button
                onClick={() => setShowEditInfo(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Home Address
                  </label>
                  <input
                    type="text"
                    name="homeAddress"
                    value={formData.homeAddress}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Skills
                  </label>
                  <input
                    type="text"
                    name="skill"
                    value={formData.skill}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Languages
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <input
                    type="text"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Language Profile
                  </label>
                  <input
                    type="text"
                    name="languageProfile"
                    value={formData.languageProfile}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Biography
                  </label>
                  <textarea
                    rows={3}
                    name="biography"
                    value={formData.biography}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.social.linkedin}
                    onChange={handleSocialChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.social.instagram}
                    onChange={handleSocialChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Facebook
                  </label>
                  <input
                    type="text"
                    name="facebook"
                    value={formData.social.facebook}
                    onChange={handleSocialChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditInfo(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                <FaTimes className="inline mr-2" /> Cancel
              </button>
              <button
                onClick={handleSaveInfo}
                className="relative px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium overflow-hidden group"
              >
                <span className="relative z-10">Save Changes</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Profile;
