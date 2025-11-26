"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import BỘ ICON MỚI (Lucide)
import {
  Star,
  Sun,
  Pin,
  MessageSquare,
  Search,
  ChevronDown,
  Heart,
  Trash2,
  FilePenLine,
  Reply,
  X,
} from "lucide-react";

// Import dữ liệu giả (đảm bảo đúng đường dẫn)
import { fakePets, fakeReviews, fakeReplies } from "../../data/fakeData";

// ===================================================================
// Định nghĩa hiệu ứng cho Modal
// ===================================================================
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.9, y: -50, transition: { duration: 0.2 } },
};

// ===================================================================
// Component Thẻ Thống Kê (StatsCard) - ĐÃ LÀM LẠI ĐƠN GIẢN
// ===================================================================
const StatsCard = ({ title, value, icon, iconColor, bgColor }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${bgColor}`}>
        <IconComponent className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-gray-500 font-medium">{title}</p>
        <p className="text-gray-900 text-4xl font-bold">{value}</p>
      </div>
    </div>
  );
};

// ===================================================================
// Component Xếp hạng Sao (StarRating)
// ===================================================================
const StarRating = ({ rating, starClass = "h-4 w-4" }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${starClass} ${
            i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
};

// ===================================================================
// Component Item Thú cưng (PetReviewCard) - THÊM ANIMATION
// ===================================================================
const PetReviewCard = ({ pet, reviewCount, unrepliedCount, onPetClick }) => {
  return (
    // THÊM ANIMATION
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.03, y: -5 }} // Hiệu ứng "nâng"
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onPetClick(pet)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer"
    >
      <div className="relative">
        <img
          src={pet.imageUrl}
          alt={pet.name}
          className="w-full h-48 object-cover"
        />
        {/* Badge Rating */}
        <span className="absolute top-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
          <Star className="w-3 h-3" fill="white" /> {pet.avgRating}
        </span>
        {/* Badge Tổng Review */}
        <span className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
          <MessageSquare className="w-3 h-3" /> {reviewCount}
        </span>

        {/* Badge CHƯA TRẢ LỜI (NÂNG CẤP HIỆU ỨNG PING) */}
        {unrepliedCount > 0 && (
          <span className="absolute top-2 left-2 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex items-center justify-center rounded-full h-6 w-6 bg-red-600 text-xs font-bold text-white ring-2 ring-white">
              {unrepliedCount}
            </span>
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{pet.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{pet.type}</p>
        <StarRating rating={pet.avgRating} />
      </div>
    </motion.div>
  );
};

// ===================================================================
// Component Form Trả Lời (MỚI)
// ===================================================================
const ReplyForm = ({ onSend, onCancel }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="mt-4 ml-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Viết phản hồi của bạn..."
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      ></textarea>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSubmit}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium"
        >
          Gửi
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

// ===================================================================
// Component Modal Đánh giá (ReviewModal) - NÂNG CẤP KÍCH THƯỚC VÀ CHỨC NĂNG
// ===================================================================
const ReviewModal = ({ pet, reviews, replies, onClose }) => {
  const [replyingTo, setReplyingTo] = useState(null); // State để theo dõi đang trả lời ai

  const handleSendReply = (reviewId, text) => {
    console.log("Đã gửi trả lời cho:", reviewId, "| Nội dung:", text);
    // (Ở đây bạn sẽ thêm logic để cập nhật state `replies` thực tế)
    setReplyingTo(null); // Đóng form trả lời
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-slate-50 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" // TĂNG KÍCH THƯỚC
        variants={modalVariants}
      >
        {/* Header Modal (Giống ảnh) */}
        <div className="flex-shrink-0 p-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8" fill="white" />
            <div>
              <h2 className="text-2xl font-bold">Đánh giá - {pet.name}</h2>
              <p className="text-sm opacity-90">{reviews.length} đánh giá</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Content Modal (Scrollable) */}
        <div className="flex-1 p-6 space-y-5 overflow-y-auto">
          {reviews.map((review) => {
            const reply = replies.find((r) => r.reviewId === review.id);
            const isReplying = replyingTo === review.id;

            return (
              <div
                key={review.id}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                {/* User Review */}
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full ${review.avatarBg} flex items-center justify-center font-bold text-white`}
                  >
                    {review.userInitial}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {review.userName}
                        </p>
                        <p className="text-xs text-gray-400">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <span className="flex items-center gap-1 text-red-500">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {review.likes}
                          </span>
                        </span>
                        <button className="hover:text-gray-600">
                          <Pin className="w-4 h-4" />
                        </button>
                        <button className="hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <StarRating
                      rating={review.rating}
                      starClass="h-5 w-5 my-1.5"
                    />
                    <p className="text-gray-700">{review.comment}</p>

                    {/* === LOGIC TRẢ LỜI NÂNG CẤP === */}
                    {isReplying ? (
                      // 1. Hiển thị form nếu đang trả lời
                      <ReplyForm
                        onCancel={() => setReplyingTo(null)}
                        onSend={(text) => handleSendReply(review.id, text)}
                      />
                    ) : reply ? (
                      // 2. Hiển thị reply của admin nếu đã có
                      <div className="mt-4 ml-4 p-3 bg-teal-50 border-l-4 border-teal-400 rounded-r-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center font-bold text-white text-sm">
                              A
                            </div>
                            <div>
                              <p className="font-semibold text-teal-800">
                                Admin
                              </p>
                              <p className="text-xs text-gray-400">
                                {reply.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <button className="hover:text-blue-500">
                              <FilePenLine className="w-4 h-4" />
                            </button>
                            <button className="hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-2">{reply.text}</p>
                      </div>
                    ) : (
                      // 3. Hiển thị nút "Trả lời" nếu chưa có
                      <button
                        onClick={() => setReplyingTo(review.id)}
                        className="mt-3 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        <Reply className="w-4 h-4" />
                        Trả lời
                      </button>
                    )}
                    {/* === KẾT THÚC LOGIC === */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ===================================================================
// Component Chính: Quản Lý Đánh Giá (ReviewManagement)
// ===================================================================
export default function ReviewManagement() {
  const [pets, setPets] = useState(fakePets);
  const [reviews, setReviews] = useState(fakeReviews);
  const [replies, setReplies] = useState(fakeReplies);

  const [filters, setFilters] = useState({ search: "", status: "all" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  // --- Tính toán dữ liệu ---
  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const fiveStar = reviews.filter((r) => r.rating === 5).length;
    const replied = replies.length;
    // Pinned có thể là một state riêng, ở đây fake
    const pinned = Math.floor(totalReviews / 10) + 1;
    return { totalReviews, fiveStar, pinned, replied };
  }, [reviews, replies]);

  const filteredPets = useMemo(() => {
    return pets.filter((p) =>
      p.name.toLowerCase().includes(filters.search.toLowerCase())
    );
    // Logic lọc theo trạng thái (đã trả lời / chưa trả lời) có thể thêm ở đây
  }, [pets, filters.search]);

  // --- Hàm Helper ---
  const getReviewsForPet = (petId) => reviews.filter((r) => r.petId === petId);

  const getUnrepliedCountForPet = (petId) => {
    const petReviews = getReviewsForPet(petId);
    const unreplied = petReviews.filter(
      (review) => !replies.some((r) => r.reviewId === review.id)
    );
    return unreplied.length;
  };

  // --- Xử lý sự kiện ---
  const handleOpenModal = (pet) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPet(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid (ĐÃ LÀM LẠI ĐƠN GIẢN) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Tổng Đánh Giá"
            value={stats.totalReviews}
            icon={Star}
            iconColor="text-yellow-500"
            bgColor="bg-yellow-100"
          />
          <StatsCard
            title="Đánh Giá 5 Sao"
            value={stats.fiveStar}
            icon={Sun}
            iconColor="text-green-500"
            bgColor="bg-green-100"
          />
          <StatsCard
            title="Đã Ghim"
            value={stats.pinned}
            icon={Pin}
            iconColor="text-blue-500"
            bgColor="bg-blue-100"
          />
          <StatsCard
            title="Đã Trả Lời"
            value={stats.replied}
            icon={MessageSquare}
            iconColor="text-indigo-500"
            bgColor="bg-indigo-100"
          />
        </div>

        {/* Filters (Giống ảnh) */}
        <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm thú cưng
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Nhập tên thú cưng..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lọc theo trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
              >
                <option value="all">Tất cả</option>
                <option value="replied">Đã trả lời</option>
                <option value="unreplied">Chưa trả lời</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pet Grid (ĐÃ THÊM ANIMATION) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredPets.map((pet) => {
            const petReviews = getReviewsForPet(pet.id);
            const unrepliedCount = getUnrepliedCountForPet(pet.id);
            return (
              <PetReviewCard
                key={pet.id}
                pet={pet}
                reviewCount={petReviews.length}
                unrepliedCount={unrepliedCount}
                onPetClick={handleOpenModal}
              />
            );
          })}
        </div>
      </div>

      {/* Khu vực render Modal (với AnimatePresence) */}
      <AnimatePresence>
        {isModalOpen && selectedPet && (
          <ReviewModal
            pet={selectedPet}
            reviews={getReviewsForPet(selectedPet.id)}
            replies={replies}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
