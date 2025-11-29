"use client";

import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaTimes, FaSave } from "react-icons/fa";

export default function EditUserForm({ show, onClose, user }) {
  const [showGeneral, setShowGeneral] = useState(true);
  const [showAdditional, setShowAdditional] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    avatar: null,
    firstName: "",
    lastName: "",
    email: "",
    userPermission: "Operational",
    jobTitle: "",
    language: "",
    accountType: "Choose account type",
    userRole: [],
    emailStatus: "Verified",
    status: false,
    currentPassword: "",
    password: "",
    confirmPassword: "",
    skill: "",
    phoneNumber: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    personalWebsite: "",
    country: "United States",
    timezone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        avatar: null,
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ")[1] || "",
        email: user.email || "",
        userPermission: "Operational",
        jobTitle: "Senior UX Designer",
        language: "",
        accountType: user.type || "Choose account type",
        userRole: [user.role || "Viewer"],
        emailStatus: "Verified",
        status: user.status === "Active",
        currentPassword: "",
        password: "",
        confirmPassword: "",
        skill: "",
        phoneNumber: "+1 (555) 123-4567",
        linkedin: "",
        facebook: "",
        instagram: "",
        personalWebsite: "",
        country: user.country || "United States",
        timezone: "",
        address: "123 Main St, New York, NY 10001",
      });
    }
  }, [user]);

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => {
        const updatedRoles = checked
          ? [...prev.userRole, value]
          : prev.userRole.filter((role) => role !== value);
        return { ...prev, userRole: updatedRoles };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("User updated successfully!");
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 animate-slideUp">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-xl font-semibold text-gray-900">
            Edit User: {user?.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[70vh] overflow-y-auto"
        >
          {/* General Information */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div
              className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
              onClick={() => setShowGeneral(!showGeneral)}
            >
              <span className="font-semibold text-gray-900">
                General Information
              </span>
              {showGeneral ? (
                <FaChevronUp className="text-blue-600" />
              ) : (
                <FaChevronDown className="text-blue-600" />
              )}
            </div>
            {showGeneral && (
              <div className="p-6 space-y-4 bg-white">
                {/* Avatar Upload */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Upload Avatar
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  {formData.avatar && (
                    <img
                      src={
                        URL.createObjectURL(formData.avatar) ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt="avatar"
                      className="mt-4 w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      User Permissions
                    </label>
                    <select
                      name="userPermission"
                      value={formData.userPermission}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option>Operational</option>
                      <option>Read-only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Job Title
                    </label>
                    <input
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="e.g React Native Developer"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Languages
                    </label>
                    <input
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      placeholder="e.g English, Vietnamese"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Account Type
                    </label>
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option>Choose account type</option>
                      <option>Default</option>
                      <option>Basic</option>
                      <option>Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Email Status
                    </label>
                    <select
                      name="emailStatus"
                      value={formData.emailStatus}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option>Verified</option>
                      <option>Not verified</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="status"
                        checked={formData.status}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: e.target.checked,
                          }))
                        }
                        className="sr-only"
                      />
                      <div
                        className={`block w-14 h-8 rounded-full transition-colors duration-300 ${
                          formData.status ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
                          formData.status ? "transform translate-x-6" : ""
                        }`}
                      ></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {formData.status ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Assign Role
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {["Administrator", "Member", "Viewer"].map((role) => (
                      <label
                        key={role}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name="userRole"
                          value={role}
                          checked={formData.userRole.includes(role)}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {role}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div
              className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="font-semibold text-gray-900">Đổi Mật Khẩu</span>
              {showPassword ? (
                <FaChevronUp className="text-blue-600" />
              ) : (
                <FaChevronDown className="text-blue-600" />
              )}
            </div>
            {showPassword && (
              <div className="p-6 space-y-4 bg-white">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Mật khẩu phải có ít nhất 8 ký tự,
                    bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div
              className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
              onClick={() => setShowAdditional(!showAdditional)}
            >
              <span className="font-semibold text-gray-900">
                Additional Information
              </span>
              {showAdditional ? (
                <FaChevronUp className="text-blue-600" />
              ) : (
                <FaChevronDown className="text-blue-600" />
              )}
            </div>
            {showAdditional && (
              <div className="p-6 space-y-4 bg-white">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Skills
                  </label>
                  <input
                    name="skill"
                    value={formData.skill}
                    onChange={handleChange}
                    placeholder="e.g Figma, HTML, JavaScript"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Add a phone number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      LinkedIn URL
                    </label>
                    <input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="LinkedIn URL"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Facebook
                    </label>
                    <input
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      placeholder="Facebook Profile"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Instagram
                    </label>
                    <input
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="Instagram Username"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Personal Website
                    </label>
                    <input
                      name="personalWebsite"
                      value={formData.personalWebsite}
                      onChange={handleChange}
                      placeholder="www.example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option>United States</option>
                      <option>Vietnam</option>
                      <option>Canada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Timezone
                    </label>
                    <input
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      placeholder="e.g GMT +7"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your location"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="relative px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <FaSave /> Save Changes
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
          </button>
        </div>
      </div>

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
}
