"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Star,
  Sun,
  MessageSquare,
  Search,
  Trash2,
  FilePenLine,
  Reply,
  X,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  MessageCircle,
  Send,
} from "lucide-react";

import { useReviewManagement } from "../../hooks/useReviewManagement";

// --- CONFIG ---
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

const transformGoogleDriveUrl = (url) => {
  if (!url) return "";
  if (url.includes("drive.google.com")) {
    const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1])
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }
  return url;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// --- SUB-COMPONENTS ---

const StatsCard = ({ title, value, icon: Icon, gradient }) => {
  return (
    <div className="relative overflow-hidden bg-white p-5 rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
      <div
        className={`absolute top-0 right-0 w-24 h-24 -mr-5 -mt-5 rounded-full opacity-10 bg-gradient-to-br ${gradient}`}
      ></div>
      <div className="relative flex items-center gap-4">
        <div
          className={`p-3 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md group-hover:scale-110 transition-transform`}
        >
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

const StarRating = ({ rating, size = 4 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-${size} h-${size} ${
            i < Math.round(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

// --- PET CARD ---
const PetReviewCard = ({ pet, onPetClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      onClick={() => onPetClick(pet)}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer group"
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {pet.imageUrl ? (
          <img
            src={transformGoogleDriveUrl(pet.imageUrl)}
            alt={pet.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
            onError={(e) =>
              (e.target.src = "https://placehold.co/300?text=No+Image")
            }
          />
        ) : (
          <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-300 font-bold text-5xl">
            {pet.name.charAt(0)}
          </div>
        )}

        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm text-gray-800">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{" "}
          {pet.avgRating}
        </div>

        {pet.unrepliedCount > 0 && (
          <div className="absolute bottom-2 left-2">
            <span className="relative inline-flex">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
                <AlertCircle size={10} /> {pet.unrepliedCount} cần trả lời
              </span>
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 truncate mb-1">
          {pet.name}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {pet.categoryName || "Thú cưng"}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <MessageCircle size={12} /> {pet.reviewCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// --- DELETE MODAL ---
const DeleteModal = ({ title, message, onClose, onConfirm }) => (
  <motion.div
    className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
    variants={backdropVariants}
    initial="hidden"
    animate="visible"
    exit="hidden"
  >
    <motion.div
      className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center"
      variants={modalVariants}
    >
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 shadow-sm">
        <Trash2 size={28} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          Hủy bỏ
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-md transition-transform active:scale-95"
        >
          Xóa ngay
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// --- REPLY FORM ---
const ReplyForm = ({
  initialText = "",
  onSend,
  onCancel,
  isUpdate = false,
}) => {
  const [text, setText] = useState(initialText);
  return (
    <div className="mt-3 animate-fadeIn bg-blue-50 p-3 rounded-xl border border-blue-200 shadow-sm">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập nội dung phản hồi..."
        className="w-full p-3 border border-blue-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm min-h-[80px]"
        autoFocus
      ></textarea>
      <div className="flex gap-2 mt-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 bg-white text-gray-600 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          onClick={() => {
            if (text.trim()) onSend(text);
          }}
          className={`px-4 py-1.5 text-white rounded-lg text-xs font-medium shadow-sm flex items-center gap-1 transition-colors ${
            isUpdate
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUpdate ? <FilePenLine size={14} /> : <Send size={14} />}
          {isUpdate ? "Cập nhật" : "Gửi ngay"}
        </button>
      </div>
    </div>
  );
};

// --- REVIEW MODAL ---
const ReviewModal = ({
  pet,
  fetchReviews,
  onReply,
  onDeleteReply,
  onDeleteReview,
  onClose,
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReplyId, setEditingReplyId] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    type: null,
    id: null,
  });

  // Load data
  const loadReviews = async () => {
    setLoading(true);
    const data = await fetchReviews(pet.id);
    setReviews(
      data.sort((a, b) => {
        if (!a.reply && b.reply) return -1;
        if (a.reply && !b.reply) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, [pet]);

  const handleSendReply = async (reviewId, text) => {
    const success = await onReply(reviewId, text);
    if (success) {
      setEditingReplyId(null);
      setReviews((prev) =>
        prev.map((r) =>
          r.reviewId === reviewId
            ? { ...r, reply: text, replyDate: new Date().toISOString() }
            : r
        )
      );
    }
  };

  const requestDelete = (type, id) => {
    setDeleteConfirm({
      isOpen: true,
      type,
      id,
      title: type === "reply" ? "Xóa câu trả lời?" : "Xóa đánh giá?",
      message:
        type === "reply"
          ? "Câu trả lời này sẽ bị xóa. Bình luận của khách vẫn giữ nguyên."
          : "Toàn bộ đánh giá này sẽ bị xóa vĩnh viễn.",
    });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteConfirm;
    let success = false;
    if (type === "reply") {
      success = await onDeleteReply(id);
      if (success)
        setReviews((prev) =>
          prev.map((r) =>
            r.reviewId === id ? { ...r, reply: null, replyDate: null } : r
          )
        );
    } else {
      success = await onDeleteReview(id);
      if (success) setReviews((prev) => prev.filter((r) => r.reviewId !== id));
    }
    if (success) setDeleteConfirm({ isOpen: false, type: null, id: null });
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
          variants={modalVariants}
        >
          {/* Header */}
          <div className="flex-shrink-0 p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                {pet.imageUrl ? (
                  <img
                    src={transformGoogleDriveUrl(pet.imageUrl)}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="font-bold text-white text-xl">
                    {pet.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{pet.name}</h2>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <Star size={14} className="text-yellow-300 fill-yellow-300" />{" "}
                  {pet.avgRating} • {reviews.length} đánh giá
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/90 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-100">
            {loading ? (
              <div className="text-center py-10 text-gray-400">
                Đang tải bình luận...
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => {
                const isEditing = editingReplyId === review.reviewId;
                return (
                  <div
                    key={review.reviewId}
                    className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${
                      !review.reply
                        ? "border-l-4 border-l-red-400"
                        : "border-gray-100"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm uppercase overflow-hidden border border-white shadow-sm">
                          {review.userAvatar ? (
                            <img
                              src={transformGoogleDriveUrl(review.userAvatar)}
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                (e.target.src =
                                  "https://placehold.co/50?text=U")
                              }
                            />
                          ) : (
                            (review.userFullName || "U").charAt(0)
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {review.userFullName || "Khách hàng"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <StarRating rating={review.rating} size={3} />
                              <span className="text-xs text-gray-400">
                                • {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                          {/* Nút xóa review gốc */}
                          <button
                            onClick={() =>
                              requestDelete("review", review.reviewId)
                            }
                            className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Xóa đánh giá"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <p className="text-gray-700 text-sm mt-3 leading-relaxed">
                          {review.comment}
                        </p>
                        {review.reviewImageUrl && (
                          <img
                            src={transformGoogleDriveUrl(review.reviewImageUrl)}
                            alt="Review"
                            className="mt-3 w-24 h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90"
                          />
                        )}

                        {/* Khu vực Phản hồi */}
                        <div className="mt-4">
                          {/* TH1: Đang sửa */}
                          {isEditing ? (
                            <ReplyForm
                              initialText={review.reply || ""}
                              isUpdate={true}
                              onCancel={() => setEditingReplyId(null)}
                              onSend={(text) =>
                                handleSendReply(review.reviewId, text)
                              }
                            />
                          ) : review.reply ? (
                            // TH2: Đã trả lời -> Hiển thị box Admin Reply
                            <div className="mt-4 ml-4 p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                    AD
                                  </div>
                                  <span className="font-bold text-blue-800 text-sm">
                                    Quản trị viên
                                  </span>
                                  {review.replyDate && (
                                    <span className="text-xs text-gray-400">
                                      • {formatDate(review.replyDate)}
                                    </span>
                                  )}
                                </div>

                                {/* --- NÚT CẬP NHẬT & XÓA (LÀM LẠI DỄ NHÌN HƠN) --- */}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      setEditingReplyId(review.reviewId)
                                    }
                                    className="flex items-center gap-1 px-2 py-1 bg-white border border-indigo-200 text-indigo-600 rounded shadow-sm hover:bg-indigo-50 text-xs font-medium transition-all"
                                    title="Sửa câu trả lời"
                                  >
                                    <FilePenLine size={12} /> Sửa
                                  </button>
                                  <button
                                    onClick={() =>
                                      requestDelete("reply", review.reviewId)
                                    }
                                    className="flex items-center gap-1 px-2 py-1 bg-white border border-red-200 text-red-600 rounded shadow-sm hover:bg-red-50 text-xs font-medium transition-all"
                                    title="Xóa câu trả lời"
                                  >
                                    <Trash2 size={12} /> Xóa
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed pl-8">
                                {review.reply}
                              </p>
                            </div>
                          ) : (
                            // TH3: Chưa trả lời
                            <button
                              onClick={() => setEditingReplyId(review.reviewId)}
                              className="mt-3 flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 border border-blue-100"
                            >
                              <Reply size={14} /> Trả lời khách hàng
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                <MessageSquare size={48} className="opacity-20 mb-2" />
                <p>Chưa có đánh giá nào.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <DeleteModal
            title={deleteConfirm.title}
            message={deleteConfirm.message}
            onClose={() =>
              setDeleteConfirm({ ...deleteConfirm, isOpen: false })
            }
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// --- MAIN COMPONENT ---
export default function ReviewManagement() {
  const {
    pets,
    stats,
    loading,
    fetchPetReviews,
    replyReview,
    deleteAdminReply,
    deleteReview,
  } = useReviewManagement();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all"); // Thêm state filter rating
  const [selectedPet, setSelectedPet] = useState(null);

  const filteredPets = useMemo(() => {
    let res = pets.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    // Lọc trạng thái trả lời
    if (filterStatus === "unreplied")
      res = res.filter((p) => p.unrepliedCount > 0);
    else if (filterStatus === "replied")
      res = res.filter((p) => p.unrepliedCount === 0 && p.reviewCount > 0);

    // Lọc theo sao (Rating) - Lọc theo Avg Rating của Pet (làm tròn)
    if (filterRating !== "all") {
      const rating = parseInt(filterRating);
      res = res.filter((p) => Math.round(p.avgRating) === rating);
    }

    return res;
  }, [pets, search, filterStatus, filterRating]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Trung Tâm Đánh Giá
          </h1>
          <p className="text-gray-500">
            Theo dõi và phản hồi ý kiến khách hàng.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatsCard
            title="Tổng Đánh Giá"
            value={stats.totalReviews}
            icon={MessageSquare}
            gradient="from-blue-400 to-blue-600"
          />
          <StatsCard
            title="Điểm Trung Bình"
            value={stats.averageRating}
            icon={Star}
            gradient="from-yellow-400 to-orange-500"
          />
          <StatsCard
            title="Cần Trả Lời"
            value={stats.unrepliedCount}
            icon={AlertCircle}
            gradient="from-red-400 to-pink-600"
          />
          <StatsCard
            title="Đã Phản Hồi"
            value={stats.repliedCount}
            icon={ThumbsUp}
            gradient="from-green-400 to-emerald-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-4 z-20 backdrop-blur-lg bg-white/90">
          <div className="relative w-full md:w-80 group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <Search size={20} />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm thú cưng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto bg-gray-50 p-1 rounded-xl border border-gray-200">
            {/* Filter Status */}
            <div className="flex">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === "all"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterStatus("unreplied")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  filterStatus === "unreplied"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Cần trả lời{" "}
                {stats.unrepliedCount > 0 && (
                  <span className="bg-red-100 text-red-600 px-1.5 rounded-full text-[10px]">
                    {stats.unrepliedCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilterStatus("replied")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === "replied"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Đã trả lời
              </button>
            </div>

            {/* Filter Rating Dropdown */}
            <div className="h-8 w-px bg-gray-300 mx-1"></div>

            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-600 outline-none px-2 cursor-pointer"
            >
              <option value="all">⭐ Tất cả sao</option>
              <option value="5">5 sao (Tuyệt vời)</option>
              <option value="4">4 sao (Tốt)</option>
              <option value="3">3 sao (Bình thường)</option>
              <option value="2">2 sao (Tệ)</option>
              <option value="1">1 sao (Rất tệ)</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-medium">
            Đang đồng bộ dữ liệu...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <PetReviewCard
                key={pet.id}
                pet={pet}
                onPetClick={setSelectedPet}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedPet && (
            <ReviewModal
              pet={selectedPet}
              fetchReviews={fetchPetReviews}
              onReply={replyReview}
              onDeleteReply={deleteAdminReply}
              onDeleteReview={deleteReview}
              onClose={() => setSelectedPet(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
