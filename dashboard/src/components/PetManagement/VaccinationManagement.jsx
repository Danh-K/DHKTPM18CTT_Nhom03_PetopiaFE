"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Syringe,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCheck,
  Clock3,
  AlertTriangle,
  Plus,
  FilePenLine,
  Trash2,
  X,
  Search,
  Calendar,
  Eye,
  User,
  Mail,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { useVaccineManagement } from "../../hooks/useVaccineManagement";

// --- ANIMATION VARIANTS ---
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.95, y: 30, transition: { duration: 0.2 } },
};

// --- HELPERS ---
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const mapStatus = (status) => {
  switch (status) {
    case "Da_TIEM":
      return {
        text: "Hoàn thành",
        class: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCheck,
      };
    case "CHUA_TIEM":
      return {
        text: "Sắp tới",
        class: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock3,
      };
    case "DANG_CHO":
      return {
        text: "Đang chờ",
        class: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertTriangle,
      };
    default:
      return {
        text: "Không rõ",
        class: "bg-gray-100 text-gray-800",
        icon: Clock3,
      };
  }
};

// --- SUB-COMPONENTS ---

// 1. Stats Card
const StatsCard = ({ title, value, icon: Icon, variant }) => {
  let iconBg = "bg-gray-100 text-gray-600";
  if (variant === "blue") iconBg = "bg-blue-100 text-blue-600";
  if (variant === "green") iconBg = "bg-green-100 text-green-600";
  if (variant === "red") iconBg = "bg-red-100 text-red-600";

  return (
    <div className="p-4 rounded-xl border shadow-sm flex items-center gap-4 bg-white">
      <div className={`p-3 rounded-full ${iconBg}`}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          {title}
        </p>
        <p className="text-2xl font-extrabold text-gray-800">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

// 2. Status Pill
const StatusPill = ({ status }) => {
  const info = mapStatus(status);
  return (
    <span
      className={`px-2.5 py-0.5 inline-flex items-center gap-1 text-xs font-bold rounded-full border ${info.class}`}
    >
      {info.text}
    </span>
  );
};

// 3. Sending Mail Overlay (NEW)
const SendingMailOverlay = () => (
  <motion.div
    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-[100]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm text-center"
    >
      <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-blue-100 border-t-blue-600 rounded-full"
        />
        <Mail size={32} className="text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Đang xử lý...</h3>
      <p className="text-gray-500 text-sm">
        Hệ thống đang tạo lịch và gửi email thông báo đến khách hàng.
      </p>
    </motion.div>
  </motion.div>
);

// 4. Delete Confirmation Modal (NEW)
const DeleteModal = ({ onClose, onConfirm }) => (
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
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
        <Trash2 size={24} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa?</h3>
      <p className="text-sm text-gray-500 mb-6">
        Bạn có chắc chắn muốn xóa lịch tiêm này không? Hành động này không thể
        hoàn tác.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
        >
          Hủy bỏ
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-md"
        >
          Xóa ngay
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// --- MODAL: VIEW HISTORY ---
const ViewSchedulesModal = ({
  pet,
  fetchHistory,
  onClose,
  onEdit,
  onDeleteRequest,
}) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchHistory(pet.petId);
      setSchedules(
        data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      );
      setLoading(false);
    };
    load();
  }, [pet]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        variants={modalVariants}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Lịch sử tiêm chủng
            </h2>
            <p className="text-sm text-gray-500">
              Thú cưng:{" "}
              <span className="font-semibold text-blue-600">{pet.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
          {loading ? (
            <div className="text-center py-10 flex flex-col items-center gap-2 text-gray-500">
              <Loader2 className="animate-spin" /> Đang tải lịch sử...
            </div>
          ) : schedules.length > 0 ? (
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pl-6 pb-2">
              {schedules.map((schedule) => (
                <div
                  key={schedule.vaccineId}
                  className="relative bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div
                    className={`absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 border-white ${
                      schedule.status === "Da_TIEM"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    } shadow-sm`}
                  ></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800 text-base">
                        {schedule.vaccineName}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar size={12} /> {formatDate(schedule.startDate)}
                      </p>
                    </div>
                    <StatusPill status={schedule.status} />
                  </div>
                  {(schedule.note || schedule.description) && (
                    <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800 mt-2 border border-yellow-100 space-y-1">
                      {schedule.description && (
                        <p>
                          <strong>Mô tả:</strong> {schedule.description}
                        </p>
                      )}
                      {schedule.note && (
                        <p>
                          <strong>Note:</strong> {schedule.note}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        onClose();
                        onEdit(schedule);
                      }}
                      className="text-xs flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                      <FilePenLine size={12} /> Sửa
                    </button>
                    {/* Gọi hàm onDeleteRequest để mở Modal Xóa Custom */}
                    <button
                      onClick={() => onDeleteRequest(schedule.vaccineId)}
                      className="text-xs flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                    >
                      <Trash2 size={12} /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Syringe size={48} strokeWidth={1} className="mb-2 opacity-20" />
              <p>Chưa có lịch sử tiêm.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- MODAL: ADD/EDIT ---
const ScheduleModal = ({ mode, data, onClose, onSave }) => {
  const isEdit = mode === "EDIT";
  const scheduleData = isEdit ? data.schedule : {};

  const initialStart =
    isEdit && scheduleData.startDate
      ? new Date(scheduleData.startDate)
      : new Date();
  const initialEnd =
    isEdit && scheduleData.endDate
      ? new Date(scheduleData.endDate)
      : initialStart;

  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);

  const [vaccineName, setVaccineName] = useState(
    isEdit ? scheduleData.vaccineName : ""
  );
  const [notes, setNotes] = useState(isEdit ? scheduleData.note : "");
  const [instructions, setInstructions] = useState(
    isEdit ? scheduleData.description : "Kiêng tắm 3 ngày sau tiêm."
  );
  const [status, setStatus] = useState(
    isEdit ? scheduleData.status : "CHUA_TIEM"
  );

  const handleSaveClick = () => {
    if (!startDate || !vaccineName)
      return alert("Vui lòng nhập đầy đủ thông tin!");

    let dates = [];
    if (startDate) {
      // Logic chọn Range (nếu startDate khác endDate)
      if (endDate && endDate > startDate && !isEdit) {
        // Nếu chọn Range, backend xử lý batch create
        dates.push(startDate);
        dates.push(endDate);
      } else {
        dates.push(startDate);
      }
    }

    onSave({
      mode,
      data,
      formData: {
        dates: dates, // Mảng Date object
        vaccineName,
        notes,
        instructions,
        status,
      },
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {isEdit ? "Cập nhật lịch tiêm" : "Lên lịch mới"}
          </h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Thời gian tiêm
            </label>
            <div className="p-4 border rounded-xl bg-blue-50/30 flex flex-col gap-3 justify-center items-center">
              <div className="w-full">
                <label className="text-xs text-gray-500 mb-1 block">
                  Ngày bắt đầu
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="w-full p-2 border rounded text-center focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="w-full">
                <label className="text-xs text-gray-500 mb-1 block">
                  Ngày kết thúc
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="w-full p-2 border rounded text-center focus:ring-2 focus:ring-blue-500 outline-none"
                  minDate={startDate}
                />
              </div>
            </div>
            {!isEdit && (
              <p className="text-xs text-blue-600 mt-2 text-center">
                * Hệ thống sẽ tạo lịch cho khoảng thời gian này.
              </p>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên Vaccine <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={vaccineName}
                onChange={(e) => setVaccineName(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="VD: Vaccine Dại..."
              />
            </div>
            {isEdit && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Trạng thái
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 outline-none"
                >
                  <option value="CHUA_TIEM">Chưa tiêm</option>
                  <option value="Da_TIEM">Đã tiêm</option>
                  <option value="DANG_CHO">Đang chờ</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">
                Mô tả (Description)
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded-lg focus:ring-2 outline-none"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Ghi chú (Note)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full p-2 border rounded-lg focus:ring-2 outline-none"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSaveClick}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            {isEdit ? "Cập nhật" : "Lưu & Gửi Email"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export default function VaccinationManagement() {
  const {
    pets,
    stats,
    loading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    fetchPetHistory,
    fetchData,
  } = useVaccineManagement();

  const [selectedPetIds, setSelectedPetIds] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalState, setModalState] = useState({ type: null, data: null });

  // State mới cho các hiệu ứng Loading và Modal Xóa
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    id: null,
  });

  const perPage = 10;
  const petsToDisplay = useMemo(
    () =>
      pets.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [pets, search]
  );
  const totalPages = Math.ceil(petsToDisplay.length / perPage);
  const paginatedPets = petsToDisplay.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedPetIds(paginatedPets.map((p) => p.petId));
    else setSelectedPetIds([]);
  };

  const handleOpenModal = (type, data = null) => setModalState({ type, data });
  const handleCloseModal = () => setModalState({ type: null, data: null });

  // --- LOGIC SAVE (Có hiệu ứng Loading Mail) ---
  const handleSave = async ({ mode, data, formData }) => {
    // Đóng form nhập liệu trước
    handleCloseModal();

    let success = false;

    if (mode === "ADD" || mode === "BULK") {
      // Bắt đầu hiệu ứng gửi mail
      setIsSendingMail(true);

      const targetPetId = mode === "ADD" ? data.pet.petId : data.petIds[0];
      const pet = pets.find((p) => p.petId === targetPetId);
      const userId = pet ? pet.ownerId : "U001";

      // Giả lập delay nhẹ để hiệu ứng hiển thị rõ hơn (nếu mạng quá nhanh)
      await new Promise((r) => setTimeout(r, 1000));

      success = await createSchedule(
        formData,
        mode === "ADD" ? [targetPetId] : data.petIds,
        userId
      );

      // Tắt hiệu ứng
      setIsSendingMail(false);
    } else if (mode === "EDIT") {
      success = await updateSchedule(data.schedule.vaccineId, formData);
    }
  };

  // --- LOGIC DELETE (Custom Modal) ---
  const handleDeleteRequest = (scheduleId) => {
    // Mở Modal Xóa Custom (Thay vì window.confirm)
    setDeleteConfirm({ isOpen: true, id: scheduleId });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.id) {
      await deleteSchedule(deleteConfirm.id);
      setDeleteConfirm({ isOpen: false, id: null });
      // Note: Nếu đang mở ViewHistoryModal, cần refresh nó (đã handle ở logic ViewModal)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* --- OVERLAY LOADING KHI GỬI MAIL --- */}
      <AnimatePresence>
        {isSendingMail && <SendingMailOverlay />}
      </AnimatePresence>

      {/* --- CUSTOM DELETE MODAL --- */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <DeleteModal
            onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">
          Quản Lý Lịch Tiêm Phòng
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Tổng lịch"
            value={stats.totalSchedules}
            icon={FileText}
          />
          <StatsCard
            title="Sắp tới"
            value={stats.upcomingSchedules}
            icon={Clock3}
            variant="blue"
          />
          <StatsCard
            title="Hoàn thành"
            value={stats.completedSchedules}
            icon={CheckCheck}
            variant="green"
          />
          <StatsCard
            title="Cần tiêm"
            value={stats.petsNeedVaccination}
            icon={AlertTriangle}
            variant="red"
          />
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border shadow-sm mb-6 flex justify-between items-center gap-4">
          <button
            onClick={() => handleOpenModal("BULK", { petIds: selectedPetIds })}
            disabled={selectedPetIds.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-md transition-all"
          >
            <Syringe size={18} /> Lên Lịch Chung ({selectedPetIds.length})
          </button>
          <div className="relative w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Tìm thú cưng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
          {loading && (
            <div className="p-10 text-center text-gray-500 flex justify-center items-center gap-2">
              <Loader2 className="animate-spin" /> Đang tải dữ liệu...
            </div>
          )}
          {!loading && (
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      className="rounded text-blue-600"
                    />
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase w-24">
                    ID Pet
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Thú cưng
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Chủ sở hữu
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedPets.map((pet) => (
                  <tr
                    key={pet.petId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPetIds.includes(pet.petId)}
                        onChange={() =>
                          setSelectedPetIds((prev) =>
                            prev.includes(pet.petId)
                              ? prev.filter((id) => id !== pet.petId)
                              : [...prev, pet.petId]
                          )
                        }
                        className="rounded text-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      {pet.petId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {pet.image ? (
                          <img
                            src={pet.image}
                            className="w-10 h-10 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) =>
                              (e.target.src = "https://placehold.co/50")
                            }
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {pet.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {pet.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {pet.categoryName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        {pet.ownerName !== "Khách vãng lai" ? (
                          <span className="font-medium text-gray-800">
                            {pet.ownerName}
                          </span>
                        ) : (
                          <span className="text-orange-500 italic text-xs">
                            Chưa cập nhật chủ (ID: {pet.ownerId})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal("VIEW", { pet })}
                          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 shadow-sm transition-all"
                        >
                          <Eye size={14} /> Xem Lịch Sử
                        </button>
                        <button
                          onClick={() => handleOpenModal("ADD", { pet })}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 shadow-md transition-all"
                        >
                          <Plus size={14} /> Thêm Lịch
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 bg-white border rounded disabled:opacity-50"
            >
              <ChevronLeft />
            </button>
            <span className="text-sm font-bold py-2">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 bg-white border rounded disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>
        )}

        <AnimatePresence>
          {modalState.type === "VIEW" && (
            <ViewSchedulesModal
              pet={modalState.data.pet}
              fetchHistory={fetchPetHistory}
              onClose={handleCloseModal}
              onEdit={(schedule) => handleOpenModal("EDIT", { schedule })}
              onDeleteRequest={handleDeleteRequest}
            />
          )}
          {(modalState.type === "ADD" ||
            modalState.type === "EDIT" ||
            modalState.type === "BULK") && (
            <ScheduleModal
              mode={modalState.type}
              data={modalState.data}
              onClose={handleCloseModal}
              onSave={handleSave}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
