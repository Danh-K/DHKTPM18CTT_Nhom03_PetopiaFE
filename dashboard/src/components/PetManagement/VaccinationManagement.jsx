"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
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
} from "lucide-react";

import { useVaccineManagement } from "../../hooks/useVaccineManagement";

// --- CONFIG ---
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

// --- MODAL: VIEW HISTORY ---
const ViewSchedulesModal = ({
  pet,
  fetchHistory,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    const data = await fetchHistory(pet.petId);
    // Sort: Mới nhất lên đầu
    setSchedules(
      data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    );
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, [pet]);

  const handleDeleteItem = async (id) => {
    if (window.confirm("Xóa lịch sử này?")) {
      await onDelete(id);
      loadHistory(); // Reload lại list sau khi xóa
    }
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
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
          {loading ? (
            <div className="text-center py-10">Đang tải...</div>
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
                    <button
                      onClick={() => handleDeleteItem(schedule.vaccineId)}
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
  // Backend trả về vaccineId khi getHistory, nhưng khi edit truyền data vào
  const scheduleData = isEdit ? data.schedule : {};

  const initialStart = isEdit ? new Date(scheduleData.startDate) : new Date();
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

    onSave({
      mode,
      data,
      formData: {
        dates: [startDate, endDate], // Gửi mảng 2 phần tử [start, end]
        vaccineName,
        notes,
        instructions,
        status,
      },
    });
    // Không đóng ngay để chờ API trả về success
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
                  className="w-full p-2 border rounded text-center"
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
                  className="w-full p-2 border rounded text-center"
                  minDate={startDate}
                />
              </div>
            </div>
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
                className="w-full p-2 border rounded-lg focus:ring-2"
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
                  className="w-full p-2 border rounded-lg"
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
                className="w-full p-2 border rounded-lg"
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
                className="w-full p-2 border rounded-lg"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSaveClick}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-md"
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
  } = useVaccineManagement();
  const [selectedPetIds, setSelectedPetIds] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalState, setModalState] = useState({ type: null, data: null });

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

  const handleSave = async ({ mode, data, formData }) => {
    let success = false;
    if (mode === "ADD" || mode === "BULK") {
      const targetPetId = mode === "ADD" ? data.pet.petId : data.petIds[0];
      const pet = pets.find((p) => p.petId === targetPetId);
      const userId = pet ? pet.ownerId : "U001"; // Fallback U001

      success = await createSchedule(
        formData,
        mode === "ADD" ? [targetPetId] : data.petIds,
        userId
      );
    } else if (mode === "EDIT") {
      // Khi Edit, vaccineId nằm trong data.schedule.vaccineId
      success = await updateSchedule(data.schedule.vaccineId, formData);
    }

    if (success) handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={2000} />
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
            <div className="p-10 text-center text-gray-500">
              Đang tải dữ liệu...
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
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
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
              onDelete={deleteSchedule}
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
