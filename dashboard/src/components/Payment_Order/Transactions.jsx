"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Thư viện PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Icons
import {
  HiEye,
  HiDownload,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiTruck,
  HiUser,
  HiLocationMarker,
  HiCreditCard,
  HiX,
  HiChevronLeft,
  HiChevronRight,
  HiShoppingCart,
  HiExclamation,
  HiPhone,
  HiCalendar,
  HiTicket,
} from "react-icons/hi";
import { FaSearch, FaBoxOpen, FaFilePdf } from "react-icons/fa";

import { useOrderManagement } from "../../hooks/useOrderManagement";

// --- HELPERS & CONFIG ---
const statusColors = {
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  SHIPPED: "bg-blue-100 text-blue-700 border-blue-200",
  CONFIRMED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
  FAILED: "bg-red-100 text-red-700 border-red-200",
};

const statusIcons = {
  COMPLETED: HiCheckCircle,
  DELIVERED: HiCheckCircle,
  SHIPPED: HiTruck,
  CONFIRMED: HiCheckCircle,
  PENDING: HiClock,
  CANCELLED: HiXCircle,
  FAILED: HiXCircle,
};

const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val
  );
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

// --- SUB-COMPONENT: SUCCESS ANIMATION ---
const SuccessAnimation = ({ message }) => (
  <motion.div
    className="absolute inset-0 z-[110] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-lg"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
      <motion.svg
        viewBox="0 0 50 50"
        className="w-12 h-12 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      >
        <motion.path
          d="M10 25 L22 37 L40 15"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </motion.svg>
    </motion.div>
    <motion.h3
      className="text-xl font-bold text-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {message}
    </motion.h3>
  </motion.div>
);

// --- SUB-COMPONENT: CUSTOM CONFIRM MODAL ---
const StatusConfirmModal = ({
  newStatus,
  onClose,
  onConfirm,
  isProcessing,
}) => {
  const config = {
    CONFIRMED: {
      title: "Xác nhận đơn hàng?",
      color: "indigo",
      msg: "Đơn hàng sẽ chuyển sang trạng thái Đã xác nhận.",
    },
    SHIPPED: {
      title: "Giao hàng?",
      color: "blue",
      msg: "Xác nhận đã bàn giao cho đơn vị vận chuyển?",
    },
    DELIVERED: {
      title: "Hoàn tất đơn hàng?",
      color: "green",
      msg: "Xác nhận khách đã nhận được hàng và thanh toán?",
    },
    CANCELLED: {
      title: "Hủy đơn hàng?",
      color: "red",
      msg: "Hành động này không thể hoàn tác. Bạn chắc chứ?",
    },
  }[newStatus] || { title: "Cập nhật trạng thái?", color: "gray", msg: "" };

  return (
    <motion.div
      className="absolute inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 max-w-xs w-full text-center"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <div
          className={`w-14 h-14 rounded-full bg-${config.color}-100 flex items-center justify-center mx-auto mb-4 text-${config.color}-600`}
        >
          <HiExclamation size={28} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{config.title}</h3>
        <p className="text-sm text-gray-500 mb-6">{config.msg}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-4 py-2 text-white rounded-lg font-medium shadow-md flex items-center gap-2 transition-colors ${
              config.color === "red"
                ? "bg-red-600 hover:bg-red-700"
                : config.color === "green"
                ? "bg-green-600 hover:bg-green-700"
                : config.color === "blue"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isProcessing ? "Đang xử lý..." : "Đồng ý"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- MODAL CHI TIẾT ĐƠN HÀNG ---
const OrderDetailModal = ({
  orderId,
  onClose,
  getDetail,
  updateStatus,
  onRefresh,
}) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmStatus, setConfirmStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getDetail(orderId);
      setOrder(data);
      setLoading(false);
    };
    load();
  }, [orderId, getDetail]);

  const handleConfirmUpdate = async () => {
    if (!confirmStatus) return;
    setIsProcessing(true);
    const success = await updateStatus(orderId, confirmStatus);

    if (success) {
      setShowSuccess(true);
      setConfirmStatus(null);
      setTimeout(async () => {
        const data = await getDetail(orderId);
        setOrder(data);
        onRefresh();
        setShowSuccess(false);
        setIsProcessing(false);
      }, 1500);
    } else {
      setIsProcessing(false);
      setConfirmStatus(null);
    }
  };

  // --- LOGIC TÍNH TOÁN VÀ HIỂN THỊ TIỀN ---
  const calculateFinancials = () => {
    if (!order?.orderItems) return { subTotal: 0, discount: 0 };

    // 1. Tính Tạm tính (Subtotal) = Tổng tiền các món hàng
    const subTotal = order.orderItems.reduce((total, item) => {
      const itemTotal = item.totalPrice
        ? item.totalPrice
        : (item.price || item.priceAtPurchase || 0) * item.quantity;
      return total + itemTotal;
    }, 0);

    const shippingFee = order.shippingFee || 0;
    const finalTotal = order.totalAmount || 0;

    // 2. Tính Discount (Logic quan trọng để fix lỗi hiển thị)
    // Nếu BE trả về discountAmount > 0 thì dùng nó.
    // Nếu không, ta tự tính: Discount = (Subtotal + Ship) - FinalTotal
    let discount = order.discountAmount || 0;

    if (discount === 0) {
      // Tự động phát hiện chênh lệch giá
      const expectedTotal = subTotal + shippingFee;
      if (expectedTotal > finalTotal) {
        discount = expectedTotal - finalTotal;
      }
    }

    return { subTotal, shippingFee, discount, finalTotal };
  };

  const { subTotal, shippingFee, discount, finalTotal } = calculateFinancials();

  if (!order && !loading) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <AnimatePresence>
          {showSuccess && <SuccessAnimation message="Cập nhật thành công!" />}
          {confirmStatus && (
            <StatusConfirmModal
              newStatus={confirmStatus}
              onClose={() => setConfirmStatus(null)}
              onConfirm={handleConfirmUpdate}
              isProcessing={isProcessing}
            />
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
              Đơn hàng #{orderId}
              <span
                className={`text-xs px-3 py-1 rounded-full border shadow-sm font-bold flex items-center gap-1 ${
                  statusColors[order?.status] || "bg-gray-100"
                }`}
              >
                {order?.status}
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <HiClock /> Ngày đặt:{" "}
              {order ? formatDate(order.createdAt) : "..."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-red-500"
          >
            <HiX size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Đang tải chi tiết...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                {/* Customer Info */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2 tracking-wider">
                    <HiUser className="text-blue-500 text-lg" /> Khách hàng
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {order.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <HiPhone /> {order.customerPhone}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <HiLocationMarker /> Địa chỉ giao hàng:
                      </p>
                      <p className="text-sm font-medium text-gray-800 leading-relaxed">
                        {order.shippingAddress}
                      </p>
                    </div>
                    {order.note && (
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs text-yellow-800 italic">
                        " {order.note} "
                      </div>
                    )}
                  </div>
                </div>

                {/* ADMIN ACTIONS */}
                <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm ring-1 ring-blue-50">
                  <h3 className="text-xs font-bold text-blue-600 uppercase mb-4 tracking-wider">
                    Cập nhật trạng thái
                  </h3>
                  <div className="flex flex-col gap-3">
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => setConfirmStatus("CONFIRMED")}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md transition-all flex justify-center items-center gap-2"
                      >
                        <HiCheckCircle /> Xác nhận đơn
                      </button>
                    )}
                    {order.status === "CONFIRMED" && (
                      <button
                        onClick={() => setConfirmStatus("SHIPPED")}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-all flex justify-center items-center gap-2"
                      >
                        <HiTruck /> Giao hàng
                      </button>
                    )}
                    {order.status === "SHIPPED" && (
                      <button
                        onClick={() => setConfirmStatus("DELIVERED")}
                        className="w-full py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 shadow-md transition-all flex justify-center items-center gap-2"
                      >
                        <HiCheckCircle /> Đã giao hàng
                      </button>
                    )}
                    {(order.status === "PENDING" ||
                      order.status === "CONFIRMED") && (
                      <button
                        onClick={() => setConfirmStatus("CANCELLED")}
                        className="w-full py-3 bg-white border-2 border-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-200 transition-all flex justify-center items-center gap-2"
                      >
                        <HiX /> Hủy đơn hàng
                      </button>
                    )}
                    {["DELIVERED", "CANCELLED", "FAILED"].includes(
                      order.status
                    ) && (
                      <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium flex items-center justify-center gap-2">
                          <HiCheckCircle className="text-green-500" /> Đơn hàng
                          đã kết thúc
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                {/* Product List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
                      <HiShoppingCart className="text-blue-500" /> Sản phẩm (
                      {order.orderItems?.length})
                    </h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-white border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-500">
                          Sản phẩm
                        </th>
                        <th className="px-6 py-3 text-center font-semibold text-gray-500">
                          SL
                        </th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-500">
                          Đơn giá
                        </th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-500">
                          Tổng
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {order.orderItems?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                {item.petImage ? (
                                  <img
                                    src={item.petImage}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <FaBoxOpen className="text-gray-400 m-auto" />
                                )}
                              </div>
                              <span className="font-medium text-gray-800">
                                {item.petName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-medium">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600">
                            {formatCurrency(item.price || item.priceAtPurchase)}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900">
                            {formatCurrency(
                              item.totalPrice ||
                                (item.price || item.priceAtPurchase) *
                                  item.quantity
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* --- PHẦN TỔNG KẾT HÓA ĐƠN --- */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Tạm tính:</span>
                        <span>{formatCurrency(subTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Phí vận chuyển:</span>
                        <span>{formatCurrency(shippingFee)}</span>
                      </div>

                      {/* Hiển thị dòng giảm giá (Tự động hiện kể cả khi BE trả về 0 nhưng tiền bị lệch) */}
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600 font-medium">
                          <span className="flex items-center gap-1">
                            <HiTicket /> Giảm giá:
                          </span>
                          <span>- {formatCurrency(discount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-lg font-bold text-blue-700 pt-2 border-t border-gray-200">
                        <span>Tổng cộng:</span>
                        <span>{formatCurrency(finalTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-4 flex items-center gap-2">
                    <HiCreditCard className="text-green-500" /> Thông tin thanh
                    toán
                  </h3>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-3 text-sm flex-1">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-500">Phương thức</span>
                        <span className="font-bold text-gray-800">
                          {order.paymentMethod === "COD"
                            ? "Thanh toán khi nhận (COD)"
                            : "Chuyển khoản ngân hàng"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-500">Trạng thái</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            order.paymentStatus === "PAID"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.paymentStatus === "PAID"
                            ? "ĐÃ THANH TOÁN"
                            : "CHƯA THANH TOÁN"}
                        </span>
                      </div>
                      {order.transactionId && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <span className="text-gray-500">Mã giao dịch</span>
                          <span className="font-mono font-bold text-gray-800">
                            {order.transactionId}
                          </span>
                        </div>
                      )}
                    </div>
                    {order.paymentMethod === "BANK_TRANSFER" &&
                      order.paymentStatus === "UNPAID" &&
                      order.paymentUrl && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col items-center text-center w-full md:w-auto">
                          <p className="text-xs font-bold text-yellow-800 mb-2 uppercase tracking-wide">
                            Quét mã QR để thanh toán
                          </p>
                          <div className="bg-white p-2 rounded-lg shadow-sm">
                            <img
                              src={order.paymentUrl}
                              alt="QR Code"
                              className="w-32 h-32 object-contain"
                            />
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export default function Transactions() {
  const {
    orders,
    loading,
    totalPages,
    totalElements,
    fetchOrders,
    getOrderDetail,
    updateOrderStatus,
  } = useOrderManagement();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(
      () =>
        fetchOrders(page, { search, status: statusFilter, startDate, endDate }),
      300
    );
    return () => clearTimeout(timer);
  }, [page, search, statusFilter, startDate, endDate, fetchOrders]);

  // Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableRows = [];

    // 1. Tính toán tổng quan để hiển thị
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const dateNow = new Date();
    const exportDateStr = `Ngày xuất: ${dateNow.getHours()}:${dateNow.getMinutes()} - ${dateNow.getDate()}/${
      dateNow.getMonth() + 1
    }/${dateNow.getFullYear()}`;

    // 2. Định nghĩa cột cho bảng
    const tableColumn = [
      "STT",
      "Mã Đơn",
      "Khách Hàng",
      "Ngày Đặt",
      "Tổng Tiền",
      "Trạng Thái",
      "TT Thanh Toán",
    ];

    // 3. Map dữ liệu vào row
    orders.forEach((order, index) => {
      const orderData = [
        index + 1,
        order.id,
        order.customer,
        formatDate(order.date),
        formatCurrency(order.total).replace("₫", "").trim(), // Bỏ ký tự đ để tránh lỗi font nếu chưa cài font việt
        order.status,
        order.paymentStatus,
      ];
      tableRows.push(orderData);
    });

    // --- BẮT ĐẦU VẼ GIAO DIỆN PDF ---

    // A. Header Background (Màu xanh dương giống ảnh)
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(0, 0, 210, 50, "F"); // Hình chữ nhật full chiều rộng

    // B. Tiêu đề báo cáo (Màu trắng)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("BÁO CÁO ĐƠN HÀNG", 105, 20, { align: "center" });

    // C. Ngày xuất báo cáo (Màu trắng, nhỏ hơn)
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(exportDateStr, 105, 30, { align: "center" });

    // D. Thông tin tóm tắt (Box thống kê bên dưới Header)
    doc.setTextColor(0, 0, 0); // Quay lại màu đen
    doc.setFontSize(11);

    // Vị trí bắt đầu phần body
    let yPos = 60;

    // Hiển thị thông tin lọc (nếu có)
    if (startDate && endDate) {
      doc.text(
        `Phạm vi báo cáo: Từ ${formatDate(startDate)} đến ${formatDate(
          endDate
        )}`,
        14,
        yPos
      );
      yPos += 7;
    }

    // Hiển thị Tổng quan (In đậm)
    doc.setFont("helvetica", "bold");
    doc.text(`Tổng số đơn hàng: ${totalOrders}`, 14, yPos);

    // Hiển thị tổng doanh thu bên phải
    doc.text(
      `Tổng doanh thu: ${formatCurrency(totalRevenue).replace("₫", "VND")}`,
      196,
      yPos,
      { align: "right" }
    );

    // E. Vẽ Bảng
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: yPos + 10, // Cách phần thống kê 10 đơn vị
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        font: "helvetica", // Lưu ý: Cần add font tiếng Việt nếu muốn hiển thị chính xác dấu
        textColor: [50, 50, 50],
      },
      headStyles: {
        fillColor: [37, 99, 235], // Màu header bảng trùng màu header trang
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 15 }, // STT
        1: { fontStyle: "bold" }, // Mã đơn
        4: { halign: "right" }, // Tổng tiền căn phải
        5: { halign: "center" }, // Trạng thái căn giữa
        6: { halign: "center" }, // Thanh toán căn giữa
      },
      alternateRowStyles: {
        fillColor: [240, 249, 255], // Màu xen kẽ xanh nhạt
      },
      // F. Footer (Số trang)
      didDrawPage: function (data) {
        // Số trang ở góc dưới
        const str = "Trang " + doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(str, 200, 290, { align: "right" });

        // Footer text
        doc.text("Petopia Management System", 14, 290);
      },
    });

    // Lưu file
    const fileName = `Bao_Cao_${dateNow.getDate()}${
      dateNow.getMonth() + 1
    }${dateNow.getFullYear()}_${dateNow.getHours()}h${dateNow.getMinutes()}.pdf`;
    doc.save(fileName);
    toast.success("Xuất báo cáo thành công!");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg">
            <HiShoppingCart className="text-white text-3xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Giao Dịch & Đơn Hàng
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý {totalElements} đơn hàng trong hệ thống
            </p>
          </div>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-xl text-sm font-semibold"
        >
          <FaFilePdf className="text-lg" /> Xuất Báo Cáo
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-1/3">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Tìm mã đơn, tên khách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 focus:bg-white"
          />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto bg-gray-50 p-1.5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 px-2">
            <HiCalendar className="text-gray-400 text-lg" />
            <span className="text-sm font-medium text-gray-600 hidden sm:inline">
              Lọc ngày:
            </span>
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
          />
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full"
            >
              <HiX />
            </button>
          )}
        </div>
        <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <div className="flex gap-2">
            {[
              "All",
              "PENDING",
              "CONFIRMED",
              "SHIPPED",
              "DELIVERED",
              "CANCELLED",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status === "All" ? "Tất cả" : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-h-[400px]">
        {loading && (
          <div className="p-10 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        )}
        {!loading && (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase text-xs">
                  Mã Đơn
                </th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase text-xs">
                  Khách Hàng
                </th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase text-xs">
                  Ngày Tạo
                </th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase text-xs">
                  Tổng Tiền
                </th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase text-xs">
                  Trạng Thái
                </th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase text-xs">
                  Thanh Toán
                </th>
                <th className="px-6 py-4 text-right font-bold text-gray-700 uppercase text-xs">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length > 0 ? (
                orders.map((order) => {
                  const StatusIcon = statusIcons[order.status] || HiClock;
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-blue-600 font-bold">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {order.customer}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.itemsCount} sản phẩm
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                            statusColors[order.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <StatusIcon className="text-sm" /> {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            order.paymentStatus === "PAID"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {order.paymentMethod}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className="p-2 bg-white border border-gray-200 text-gray-600 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
                        >
                          <HiEye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 bg-white border rounded-lg shadow-sm disabled:opacity-50"
          >
            <HiChevronLeft />
          </button>
          <span className="text-sm font-bold py-2 text-gray-600">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 bg-white border rounded-lg shadow-sm disabled:opacity-50"
          >
            <HiChevronRight />
          </button>
        </div>
      )}

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedOrderId && (
          <OrderDetailModal
            orderId={selectedOrderId}
            onClose={() => setSelectedOrderId(null)}
            getDetail={getOrderDetail}
            updateStatus={updateOrderStatus}
            onRefresh={() =>
              fetchOrders(page, {
                search,
                status: statusFilter,
                startDate,
                endDate,
              })
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
