// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   HiPlus,
//   HiCog,
//   HiPencil,
//   HiTrash,
//   HiChevronDown,
//   HiX,
//   HiMail,
//   HiCalendar,
//   HiClock,
//   HiCheck,
// } from "react-icons/hi";
// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaSyringe,
//   FaStar,
//   FaReply,
//   FaThumbtack,
//   FaEdit,
//   FaHeart, // Added for like functionality
// } from "react-icons/fa";

// // Fake dữ liệu 25 thú cưng
// const breeds = [
//   "Golden Retriever",
//   "Persian Cat",
//   "Poodle",
//   "Siamese Cat",
//   "Bulldog",
//   "Maine Coon",
// ];
// const categories = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Fish"];
// const names = [
//   "Max",
//   "Luna",
//   "Charlie",
//   "Bella",
//   "Cooper",
//   "Lucy",
//   "Milo",
//   "Daisy",
//   "Rocky",
//   "Molly",
//   "Buddy",
//   "Sadie",
// ];

// const generatePet = (id) => ({
//   id,
//   name: names[id % names.length] + ` #${id}`,
//   breed: breeds[id % breeds.length],
//   category: categories[id % categories.length],
//   price: `$${(Math.random() * 1000 + 100).toFixed(0)}`,
//   stock: Math.floor(Math.random() * 50),
//   total_sales: Math.floor(Math.random() * 200),
//   status: id % 3 === 0 ? "DRAFT" : id % 3 === 1 ? "PUBLISHED" : "HIDDEN",
//   images: Array(4).fill("https://via.placeholder.com/200"),
//   details: `Detailed description for pet ${id}, friendly and well-trained.`,
//   colors: ["#8b5cf6", "#6366f1", "#3b82f6", "#ec4899", "#34d399"],
//   email: `customer${id}@example.com`,
// });

// const allPets = Array.from({ length: 25 }, (_, i) => generatePet(i + 1));

// // Fake dữ liệu dịch vụ
// const serviceTypes = [
//   "Grooming",
//   "Training",
//   "Veterinary",
//   "Boarding",
//   "Walking",
// ];
// const serviceDescriptions = [
//   "Professional pet grooming service",
//   "Expert training for your pets",
//   "Complete veterinary care",
//   "Safe and comfortable boarding",
//   "Daily walking service",
// ];

// const generateService = (id) => ({
//   id: `S${String(id).padStart(3, "0")}`,
//   name: `${serviceTypes[id % serviceTypes.length]} Service #${id}`,
//   description:
//     serviceDescriptions[id % serviceDescriptions.length] + ` - Package ${id}`,
//   price: `$${(Math.random() * 200 + 50).toFixed(0)}`,
//   duration: `${Math.floor(Math.random() * 3 + 1)} hours`,
//   status: id % 3 === 0 ? "ACTIVE" : id % 3 === 1 ? "INACTIVE" : "PENDING",
// });

// const allServices = Array.from({ length: 30 }, (_, i) =>
//   generateService(i + 1)
// );

// const generateVaccinationSchedule = (petId) => {
//   const schedules = [];
//   const vaccineTypes = [
//     "Rabies",
//     "Distemper",
//     "Parvovirus",
//     "Hepatitis",
//     "Bordetella",
//   ];
//   const statuses = ["scheduled", "completed", "waiting", "just-completed"];
//   const randomCount = Math.floor(Math.random() * 3);
//   for (let i = 0; i < randomCount; i++) {
//     const futureDate = new Date();
//     futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 60));
//     schedules.push({
//       id: `V${petId}-${i + 1}`,
//       petId,
//       vaccineType: vaccineTypes[i % vaccineTypes.length],
//       dates: [futureDate],
//       time: `${Math.floor(Math.random() * 12) + 8}:${
//         Math.random() > 0.5 ? "00" : "30"
//       }`,
//       status: statuses[Math.floor(Math.random() * statuses.length)],
//       notes: `Vaccination appointment for ${
//         vaccineTypes[i % vaccineTypes.length]
//       }`,
//     });
//   }
//   return schedules;
// };

// const allVaccinationSchedules = allPets.flatMap((pet) =>
//   generateVaccinationSchedule(pet.id)
// );

// const generateReviews = (petId) => {
//   const reviewCount = Math.floor(Math.random() * 8) + 1;
//   const reviews = [];
//   const customerNames = [
//     "Nguyễn An",
//     "Trần Bình",
//     "Lê Cường",
//     "Phạm Dung",
//     "Hoàng Minh",
//     "Võ Lan",
//   ];
//   const reviewTexts = [
//     "Thú cưng rất đáng yêu và khỏe mạnh!",
//     "Dịch vụ tuyệt vời, nhân viên nhiệt tình",
//     "Rất hài lòng với chất lượng chăm sóc",
//     "Thú cưng của tôi rất thích ở đây",
//     "Giá cả hợp lý, dịch vụ chuyên nghiệp",
//     "Sẽ quay lại lần sau",
//   ];

//   for (let i = 0; i < reviewCount; i++) {
//     const review = {
//       id: `R${petId}-${i + 1}`,
//       petId,
//       customerName: customerNames[i % customerNames.length],
//       rating: Math.floor(Math.random() * 2) + 4,
//       comment: reviewTexts[i % reviewTexts.length],
//       date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
//       isPinned: i === 0 && Math.random() > 0.5,
//       adminReply:
//         i % 3 === 0
//           ? {
//               text: "Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!",
//               date: new Date(
//                 Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000
//               ),
//             }
//           : null,
//       // Added 'liked' and 'likes' for review likes functionality
//       liked: Math.random() > 0.7,
//       likes: Math.floor(Math.random() * 100),
//     };
//     reviews.push(review);
//   }
//   return reviews.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
// };

// const allReviews = allPets.flatMap((pet) => generateReviews(pet.id));

// export default function PetServiceManagement() {
//   const [activeTab, setActiveTab] = useState("pets");
//   const [selectedPets, setSelectedPets] = useState([]);
//   const [selectedServices, setSelectedServices] = useState([]);
//   // vaccination-specific state
//   const [selectedVaccinationPets, setSelectedVaccinationPets] = useState([]);
//   const [vaccinationSchedules, setVaccinationSchedules] = useState(
//     allVaccinationSchedules
//   );
//   const [showVaccinationModal, setShowVaccinationModal] = useState(false);
//   const [vaccinationModalMode, setVaccinationModalMode] = useState("add");
//   const [currentVaccinationPet, setCurrentVaccinationPet] = useState(null);
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [selectedTime, setSelectedTime] = useState("09:00");
//   const [vaccineType, setVaccineType] = useState("");
//   const [vaccineNotes, setVaccineNotes] = useState("");
//   const [showBulkScheduleModal, setShowBulkScheduleModal] = useState(false);
//   const [bulkScheduleStep, setBulkScheduleStep] = useState(1);
//   const [hoveredPetId, setHoveredPetId] = useState(null);

//   const [vaccinationSearch, setVaccinationSearch] = useState("");
//   const [vaccinationStatusFilter, setVaccinationStatusFilter] = useState("all");
//   const [vaccinationDateFrom, setVaccinationDateFrom] = useState("");
//   const [vaccinationDateTo, setVaccinationDateTo] = useState("");

//   const [reviewPetSearch, setReviewPetSearch] = useState("");
//   const [reviewStatusFilter, setReviewStatusFilter] = useState("all"); // all, reviewed, unreviewed
//   const [reviewPage, setReviewPage] = useState(1);
//   const reviewsPerPage = 5;

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState("add"); // Added: modalMode state
//   const [expandedItems, setExpandedItems] = useState({});
//   const [page, setPage] = useState(1);
//   const perPage = 10;

//   // Email notification state
//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const [emailContent, setEmailContent] = useState("");

//   const [filters, setFilters] = useState({
//     search: "",
//     breed: "",
//     category: "",
//     price: "",
//   });

//   const [serviceFilters, setServiceFilters] = useState({
//     search: "",
//     type: "",
//     status: "",
//   });

//   const [columnsVisible, setColumnsVisible] = useState({
//     category: true,
//     breed: true,
//     price: true,
//     stock: true,
//     total_sales: true,
//     status: true,
//   });

//   const [serviceColumnsVisible, setServiceColumnsVisible] = useState({
//     description: true,
//     price: true,
//     duration: true,
//     status: true,
//   });

//   const [editedItem, setEditedItem] = useState(null);
//   const [newImages, setNewImages] = useState([]);
//   const [newPet, setNewPet] = useState({
//     name: "",
//     category: "",
//     breed: "",
//     price: "",
//     weight: "",
//     length: "",
//     breadth: "",
//     width: "",
//     details: "",
//     email: "",
//   });

//   const [newService, setNewService] = useState({
//     name: "",
//     description: "",
//     price: "",
//     duration: "",
//     status: "ACTIVE",
//   });

//   const [reviews, setReviews] = useState(allReviews);
//   const [selectedPetForReviews, setSelectedPetForReviews] = useState(null);
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [replyText, setReplyText] = useState("");
//   const [editingReplyId, setEditingReplyId] = useState(null);

//   // Quản lý scroll của body khi modal mở/đóng
//   useEffect(() => {
//     if (
//       modalOpen ||
//       showEmailModal ||
//       showVaccinationModal ||
//       showBulkScheduleModal ||
//       showReviewModal
//     ) {
//       const scrollY = window.scrollY;
//       document.body.style.position = "fixed";
//       document.body.style.top = `-${scrollY}px`;
//       document.body.style.width = "100%";
//       document.body.style.overflow = "hidden";
//     } else {
//       const scrollY = document.body.style.top;
//       document.body.style.position = "";
//       document.body.style.top = "";
//       document.body.style.width = "";
//       document.body.style.overflow = "";
//       if (scrollY) {
//         window.scrollTo(0, Number.parseInt(scrollY || "0") * -1);
//       }
//     }

//     return () => {
//       document.body.style.position = "";
//       document.body.style.top = "";
//       document.body.style.width = "";
//       document.body.style.overflow = "";
//     };
//   }, [
//     modalOpen,
//     showEmailModal,
//     showVaccinationModal,
//     showBulkScheduleModal,
//     showReviewModal,
//   ]);

//   // Lọc thú cưng
//   const filteredPets = allPets.filter((p) => {
//     const priceVal = Number.parseInt(p.price.replace("$", "")) || 0;
//     return (
//       p.name.toLowerCase().includes(filters.search.toLowerCase()) &&
//       (!filters.breed || p.breed === filters.breed) &&
//       (!filters.category || p.category === filters.category) &&
//       (!filters.price ||
//         (filters.price === "under-500" && priceVal < 500) ||
//         (filters.price === "over-500" && priceVal >= 500))
//     );
//   });

//   // Lọc dịch vụ
//   const filteredServices = allServices.filter((s) => {
//     return (
//       s.name.toLowerCase().includes(serviceFilters.search.toLowerCase()) &&
//       (!serviceFilters.type || s.name.includes(serviceFilters.type)) &&
//       (!serviceFilters.status || s.status === serviceFilters.status)
//     );
//   });

//   // Lọc lịch tiêm
//   const filteredVaccinationSchedules = vaccinationSchedules.filter((s) => {
//     const pet = allPets.find((p) => p.id === s.petId);
//     const petName = pet ? pet.name.toLowerCase() : "";
//     const vaccineTypeMatch =
//       !vaccineType ||
//       s.vaccineType.toLowerCase().includes(vaccineType.toLowerCase());
//     const statusMatch =
//       vaccinationStatusFilter === "all" || s.status === vaccinationStatusFilter;
//     const dateFromMatch =
//       !vaccinationDateFrom ||
//       new Date(s.dates[0]) >= new Date(vaccinationDateFrom);
//     const dateToMatch =
//       !vaccinationDateTo || new Date(s.dates[0]) <= new Date(vaccinationDateTo);

//     return (
//       petName.includes(vaccinationSearch.toLowerCase()) &&
//       vaccineTypeMatch &&
//       statusMatch &&
//       dateFromMatch &&
//       dateToMatch
//     );
//   });

//   // Phân trang
//   const getPetReviews = (petId) => {
//     return reviews.filter((r) => r.petId === petId);
//   };

//   const currentData =
//     activeTab === "pets"
//       ? filteredPets
//       : activeTab === "services"
//       ? filteredServices
//       : activeTab === "vaccination"
//       ? filteredVaccinationSchedules
//       : getPetReviews(selectedPetForReviews?.id || -1);
//   const totalPages = Math.ceil(currentData.length / perPage);
//   const paginatedData = currentData.slice((page - 1) * perPage, page * perPage);

//   const handleFilterChange = (key, value) => {
//     if (activeTab === "pets") {
//       setFilters((prev) => ({ ...prev, [key]: value }));
//     } else if (activeTab === "services") {
//       setServiceFilters((prev) => ({ ...prev, [key]: value }));
//     } else if (activeTab === "vaccination") {
//       if (key === "search") setVaccinationSearch(value);
//       else if (key === "status") setVaccinationStatusFilter(value);
//       else if (key === "dateFrom") setVaccinationDateFrom(value);
//       else if (key === "dateTo") setVaccinationDateTo(value);
//     } else if (activeTab === "reviews") {
//       if (key === "search") setReviewPetSearch(value);
//       else if (key === "status") setReviewStatusFilter(value);
//     }
//     setPage(1);
//     setReviewPage(1); // Reset review pagination when filters change
//   };

//   const handleSelectItem = (id) => {
//     if (activeTab === "pets") {
//       setSelectedPets((prev) =>
//         prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//       );
//     } else if (activeTab === "services") {
//       setSelectedServices((prev) =>
//         prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//       );
//     } else if (activeTab === "vaccination") {
//       setSelectedVaccinationPets((prev) =>
//         prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//       );
//     }
//   };

//   const handleSelectAll = (e) => {
//     if (activeTab === "pets") {
//       if (e.target.checked) {
//         setSelectedPets([
//           ...new Set([...selectedPets, ...paginatedData.map((p) => p.id)]),
//         ]);
//       } else {
//         setSelectedPets((prev) =>
//           prev.filter((id) => !paginatedData.some((p) => p.id === id))
//         );
//       }
//     } else if (activeTab === "services") {
//       if (e.target.checked) {
//         setSelectedServices([
//           ...new Set([...selectedServices, ...paginatedData.map((s) => s.id)]),
//         ]);
//       } else {
//         setSelectedServices((prev) =>
//           prev.filter((id) => !paginatedData.some((s) => s.id === id))
//         );
//       }
//     } else if (activeTab === "vaccination") {
//       if (e.target.checked) {
//         setSelectedVaccinationPets([
//           ...new Set([
//             ...selectedVaccinationPets,
//             ...paginatedData.map((p) => p.id),
//           ]),
//         ]);
//       } else {
//         setSelectedVaccinationPets((prev) =>
//           prev.filter((id) => !paginatedData.some((p) => p.id === id))
//         );
//       }
//     }
//   };

//   const toggleExpand = (id) => {
//     setExpandedItems((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const handleUpdateItem = (e) => {
//     e.preventDefault();
//     console.log("Updated Item:", editedItem);
//     setModalOpen(false);
//     setNewImages([]);
//   };

//   const handleDeleteItem = (id) => {
//     console.log("Deleted Item ID:", id);
//   };

//   const handleAddItem = (e) => {
//     e.preventDefault();
//     if (activeTab === "pets") {
//       console.log("New Pet:", { ...newPet, images: newImages });
//       setNewPet({
//         name: "",
//         category: "",
//         breed: "",
//         price: "",
//         weight: "",
//         length: "",
//         breadth: "",
//         width: "",
//         details: "",
//         email: "",
//       });
//     } else {
//       console.log("New Service:", newService);
//       setNewService({
//         name: "",
//         description: "",
//         price: "",
//         duration: "",
//         status: "ACTIVE",
//       });
//     }
//     setModalOpen(false);
//     setNewImages([]);
//   };

//   const handleItemChange = (e) => {
//     const { name, value } = e.target;
//     if (modalMode === "edit") {
//       setEditedItem((prev) => ({ ...prev, [name]: value }));
//     } else {
//       if (activeTab === "pets") {
//         setNewPet((prev) => ({ ...prev, [name]: value }));
//       } else {
//         setNewService((prev) => ({ ...prev, [name]: value }));
//       }
//     }
//   };

//   const handleSendEmail = () => {
//     if (selectedPets.length === 0) {
//       alert("Vui lòng chọn ít nhất một thú cưng!");
//       return;
//     }
//     setShowEmailModal(true);
//   };

//   const handleConfirmSendEmail = () => {
//     if (!emailContent.trim()) {
//       alert("Vui lòng nhập nội dung thông báo!");
//       return;
//     }

//     const selectedPetData = allPets.filter((p) => selectedPets.includes(p.id));
//     console.log(
//       "Sending email to:",
//       selectedPetData.map((p) => p.email)
//     );
//     console.log("Email content:", emailContent);

//     // Simulate email sending
//     alert(`Đã gửi thông báo đến ${selectedPets.length} khách hàng!`);
//     setShowEmailModal(false);
//     setEmailContent("");
//     setSelectedPets([]);
//   };

//   // vaccination schedule handlers
//   const handleAddVaccination = (pet) => {
//     setCurrentVaccinationPet(pet);
//     setVaccinationModalMode("add");
//     setSelectedDates([]);
//     setSelectedTime("09:00");
//     setVaccineType("");
//     setVaccineNotes("");
//     setShowVaccinationModal(true);
//   };

//   const handleEditVaccination = (pet, schedule) => {
//     setCurrentVaccinationPet(pet);
//     setVaccinationModalMode("edit");
//     setSelectedDates(schedule.dates);
//     setSelectedTime(schedule.time);
//     setVaccineType(schedule.vaccineType);
//     setVaccineNotes(schedule.notes);
//     setShowVaccinationModal(true);
//   };

//   const handleDeleteVaccination = (scheduleId) => {
//     setVaccinationSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
//     alert("Đã hủy lịch tiêm!");
//   };

//   const handleSaveVaccination = () => {
//     if (selectedDates.length === 0 || !vaccineType) {
//       alert("Vui lòng chọn ngày và loại vaccine!");
//       return;
//     }

//     if (vaccinationModalMode === "add") {
//       const newSchedule = {
//         id: `V${currentVaccinationPet.id}-${Date.now()}`,
//         petId: currentVaccinationPet.id,
//         vaccineType,
//         dates: selectedDates,
//         time: selectedTime,
//         status: "scheduled",
//         notes: vaccineNotes,
//       };
//       setVaccinationSchedules((prev) => [...prev, newSchedule]);
//       alert("Đã thêm lịch tiêm thành công!");
//     } else {
//       // Placeholder for actual edit logic if needed
//       alert("Đã cập nhật lịch tiêm thành công!");
//     }

//     setShowVaccinationModal(false);
//   };

//   const handleBulkSchedule = () => {
//     if (selectedVaccinationPets.length === 0) {
//       alert("Vui lòng chọn ít nhất một thú cưng!");
//       return;
//     }
//     setBulkScheduleStep(1);
//     setShowBulkScheduleModal(true);
//   };

//   const handleBulkScheduleNext = () => {
//     if (bulkScheduleStep === 1) {
//       if (selectedDates.length === 0 || !vaccineType) {
//         alert("Vui lòng chọn ngày và loại vaccine!");
//         return;
//       }
//       setBulkScheduleStep(2);
//     } else {
//       // Step 2: Send email
//       if (!emailContent.trim()) {
//         alert("Vui lòng nhập nội dung thông báo!");
//         return;
//       }

//       // Save schedules
//       selectedVaccinationPets.forEach((petId) => {
//         const newSchedule = {
//           id: `V${petId}-${Date.now()}`,
//           petId,
//           vaccineType,
//           dates: selectedDates,
//           time: selectedTime,
//           status: "scheduled",
//           notes: vaccineNotes,
//         };
//         setVaccinationSchedules((prev) => [...prev, newSchedule]);
//       });

//       const selectedPetData = allPets.filter((p) =>
//         selectedVaccinationPets.includes(p.id)
//       );
//       console.log(
//         "Sending vaccination email to:",
//         selectedPetData.map((p) => p.email)
//       );
//       console.log("Email content:", emailContent);

//       alert(
//         `Đã lên lịch tiêm và gửi thông báo đến ${selectedVaccinationPets.length} khách hàng!`
//       );
//       setShowBulkScheduleModal(false);
//       setSelectedVaccinationPets([]);
//       setEmailContent("");
//       setSelectedDates([]);
//       setVaccineType("");
//       setVaccineNotes("");
//     }
//   };

//   const handleDateSelect = (date) => {
//     const dateStr = date.toDateString();
//     setSelectedDates((prev) => {
//       const exists = prev.some((d) => d.toDateString() === dateStr);
//       if (exists) {
//         return prev.filter((d) => d.toDateString() !== dateStr);
//       } else {
//         return [...prev, date].sort((a, b) => a - b);
//       }
//     });
//   };

//   const handleDateRangeSelect = (startDate, endDate) => {
//     const dates = [];
//     const current = new Date(startDate);
//     while (current <= endDate) {
//       dates.push(new Date(current));
//       current.setDate(current.getDate() + 1);
//     }
//     setSelectedDates(dates);
//   };

//   const getPetSchedules = (petId) => {
//     return vaccinationSchedules.filter((s) => s.petId === petId);
//   };

//   const handlePinReview = (reviewId) => {
//     setReviews((prev) =>
//       prev.map((r) => (r.id === reviewId ? { ...r, isPinned: !r.isPinned } : r))
//     );
//   };

//   const handleLikeReview = (reviewId) => {
//     setReviews((prev) =>
//       prev.map((r) =>
//         r.id === reviewId
//           ? {
//               ...r,
//               liked: !r.liked,
//               likes: (r.likes || 0) + (r.liked ? -1 : 1),
//             }
//           : r
//       )
//     );
//   };

//   const handleDeleteReview = (reviewId) => {
//     if (confirm("Bạn có chắc muốn xóa đánh giá này?")) {
//       setReviews((prev) => prev.filter((r) => r.id !== reviewId));
//     }
//   };

//   const handleAddReply = (reviewId) => {
//     if (!replyText.trim()) {
//       alert("Vui lòng nhập nội dung trả lời!");
//       return;
//     }
//     setReviews((prev) =>
//       prev.map((r) =>
//         r.id === reviewId
//           ? { ...r, adminReply: { text: replyText, date: new Date() } }
//           : r
//       )
//     );
//     setReplyText("");
//     setEditingReplyId(null);
//   };

//   const handleEditReply = (reviewId, newText) => {
//     setReviews((prev) =>
//       prev.map((r) =>
//         r.id === reviewId && r.adminReply
//           ? { ...r, adminReply: { ...r.adminReply, text: newText } }
//           : r
//       )
//     );
//     setEditingReplyId(null);
//   };

//   const handleDeleteReply = (reviewId) => {
//     if (confirm("Bạn có chắc muốn xóa phản hồi này?")) {
//       setReviews((prev) =>
//         prev.map((r) => (r.id === reviewId ? { ...r, adminReply: null } : r))
//       );
//     }
//   };

//   const petStats = [
//     {
//       title: "Tổng Thú Cưng",
//       value: allPets.reduce((a, b) => a + b.stock, 0),
//       icon: "🐾",
//       gradient: "from-slate-50 to-slate-100",
//       textColor: "text-slate-700",
//       iconBg: "bg-slate-200",
//     },
//     {
//       title: "Thú Cưng Mới",
//       value: allPets.length,
//       icon: "✨",
//       gradient: "from-blue-50 to-blue-100",
//       textColor: "text-blue-700",
//       iconBg: "bg-blue-200",
//     },
//     {
//       title: "Đã Bán",
//       value: allPets.reduce((a, b) => a + b.total_sales, 0),
//       icon: "💰",
//       gradient: "from-green-50 to-green-100",
//       textColor: "text-green-700",
//       iconBg: "bg-green-200",
//     },
//     {
//       title: "Đang Chờ",
//       value: Math.floor(allPets.length * 0.1),
//       icon: "⏳",
//       gradient: "from-amber-50 to-amber-100",
//       textColor: "text-amber-700",
//       iconBg: "bg-amber-200",
//     },
//   ];

//   const serviceStats = [
//     {
//       title: "Tổng Dịch Vụ",
//       value: allServices.length,
//       icon: "🛠️",
//       gradient: "from-slate-50 to-slate-100",
//       textColor: "text-slate-700",
//       iconBg: "bg-slate-200",
//     },
//     {
//       title: "Đang Hoạt Động",
//       value: allServices.filter((s) => s.status === "ACTIVE").length,
//       icon: "✅",
//       gradient: "from-green-50 to-green-100",
//       textColor: "text-green-700",
//       iconBg: "bg-green-200",
//     },
//     {
//       title: "Tạm Ngưng",
//       value: allServices.filter((s) => s.status === "INACTIVE").length,
//       icon: "⏸️",
//       gradient: "from-red-50 to-red-100",
//       textColor: "text-red-700",
//       iconBg: "bg-red-200",
//     },
//     {
//       title: "Chờ Duyệt",
//       value: allServices.filter((s) => s.status === "PENDING").length,
//       icon: "⏳",
//       gradient: "from-amber-50 to-amber-100",
//       textColor: "text-amber-700",
//       iconBg: "bg-amber-200",
//     },
//   ];

//   const vaccinationStats = [
//     {
//       title: "Tổng Lịch Tiêm",
//       value: vaccinationSchedules.length,
//       icon: "💉",
//       gradient: "from-purple-50 to-purple-100",
//       textColor: "text-purple-700",
//       iconBg: "bg-purple-200",
//     },
//     {
//       title: "Sắp Tới",
//       value: vaccinationSchedules.filter((s) => s.status === "scheduled")
//         .length,
//       icon: "📅",
//       gradient: "from-blue-50 to-blue-100",
//       textColor: "text-blue-700",
//       iconBg: "bg-blue-200",
//     },
//     {
//       title: "Đã Hoàn Thành",
//       value: vaccinationSchedules.filter((s) => s.status === "completed")
//         .length,
//       icon: "✅",
//       gradient: "from-green-50 to-green-100",
//       textColor: "text-green-700",
//       iconBg: "bg-green-200",
//     },
//     {
//       title: "Thú Cưng Cần Tiêm",
//       value: new Set(vaccinationSchedules.map((s) => s.petId)).size,
//       icon: "🐕",
//       gradient: "from-amber-50 to-amber-100",
//       textColor: "text-amber-700",
//       iconBg: "bg-amber-200",
//     },
//   ];

//   // Added review stats
//   const reviewStats = [
//     {
//       title: "Tổng Đánh Giá",
//       value: reviews.length,
//       icon: "⭐",
//       gradient: "from-yellow-50 to-amber-100",
//       textColor: "text-yellow-700",
//       iconBg: "bg-yellow-200",
//     },
//     {
//       title: "Đánh Giá 5 Sao",
//       value: reviews.filter((r) => r.rating === 5).length,
//       icon: "🌟",
//       gradient: "from-green-50 to-green-100",
//       textColor: "text-green-700",
//       iconBg: "bg-green-200",
//     },
//     {
//       title: "Đã Ghim",
//       value: reviews.filter((r) => r.isPinned).length,
//       icon: "📌",
//       gradient: "from-blue-50 to-blue-100",
//       textColor: "text-blue-700",
//       iconBg: "bg-blue-200",
//     },
//     {
//       title: "Đã Trả Lời",
//       value: reviews.filter((r) => r.adminReply).length,
//       icon: "💬",
//       gradient: "from-purple-50 to-purple-100",
//       textColor: "text-purple-700",
//       iconBg: "bg-purple-200",
//     },
//   ];

//   const stats =
//     activeTab === "pets"
//       ? petStats
//       : activeTab === "services"
//       ? serviceStats
//       : activeTab === "vaccination"
//       ? vaccinationStats
//       : reviewStats;

//   const Calendar = ({ onDateSelect, selectedDates }) => {
//     const [currentMonth, setCurrentMonth] = useState(new Date());
//     const [rangeStart, setRangeStart] = useState(null);

//     const getDaysInMonth = (date) => {
//       const year = date.getFullYear();
//       const month = date.getMonth();
//       const firstDay = new Date(year, month, 1);
//       const lastDay = new Date(year, month + 1, 0);
//       const daysInMonth = lastDay.getDate();
//       const startingDayOfWeek = firstDay.getDay();

//       const days = [];
//       for (let i = 0; i < startingDayOfWeek; i++) {
//         days.push(null);
//       }
//       for (let i = 1; i <= daysInMonth; i++) {
//         days.push(new Date(year, month, i));
//       }
//       return days;
//     };

//     const days = getDaysInMonth(currentMonth);
//     const monthNames = [
//       "Tháng 1",
//       "Tháng 2",
//       "Tháng 3",
//       "Tháng 4",
//       "Tháng 5",
//       "Tháng 6",
//       "Tháng 7",
//       "Tháng 8",
//       "Tháng 9",
//       "Tháng 10",
//       "Tháng 11",
//       "Tháng 12",
//     ];

//     const isSelected = (date) => {
//       if (!date) return false;
//       return selectedDates.some(
//         (d) => d.toDateString() === date.toDateString()
//       );
//     };

//     const handleDayClick = (date) => {
//       if (!date) return;
//       if (rangeStart && date > rangeStart) {
//         handleDateRangeSelect(rangeStart, date);
//         setRangeStart(null);
//       } else {
//         setRangeStart(date);
//         onDateSelect(date);
//       }
//     };

//     return (
//       <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
//         <div className="flex justify-between items-center mb-4">
//           <button
//             onClick={() =>
//               setCurrentMonth(
//                 new Date(
//                   currentMonth.getFullYear(),
//                   currentMonth.getMonth() - 1
//                 )
//               )
//             }
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <FaChevronLeft className="text-gray-600" />
//           </button>
//           <h3 className="text-lg font-bold text-gray-800">
//             {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
//           </h3>
//           <button
//             onClick={() =>
//               setCurrentMonth(
//                 new Date(
//                   currentMonth.getFullYear(),
//                   currentMonth.getMonth() + 1
//                 )
//               )
//             }
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <FaChevronRight className="text-gray-600" />
//           </button>
//         </div>

//         <div className="grid grid-cols-7 gap-2 mb-2">
//           {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
//             <div
//               key={day}
//               className="text-center text-sm font-semibold text-gray-600 py-2"
//             >
//               {day}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-7 gap-2">
//           {days.map((date, index) => (
//             <button
//               key={index}
//               onClick={() => handleDayClick(date)}
//               disabled={!date || date < new Date().setHours(0, 0, 0, 0)}
//               className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
//                 !date
//                   ? "invisible"
//                   : date < new Date().setHours(0, 0, 0, 0)
//                   ? "text-gray-300 cursor-not-allowed"
//                   : isSelected(date)
//                   ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-105"
//                   : "hover:bg-purple-100 text-gray-700 hover:scale-105"
//               }`}
//             >
//               {date ? date.getDate() : ""}
//             </button>
//           ))}
//         </div>

//         <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
//           <p className="font-semibold mb-1">💡 Hướng dẫn:</p>
//           <p>• Click vào ngày để chọn/bỏ chọn</p>
//           <p>
//             • Click ngày đầu, sau đó click ngày cuối để chọn nhiều ngày liên tục
//           </p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="px-6 py-6 space-y-6 w-full bg-gray-50 min-h-screen">
//       <div className="flex gap-4 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-200">
//         <button
//           onClick={() => {
//             setActiveTab("pets");
//             setPage(1);
//           }}
//           className={`relative flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
//             activeTab === "pets"
//               ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md tab-button-active"
//               : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 tab-button-inactive"
//           }`}
//         >
//           🐾 Thú Cưng
//         </button>
//         <button
//           onClick={() => {
//             setActiveTab("services");
//             setPage(1);
//           }}
//           className={`relative flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
//             activeTab === "services"
//               ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md tab-button-active"
//               : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 tab-button-inactive"
//           }`}
//         >
//           🛠️ Dịch Vụ
//         </button>
//         <button
//           onClick={() => {
//             setActiveTab("vaccination");
//             setPage(1);
//           }}
//           className={`relative flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
//             activeTab === "vaccination"
//               ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md tab-button-active"
//               : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 tab-button-inactive"
//           }`}
//         >
//           💉 Lịch Tiêm Phòng
//         </button>
//         <button
//           onClick={() => {
//             setActiveTab("reviews");
//             setPage(1);
//           }}
//           className={`relative flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
//             activeTab === "reviews"
//               ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md tab-button-active"
//               : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 tab-button-inactive"
//           }`}
//         >
//           ⭐ Đánh Giá
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((s, i) => (
//           <div
//             key={i}
//             className={`bg-gradient-to-br ${s.gradient} shadow-md p-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 transform cursor-pointer border border-gray-200 dark:border-gray-700`}
//           >
//             <div className="flex items-center mb-3">
//               <span
//                 className={`text-3xl mr-3 p-2 rounded-lg ${s.iconBg} bg-opacity-20`}
//               >
//                 {s.icon}
//               </span>
//               <h4 className={`font-semibold ${s.textColor} text-base`}>
//                 {s.title}
//               </h4>
//             </div>
//             <div className={`text-3xl font-bold ${s.textColor}`}>
//               {s.value.toLocaleString()}
//             </div>
//           </div>
//         ))}
//       </div>

//       {activeTab === "reviews" ? (
//         <>
//           <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                   Tìm kiếm thú cưng
//                 </label>
//                 <input
//                   type="text"
//                   value={reviewPetSearch}
//                   onChange={(e) => {
//                     setReviewPetSearch(e.target.value);
//                     setPage(1);
//                   }}
//                   placeholder="Nhập tên thú cưng..."
//                   className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                   Lọc theo trạng thái
//                 </label>
//                 <select
//                   value={reviewStatusFilter}
//                   onChange={(e) => {
//                     setReviewStatusFilter(e.target.value);
//                     setPage(1);
//                   }}
//                   className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all cursor-pointer"
//                 >
//                   <option value="all">Tất cả</option>
//                   <option value="reviewed">Đã đánh giá</option>
//                   <option value="unreviewed">Chưa đánh giá</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {allPets
//               .filter((pet) => {
//                 const petReviews = getPetReviews(pet.id);
//                 const matchesSearch = pet.name
//                   .toLowerCase()
//                   .includes(reviewPetSearch.toLowerCase());
//                 const matchesStatus =
//                   reviewStatusFilter === "all" ||
//                   (reviewStatusFilter === "reviewed" &&
//                     petReviews.length > 0) ||
//                   (reviewStatusFilter === "unreviewed" &&
//                     petReviews.length === 0);
//                 return matchesSearch && matchesStatus;
//               })
//               .slice((page - 1) * perPage, page * perPage)
//               .map((pet) => {
//                 const petReviews = getPetReviews(pet.id);
//                 const avgRating =
//                   petReviews.length > 0
//                     ? (
//                         petReviews.reduce((sum, r) => sum + r.rating, 0) /
//                         petReviews.length
//                       ).toFixed(1)
//                     : 0;

//                 return (
//                   <div
//                     key={pet.id}
//                     onClick={() => {
//                       setSelectedPetForReviews(pet);
//                       setShowReviewModal(true);
//                       setReviewPage(1); // Reset review pagination when opening modal
//                     }}
//                     className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 border-2 border-gray-200 hover:border-yellow-400 hover:scale-105 cursor-pointer group"
//                   >
//                     <div className="relative">
//                       <img
//                         src={
//                           pet.images[0] ||
//                           "/placeholder.svg?height=200&width=200"
//                         }
//                         alt={pet.name}
//                         className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
//                       />
//                       <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
//                         <FaStar className="text-xs" />
//                         {avgRating}
//                       </div>
//                       {petReviews.length > 0 && (
//                         <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-700 flex items-center gap-1">
//                           💬 {petReviews.length}
//                         </div>
//                       )}
//                     </div>

//                     <div className="p-4">
//                       <h3 className="font-bold text-gray-800 text-lg mb-1">
//                         {pet.name}
//                       </h3>
//                       <p className="text-sm text-gray-600 mb-2">
//                         {pet.breed} • {pet.category}
//                       </p>
//                       <div className="flex items-center gap-1 text-yellow-500">
//                         {[...Array(5)].map((_, i) => (
//                           <FaStar
//                             key={i}
//                             className={`text-sm ${
//                               i < Math.round(avgRating)
//                                 ? "fill-current"
//                                 : "text-gray-300"
//                             }`}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>

//           {/* Review Modal */}
//           {showReviewModal && selectedPetForReviews && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn z-50">
//               <div
//                 className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
//                 onClick={() => {
//                   setShowReviewModal(false);
//                   setSelectedPetForReviews(null);
//                   setReplyText("");
//                   setEditingReplyId(null);
//                   setReviewPage(1); // Reset pagination on close
//                 }}
//               ></div>
//               <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl z-50 relative animate-slideUp border border-gray-200 max-h-[90vh] overflow-y-auto">
//                 <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-t-2xl flex justify-between items-center z-10 shadow-lg">
//                   <div>
//                     <h2 className="text-2xl font-bold flex items-center gap-2">
//                       <FaStar className="text-3xl" />
//                       Đánh giá - {selectedPetForReviews.name}
//                     </h2>
//                     <div className="flex items-center gap-4 mt-2">
//                       <p className="text-white/90">
//                         {getPetReviews(selectedPetForReviews.id).length} đánh
//                         giá
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setShowReviewModal(false);
//                       setSelectedPetForReviews(null);
//                       setReplyText("");
//                       setEditingReplyId(null);
//                       setReviewPage(1); // Reset pagination on close
//                     }}
//                     className="text-white hover:bg-white hover:text-yellow-600 rounded-full p-2 transition-all duration-300"
//                   >
//                     <HiX className="text-2xl" />
//                   </button>
//                 </div>

//                 <div className="p-6 space-y-4">
//                   {getPetReviews(selectedPetForReviews.id).length === 0 ? (
//                     <div className="text-center py-12 text-gray-500">
//                       <FaStar className="text-6xl mx-auto mb-4 text-gray-300" />
//                       <p className="text-lg font-semibold">
//                         Chưa có đánh giá nào
//                       </p>
//                       <p className="text-sm">
//                         Hãy là người đầu tiên đánh giá thú cưng này!
//                       </p>
//                     </div>
//                   ) : (
//                     <>
//                       {getPetReviews(selectedPetForReviews.id)
//                         .slice(
//                           (reviewPage - 1) * reviewsPerPage,
//                           reviewPage * reviewsPerPage
//                         )
//                         .map((review) => (
//                           <div
//                             key={review.id}
//                             className={`p-5 rounded-xl border-2 transition-all ${
//                               review.isPinned
//                                 ? "bg-yellow-50 border-yellow-400 shadow-md"
//                                 : "bg-gray-50 border-gray-200 hover:border-gray-300"
//                             }`}
//                           >
//                             <div className="flex justify-between items-start mb-3">
//                               <div className="flex items-center gap-3">
//                                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
//                                   {review.customerName.charAt(0)}
//                                 </div>
//                                 <div>
//                                   <h4 className="font-bold text-gray-800 flex items-center gap-2">
//                                     {review.customerName}
//                                     {review.isPinned && (
//                                       <FaThumbtack className="text-yellow-600 text-sm" />
//                                     )}
//                                   </h4>
//                                   <div className="flex items-center gap-2">
//                                     <div className="flex items-center gap-1 text-yellow-500">
//                                       {[...Array(5)].map((_, i) => (
//                                         <FaStar
//                                           key={i}
//                                           className={`text-xs ${
//                                             i < review.rating
//                                               ? "fill-current"
//                                               : "text-gray-300"
//                                           }`}
//                                         />
//                                       ))}
//                                     </div>
//                                     <span className="text-xs text-gray-500">
//                                       {review.date.toLocaleDateString("vi-VN")}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => handleLikeReview(review.id)}
//                                   className={`p-2 rounded-lg transition-all hover:scale-110 flex items-center gap-1 ${
//                                     review.liked
//                                       ? "bg-red-100 text-red-600"
//                                       : "bg-gray-200 text-gray-600 hover:bg-red-50"
//                                   }`}
//                                   title={review.liked ? "Bỏ thích" : "Thích"}
//                                 >
//                                   <FaHeart
//                                     className={`text-sm ${
//                                       review.liked ? "fill-current" : ""
//                                     }`}
//                                   />
//                                   {(review.likes || 0) > 0 && (
//                                     <span className="text-xs font-semibold">
//                                       {review.likes}
//                                     </span>
//                                   )}
//                                 </button>
//                                 <button
//                                   onClick={() => handlePinReview(review.id)}
//                                   className={`p-2 rounded-lg transition-all hover:scale-110 ${
//                                     review.isPinned
//                                       ? "bg-yellow-500 text-white"
//                                       : "bg-gray-200 text-gray-600 hover:bg-yellow-100"
//                                   }`}
//                                   title={
//                                     review.isPinned
//                                       ? "Bỏ ghim"
//                                       : "Ghim đánh giá"
//                                   }
//                                 >
//                                   <FaThumbtack className="text-sm" />
//                                 </button>
//                                 <button
//                                   onClick={() => handleDeleteReview(review.id)}
//                                   className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all hover:scale-110"
//                                   title="Xóa đánh giá"
//                                 >
//                                   <HiTrash className="text-sm" />
//                                 </button>
//                               </div>
//                             </div>

//                             <p className="text-gray-700 mb-3 leading-relaxed">
//                               {review.comment}
//                             </p>

//                             {review.adminReply && (
//                               <div className="ml-8 mt-3 p-4 bg-teal-50 border-l-4 border-teal-500 rounded-lg">
//                                 <div className="flex justify-between items-start mb-2">
//                                   <div className="flex items-center gap-2">
//                                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
//                                       A
//                                     </div>
//                                     <div>
//                                       <p className="font-bold text-teal-700 text-sm">
//                                         Admin
//                                       </p>
//                                       <p className="text-xs text-gray-500">
//                                         {review.adminReply.date.toLocaleDateString(
//                                           "vi-VN"
//                                         )}
//                                       </p>
//                                     </div>
//                                   </div>
//                                   <div className="flex gap-2">
//                                     <button
//                                       onClick={() => {
//                                         setEditingReplyId(review.id);
//                                         setReplyText(review.adminReply.text);
//                                       }}
//                                       className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all hover:scale-110"
//                                       title="Sửa phản hồi"
//                                     >
//                                       <FaEdit className="text-xs" />
//                                     </button>
//                                     <button
//                                       onClick={() =>
//                                         handleDeleteReply(review.id)
//                                       }
//                                       className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all hover:scale-110"
//                                       title="Xóa phản hồi"
//                                     >
//                                       <HiTrash className="text-xs" />
//                                     </button>
//                                   </div>
//                                 </div>
//                                 {editingReplyId === review.id ? (
//                                   <div className="space-y-2">
//                                     <textarea
//                                       value={replyText}
//                                       onChange={(e) =>
//                                         setReplyText(e.target.value)
//                                       }
//                                       className="w-full p-2 border-2 border-teal-300 rounded-lg text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
//                                       rows="2"
//                                     />
//                                     <div className="flex gap-2">
//                                       <button
//                                         onClick={() =>
//                                           handleEditReply(review.id, replyText)
//                                         }
//                                         className="px-3 py-1 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-all"
//                                       >
//                                         Lưu
//                                       </button>
//                                       <button
//                                         onClick={() => {
//                                           setEditingReplyId(null);
//                                           setReplyText("");
//                                         }}
//                                         className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-all"
//                                       >
//                                         Hủy
//                                       </button>
//                                     </div>
//                                   </div>
//                                 ) : (
//                                   <p className="text-gray-700 text-sm leading-relaxed">
//                                     {review.adminReply.text}
//                                   </p>
//                                 )}
//                               </div>
//                             )}

//                             {!review.adminReply &&
//                               editingReplyId !== review.id && (
//                                 <button
//                                   onClick={() => setEditingReplyId(review.id)}
//                                   className="mt-3 ml-8 flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-sm transition-all hover:gap-3"
//                                 >
//                                   <FaReply className="text-sm" />
//                                   Trả lời
//                                 </button>
//                               )}

//                             {editingReplyId === review.id &&
//                               !review.adminReply && (
//                                 <div className="ml-8 mt-3 space-y-2">
//                                   <textarea
//                                     value={replyText}
//                                     onChange={(e) =>
//                                       setReplyText(e.target.value)
//                                     }
//                                     className="w-full p-3 border-2 border-teal-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
//                                     rows="3"
//                                     placeholder="Nhập phản hồi của bạn..."
//                                   />
//                                   <div className="flex gap-2">
//                                     <button
//                                       onClick={() => handleAddReply(review.id)}
//                                       className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-semibold"
//                                     >
//                                       Gửi phản hồi
//                                     </button>
//                                     <button
//                                       onClick={() => {
//                                         setEditingReplyId(null);
//                                         setReplyText("");
//                                       }}
//                                       className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
//                                     >
//                                       Hủy
//                                     </button>
//                                   </div>
//                                 </div>
//                               )}
//                           </div>
//                         ))}

//                       {getPetReviews(selectedPetForReviews.id).length >
//                         reviewsPerPage && (
//                         <div className="flex justify-center items-center gap-4 pt-4 border-t border-gray-200">
//                           <button
//                             onClick={() =>
//                               setReviewPage((p) => Math.max(1, p - 1))
//                             }
//                             disabled={reviewPage === 1}
//                             className={`p-2 rounded-xl font-semibold transition-all duration-300 ${
//                               reviewPage === 1
//                                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                                 : "bg-yellow-500 hover:bg-yellow-600 text-white hover:scale-105"
//                             }`}
//                           >
//                             <FaChevronLeft />
//                           </button>
//                           <span className="text-gray-700 dark:text-gray-300 font-semibold px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
//                             Trang {reviewPage} /{" "}
//                             {Math.ceil(
//                               getPetReviews(selectedPetForReviews.id).length /
//                                 reviewsPerPage
//                             )}
//                           </span>
//                           <button
//                             onClick={() =>
//                               setReviewPage((p) =>
//                                 Math.min(
//                                   Math.ceil(
//                                     getPetReviews(selectedPetForReviews.id)
//                                       .length / reviewsPerPage
//                                   ),
//                                   p + 1
//                                 )
//                               )
//                             }
//                             disabled={
//                               reviewPage ===
//                               Math.ceil(
//                                 getPetReviews(selectedPetForReviews.id).length /
//                                   reviewsPerPage
//                               )
//                             }
//                             className={`p-2 rounded-xl font-semibold transition-all duration-300 ${
//                               reviewPage ===
//                               Math.ceil(
//                                 getPetReviews(selectedPetForReviews.id).length /
//                                   reviewsPerPage
//                               )
//                                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                                 : "bg-yellow-500 hover:bg-yellow-600 text-white hover:scale-105"
//                             }`}
//                           >
//                             <FaChevronRight />
//                           </button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       ) : activeTab === "vaccination" ? (
//         <>
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200">
//             <div className="flex gap-3">
//               <button
//                 onClick={handleBulkSchedule}
//                 disabled={selectedVaccinationPets.length === 0}
//                 className={`glow-button font-semibold py-2 px-5 rounded-xl transition-all duration-300 flex items-center gap-2 group relative overflow-hidden ${
//                   selectedVaccinationPets.length === 0
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105"
//                 }`}
//               >
//                 <FaSyringe className="text-xl" />
//                 Lên Lịch Tiêm Chung ({selectedVaccinationPets.length})
//               </button>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <input
//                 type="text"
//                 placeholder="🔍 Tìm kiếm thú cưng..."
//                 value={vaccinationSearch}
//                 onChange={(e) => handleFilterChange("search", e.target.value)}
//                 className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
//               />
//               <select
//                 className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 cursor-pointer"
//                 value={vaccinationStatusFilter}
//                 onChange={(e) => handleFilterChange("status", e.target.value)}
//               >
//                 <option value="all">Tất Cả Trạng Thái</option>
//                 <option value="scheduled">Đã Lên Lịch</option>
//                 <option value="completed">Hoàn Thành</option>
//                 <option value="waiting">Chờ</option>
//                 <option value="just-completed">Vừa Hoàn Thành</option>
//               </select>
//               <div className="grid grid-cols-2 gap-2">
//                 <input
//                   type="date"
//                   placeholder="Từ ngày"
//                   value={vaccinationDateFrom}
//                   onChange={(e) =>
//                     handleFilterChange("dateFrom", e.target.value)
//                   }
//                   className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
//                 />
//                 <input
//                   type="date"
//                   placeholder="Đến ngày"
//                   value={vaccinationDateTo}
//                   onChange={(e) => handleFilterChange("dateTo", e.target.value)}
//                   className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {allPets.map((pet) => {
//               const schedules = getPetSchedules(pet.id);
//               const isSelected = selectedVaccinationPets.includes(pet.id);
//               const isHovered = hoveredPetId === pet.id;

//               return (
//                 <div
//                   key={pet.id}
//                   className="relative group"
//                   onMouseEnter={() => setHoveredPetId(pet.id)}
//                   onMouseLeave={() => setHoveredPetId(null)}
//                 >
//                   <div
//                     className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 border-2 ${
//                       isSelected
//                         ? "border-purple-500 shadow-purple-200"
//                         : "border-gray-200 hover:border-purple-300"
//                     } ${isHovered ? "scale-105 shadow-2xl" : ""}`}
//                   >
//                     <div className="relative">
//                       <img
//                         src={
//                           pet.images[0] ||
//                           "/placeholder.svg?height=200&width=200" ||
//                           "/placeholder.svg"
//                         }
//                         alt={pet.name}
//                         className="w-full h-48 object-cover"
//                       />
//                       <div className="absolute top-2 left-2 z-20">
//                         <input
//                           type="checkbox"
//                           checked={isSelected}
//                           onChange={() => handleSelectItem(pet.id)}
//                           className="w-6 h-6 accent-purple-600 cursor-pointer"
//                         />
//                       </div>
//                       {schedules.length > 0 && (
//                         <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
//                           <FaSyringe className="text-xs" />
//                           {schedules.length}
//                         </div>
//                       )}

//                       {isHovered && (
//                         <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center gap-2 animate-fadeIn z-10">
//                           <button
//                             onClick={() => handleAddVaccination(pet)}
//                             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all hover:scale-105"
//                           >
//                             <HiPlus /> Thêm Lịch
//                           </button>
//                           {schedules.length > 0 && (
//                             <>
//                               <button
//                                 onClick={() =>
//                                   handleEditVaccination(pet, schedules[0])
//                                 }
//                                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all hover:scale-105"
//                               >
//                                 <HiPencil /> Sửa Lịch
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   handleDeleteVaccination(schedules[0].id)
//                                 }
//                                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all hover:scale-105"
//                               >
//                                 <HiTrash /> Hủy Lịch
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     <div className="p-4">
//                       <h3 className="font-bold text-gray-800 text-lg mb-1">
//                         {pet.name}
//                       </h3>
//                       <p className="text-sm text-gray-600 mb-2">
//                         {pet.breed} • {pet.category}
//                       </p>

//                       {schedules.length > 0 && (
//                         <div className="mt-3 space-y-2">
//                           {schedules.slice(0, 2).map((schedule) => (
//                             <div
//                               key={schedule.id}
//                               className="bg-purple-50 p-2 rounded-lg text-xs"
//                             >
//                               <div className="flex items-center gap-1 text-purple-700 font-semibold mb-1">
//                                 <FaSyringe className="text-xs" />
//                                 {schedule.vaccineType}
//                               </div>
//                               <div className="flex items-center gap-1 text-gray-600">
//                                 <HiCalendar className="text-xs" />
//                                 {schedule.dates[0].toLocaleDateString("vi-VN")}
//                               </div>
//                               <div className="flex items-center gap-1 text-gray-600">
//                                 <HiClock className="text-xs" />
//                                 {schedule.time}
//                               </div>
//                             </div>
//                           ))}
//                           {schedules.length > 2 && (
//                             <p className="text-xs text-gray-500 text-center">
//                               +{schedules.length - 2} lịch khác
//                             </p>
//                           )}
//                         </div>
//                       )}

//                       {schedules.length === 0 && (
//                         <div className="mt-3 text-center text-sm text-gray-400 italic">
//                           Chưa có lịch tiêm
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       ) : (
//         <>
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200">
//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setModalMode("add");
//                   setModalOpen(true);
//                   if (activeTab === "pets") {
//                     setNewPet({
//                       name: "",
//                       category: "",
//                       breed: "",
//                       price: "",
//                       weight: "",
//                       length: "",
//                       breadth: "",
//                       width: "",
//                       details: "",
//                       email: "",
//                     });
//                   } else {
//                     setNewService({
//                       name: "",
//                       description: "",
//                       price: "",
//                       duration: "",
//                       status: "ACTIVE",
//                     });
//                   }
//                   setNewImages([]);
//                 }}
//                 className="glow-button bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 group relative overflow-hidden"
//               >
//                 <HiPlus className="text-xl group-hover:rotate-90 transition-transform duration-300" />
//                 {activeTab === "pets" ? "Thêm Thú Cưng" : "Thêm Dịch Vụ"}
//               </button>

//               {activeTab === "pets" && (
//                 <button
//                   onClick={handleSendEmail}
//                   disabled={selectedPets.length === 0}
//                   className={`glow-button font-semibold py-2 px-5 rounded-xl transition-all duration-300 flex items-center gap-2 group relative overflow-hidden ${
//                     selectedPets.length === 0
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-green-600 hover:bg-green-700 text-white hover:scale-105"
//                   }`}
//                 >
//                   <HiMail className="text-xl" />
//                   Gửi Thông Báo ({selectedPets.length})
//                 </button>
//               )}
//             </div>

//             <div className="flex items-center gap-4 flex-wrap">
//               <HiCog className="text-2xl text-gray-600 dark:text-gray-400 animate-pulse" />
//               {activeTab === "pets"
//                 ? Object.keys(columnsVisible).map((key) => (
//                     <label
//                       key={key}
//                       className="flex items-center gap-2 cursor-pointer group"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={columnsVisible[key]}
//                         onChange={() =>
//                           setColumnsVisible((prev) => ({
//                             ...prev,
//                             [key]: !prev[key],
//                           }))
//                         }
//                         className="w-4 h-4 accent-blue-600 cursor-pointer"
//                       />
//                       <span className="text-sm text-gray-700 dark:text-gray-300 capitalize group-hover:text-blue-600 transition-colors">
//                         {key.replace("_", " ")}
//                       </span>
//                     </label>
//                   ))
//                 : Object.keys(serviceColumnsVisible).map((key) => (
//                     <label
//                       key={key}
//                       className="flex items-center gap-2 cursor-pointer group"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={serviceColumnsVisible[key]}
//                         onChange={() =>
//                           setServiceColumnsVisible((prev) => ({
//                             ...prev,
//                             [key]: !prev[key],
//                           }))
//                         }
//                         className="w-4 h-4 accent-blue-600 cursor-pointer"
//                       />
//                       <span className="text-sm text-gray-700 dark:text-gray-300 capitalize group-hover:text-blue-600 transition-colors">
//                         {key.replace("_", " ")}
//                       </span>
//                     </label>
//                   ))}
//             </div>
//           </div>

//           {activeTab === "pets" ? (
//             <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//               <input
//                 type="text"
//                 placeholder="🔍 Tìm kiếm thú cưng..."
//                 value={filters.search}
//                 onChange={(e) => handleFilterChange("search", e.target.value)}
//                 className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
//               />
//               <select
//                 className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 cursor-pointer"
//                 value={filters.breed}
//                 onChange={(e) => handleFilterChange("breed", e.target.value)}
//               >
//                 <option value="">Tất Cả Giống</option>
//                 {[...new Set(allPets.map((p) => p.breed))].map((b) => (
//                   <option key={b} value={b}>
//                     {b}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 cursor-pointer"
//                 value={filters.category}
//                 onChange={(e) => handleFilterChange("category", e.target.value)}
//               >
//                 <option value="">Tất Cả Loại</option>
//                 {[...new Set(allPets.map((p) => p.category))].map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 cursor-pointer"
//                 value={filters.price}
//                 onChange={(e) => handleFilterChange("price", e.target.value)}
//               >
//                 <option value="">Tất Cả Giá</option>
//                 <option value="under-500">Dưới $500</option>
//                 <option value="over-500">Trên $500</option>
//               </select>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <input
//                 type="text"
//                 placeholder="🔍 Tìm kiếm dịch vụ..."
//                 value={serviceFilters.search}
//                 onChange={(e) => handleFilterChange("search", e.target.value)}
//                 className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
//               />
//               <select
//                 className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 cursor-pointer"
//                 value={serviceFilters.type}
//                 onChange={(e) => handleFilterChange("type", e.target.value)}
//               >
//                 <option value="">Tất Cả Loại</option>
//                 {serviceTypes.map((t) => (
//                   <option key={t} value={t}>
//                     {t}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 cursor-pointer"
//                 value={serviceFilters.status}
//                 onChange={(e) => handleFilterChange("status", e.target.value)}
//               >
//                 <option value="">Tất Cả Trạng Thái</option>
//                 <option value="ACTIVE">Hoạt Động</option>
//                 <option value="INACTIVE">Tạm Ngưng</option>
//                 <option value="PENDING">Chờ Duyệt</option>
//               </select>
//             </div>
//           )}

//           <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-max">
//                 <thead>
//                   <tr className="bg-slate-700 text-white">
//                     <th className="p-4 text-left">
//                       <input
//                         type="checkbox"
//                         checked={
//                           paginatedData.length > 0 &&
//                           paginatedData.every((item) =>
//                             activeTab === "pets"
//                               ? selectedPets.includes(item.id)
//                               : selectedServices.includes(item.id)
//                           )
//                         }
//                         onChange={handleSelectAll}
//                         className="w-5 h-5 accent-white cursor-pointer"
//                       />
//                     </th>
//                     {activeTab === "pets" ? (
//                       <>
//                         <th className="p-4 text-left font-semibold">Tên</th>
//                         {columnsVisible.category && (
//                           <th className="p-4 text-left font-semibold">Loại</th>
//                         )}
//                         {columnsVisible.breed && (
//                           <th className="p-4 text-left font-semibold">Giống</th>
//                         )}
//                         {columnsVisible.price && (
//                           <th className="p-4 text-left font-semibold">Giá</th>
//                         )}
//                         {columnsVisible.stock && (
//                           <th className="p-4 text-left font-semibold">
//                             Tồn Kho
//                           </th>
//                         )}
//                         {columnsVisible.total_sales && (
//                           <th className="p-4 text-left font-semibold">
//                             Đã Bán
//                           </th>
//                         )}
//                         {columnsVisible.status && (
//                           <th className="p-4 text-left font-semibold">
//                             Trạng Thái
//                           </th>
//                         )}
//                       </>
//                     ) : (
//                       <>
//                         <th className="p-4 text-left font-semibold">ID</th>
//                         <th className="p-4 text-left font-semibold">
//                           Tên Dịch Vụ
//                         </th>
//                         {serviceColumnsVisible.description && (
//                           <th className="p-4 text-left font-semibold">Mô Tả</th>
//                         )}
//                         {serviceColumnsVisible.price && (
//                           <th className="p-4 text-left font-semibold">Giá</th>
//                         )}
//                         {serviceColumnsVisible.duration && (
//                           <th className="p-4 text-left font-semibold">
//                             Thời Gian
//                           </th>
//                         )}
//                         {serviceColumnsVisible.status && (
//                           <th className="p-4 text-left font-semibold">
//                             Trạng Thái
//                           </th>
//                         )}
//                       </>
//                     )}
//                     <th className="p-4 text-left font-semibold">Thao Tác</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedData.map((item) => (
//                     <React.Fragment key={item.id}>
//                       <tr
//                         className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer ${
//                           expandedItems[item.id]
//                             ? "bg-gray-100 dark:bg-gray-700"
//                             : "bg-white dark:bg-gray-800"
//                         }`}
//                       >
//                         <td className="p-4">
//                           <input
//                             type="checkbox"
//                             checked={
//                               activeTab === "pets"
//                                 ? selectedPets.includes(item.id)
//                                 : selectedServices.includes(item.id)
//                             }
//                             onChange={() => handleSelectItem(item.id)}
//                             className="w-5 h-5 accent-blue-600 cursor-pointer"
//                           />
//                         </td>
//                         {activeTab === "pets" ? (
//                           <>
//                             <td
//                               className="p-4 font-medium text-gray-900 dark:text-white"
//                               onClick={() => toggleExpand(item.id)}
//                             >
//                               {item.name}
//                             </td>
//                             {columnsVisible.category && (
//                               <td
//                                 className="p-4 text-gray-700 dark:text-gray-300"
//                                 onClick={() => toggleExpand(item.id)}
//                               >
//                                 {item.category}
//                               </td>
//                             )}
//                             {columnsVisible.breed && (
//                               <td
//                                 className="p-4 text-gray-700 dark:text-gray-300"
//                                 onClick={() => toggleExpand(item.id)}
//                               >
//                                 {item.breed}
//                               </td>
//                             )}
//                             {columnsVisible.price && (
//                               <td
//                                 className="p-4 font-semibold text-green-600 dark:text-green-400"
//                                 onClick={() => toggleExpand(item.id)}
//                               >
//                                 {item.price}
//                               </td>
//                             )}
//                             {columnsVisible.stock && (
//                               <td
//                                 className="p-4 text-gray-700 dark:text-gray-300"
//                                 onClick={() => toggleExpand(item.id)}
//                               >
//                                 {item.stock}
//                               </td>
//                             )}
//                             {columnsVisible.total_sales && (
//                               <td
//                                 className="p-4 text-gray-700 dark:text-gray-300"
//                                 onClick={() => toggleExpand(item.id)}
//                               >
//                                 {item.total_sales}
//                               </td>
//                             )}
//                             {columnsVisible.status && (
//                               <td
//                                 className="p-4"
//                                 onClick={() => toggleExpand(item.id)}
//                               >
//                                 <span
//                                   className={`px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide shadow-sm ${
//                                     item.status === "DRAFT"
//                                       ? "bg-amber-500"
//                                       : item.status === "PUBLISHED"
//                                       ? "bg-green-600"
//                                       : "bg-red-500"
//                                   }`}
//                                 >
//                                   {item.status}
//                                 </span>
//                               </td>
//                             )}
//                           </>
//                         ) : (
//                           <>
//                             <td
//                               className="p-4 font-medium text-blue-600 dark:text-blue-400"
//                               onClick={() => toggleExpand(item.id)}
//                             >
//                               {item.id}
//                             </td>
//                             <td
//                               className="p-4 font-medium text-gray-900 dark:text-white"
//                               onClick={() => toggleExpand(item.id)}
//                             >
//                               {item.name}
//                             </td>
//                             {serviceColumnsVisible.description && (
//                               <td
//                                 className="p-4 text-gray-700 dark:text-gray-300"
//                                 onClick={() => toggleExpand(item.id)}
//                               >
//                                 {item.description}
//                               </td>
//                             )}
//                             {serviceColumnsVisible.price && (
//                               <td
//                                 className="p-4 font-semibold text-green-600 dark:text-green-400"
//                                 onClick={() => toggleExpand(item.id)}
//                               >
//                                 {item.price}
//                               </td>
//                             )}
//                             {serviceColumnsVisible.duration && (
//                               <td
//                                 className="p-4 text-gray-700 dark:text-gray-300"
//                                 onClick={() => toggleExpand(item.id)}
//                               >
//                                 {item.duration}
//                               </td>
//                             )}
//                             {serviceColumnsVisible.status && (
//                               <td
//                                 className="p-4"
//                                 onClick={() => toggleExpand(item.id)}
//                               >
//                                 <span
//                                   className={`px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide shadow-sm ${
//                                     item.status === "ACTIVE"
//                                       ? "bg-green-600"
//                                       : item.status === "INACTIVE"
//                                       ? "bg-red-500"
//                                       : "bg-amber-500"
//                                   }`}
//                                 >
//                                   {item.status}
//                                 </span>
//                               </td>
//                             )}
//                           </>
//                         )}
//                         <td className="p-4">
//                           <HiChevronDown
//                             className={`text-2xl cursor-pointer transition-transform duration-300 text-blue-600 hover:text-blue-700 ${
//                               expandedItems[item.id] ? "rotate-180" : ""
//                             }`}
//                             onClick={() => toggleExpand(item.id)}
//                           />
//                         </td>
//                       </tr>
//                       {expandedItems[item.id] && (
//                         <tr>
//                           <td
//                             colSpan={activeTab === "pets" ? 9 : 8}
//                             className="p-0"
//                           >
//                             <div className="p-6 bg-gray-100 dark:bg-gray-750 animate-fadeIn">
//                               {activeTab === "pets" ? (
//                                 <>
//                                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                                     {item.images.map((img, idx) => (
//                                       <img
//                                         key={idx}
//                                         src={img || "/placeholder.svg"}
//                                         alt={`${item.name} ${idx + 1}`}
//                                         className="w-full h-32 object-cover rounded-xl border-2 border-gray-300 dark:border-gray-600 shadow-md hover:scale-105 transition-transform duration-300"
//                                       />
//                                     ))}
//                                   </div>
//                                   <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
//                                     <strong className="text-blue-600 dark:text-blue-400">
//                                       Chi tiết:
//                                     </strong>{" "}
//                                     {item.details}
//                                   </p>
//                                   <p className="text-gray-700 dark:text-gray-300 mb-4">
//                                     <strong className="text-blue-600 dark:text-blue-400">
//                                       Email khách hàng:
//                                     </strong>{" "}
//                                     {item.email}
//                                   </p>
//                                   <div className="mb-6">
//                                     <strong className="text-blue-600 dark:text-blue-400">
//                                       Màu sắc:
//                                     </strong>
//                                     <div className="flex gap-3 mt-2">
//                                       {item.colors.map((c, i) => (
//                                         <span
//                                           key={i}
//                                           className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-md hover:scale-125 transition-transform duration-300 cursor-pointer"
//                                           style={{ backgroundColor: c }}
//                                         />
//                                       ))}
//                                     </div>
//                                   </div>
//                                 </>
//                               ) : (
//                                 <div className="space-y-4">
//                                   <p className="text-gray-700 dark:text-gray-300">
//                                     <strong className="text-blue-600 dark:text-blue-400">
//                                       Mã dịch vụ:
//                                     </strong>{" "}
//                                     {item.id}
//                                   </p>
//                                   <p className="text-gray-700 dark:text-gray-300">
//                                     <strong className="text-blue-600 dark:text-blue-400">
//                                       Mô tả chi tiết:
//                                     </strong>{" "}
//                                     {item.description}
//                                   </p>
//                                   <p className="text-gray-700 dark:text-gray-300">
//                                     <strong className="text-blue-600 dark:text-blue-400">
//                                       Thời gian thực hiện:
//                                     </strong>{" "}
//                                     {item.duration}
//                                   </p>
//                                 </div>
//                               )}
//                               <div className="flex gap-3 flex-wrap mt-6">
//                                 <button
//                                   onClick={() => {
//                                     setModalMode("edit");
//                                     setEditedItem({ ...item });
//                                     if (activeTab === "pets") {
//                                       setNewImages(item.images);
//                                     }
//                                     setModalOpen(true);
//                                   }}
//                                   className="glow-button bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 relative overflow-hidden"
//                                 >
//                                   <HiPencil className="text-lg" /> Sửa
//                                 </button>

//                                 <button
//                                   onClick={() => handleDeleteItem(item.id)}
//                                   className="glow-button bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 relative overflow-hidden"
//                                 >
//                                   <HiTrash className="text-lg" /> Xóa
//                                 </button>
//                               </div>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="flex justify-center items-center gap-4 mt-6">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className={`p-3 rounded-xl font-semibold transition-all duration-300 ${
//                 page === 1
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "glow-button bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 relative overflow-hidden"
//               }`}
//             >
//               <FaChevronLeft />
//             </button>
//             <span className="text-gray-700 dark:text-gray-300 font-semibold px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200">
//               Trang {page} / {Math.ceil(paginatedData.length / perPage) || 1}
//             </span>
//             <button
//               onClick={() =>
//                 setPage((p) =>
//                   Math.min(
//                     Math.ceil(paginatedData.length / perPage) || 1,
//                     p + 1
//                   )
//                 )
//               }
//               disabled={
//                 page === Math.ceil(paginatedData.length / perPage) ||
//                 Math.ceil(paginatedData.length / perPage) === 0
//               }
//               className={`p-3 rounded-xl font-semibold transition-all duration-300 ${
//                 page === Math.ceil(paginatedData.length / perPage) ||
//                 Math.ceil(paginatedData.length / perPage) === 0
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "glow-button bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 relative overflow-hidden"
//               }`}
//             >
//               <FaChevronRight />
//             </button>
//           </div>
//         </>
//       )}

//       {showVaccinationModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn z-50">
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
//             onClick={() => setShowVaccinationModal(false)}
//           ></div>
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl z-50 relative animate-slideUp border border-gray-200 max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center z-10">
//               <h2 className="text-2xl font-bold flex items-center gap-2">
//                 <FaSyringe className="text-3xl" />
//                 {vaccinationModalMode === "add"
//                   ? "Thêm Lịch Tiêm"
//                   : "Sửa Lịch Tiêm"}{" "}
//                 - {currentVaccinationPet?.name}
//               </h2>
//               <button
//                 onClick={() => setShowVaccinationModal(false)}
//                 className="text-white hover:bg-white hover:text-purple-600 rounded-full p-2 transition-all duration-300"
//               >
//                 <HiX className="text-2xl" />
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                   Loại Vaccine
//                 </label>
//                 <select
//                   value={vaccineType}
//                   onChange={(e) => setVaccineType(e.target.value)}
//                   className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer"
//                 >
//                   <option value="">Chọn loại vaccine</option>
//                   <option value="Rabies">Rabies (Dại)</option>
//                   <option value="Distemper">Distemper (Carré)</option>
//                   <option value="Parvovirus">Parvovirus</option>
//                   <option value="Hepatitis">Hepatitis (Viêm gan)</option>
//                   <option value="Bordetella">Bordetella (Ho cũi chó)</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                   Chọn Ngày Tiêm
//                 </label>
//                 <Calendar
//                   onDateSelect={handleDateSelect}
//                   selectedDates={selectedDates}
//                 />
//                 {selectedDates.length > 0 && (
//                   <div className="mt-3 p-3 bg-purple-50 rounded-lg">
//                     <p className="text-sm font-semibold text-purple-700 mb-2">
//                       Đã chọn {selectedDates.length} ngày:
//                     </p>
//                     <div className="flex flex-wrap gap-2">
//                       {selectedDates.map((date, idx) => (
//                         <span
//                           key={idx}
//                           className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium"
//                         >
//                           {date.toLocaleDateString("vi-VN")}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                   Giờ Tiêm
//                 </label>
//                 <input
//                   type="time"
//                   value={selectedTime}
//                   onChange={(e) => setSelectedTime(e.target.value)}
//                   className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                   Ghi Chú
//                 </label>
//                 <textarea
//                   value={vaccineNotes}
//                   onChange={(e) => setVaccineNotes(e.target.value)}
//                   className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
//                   rows="3"
//                   placeholder="Nhập ghi chú về lịch tiêm..."
//                 ></textarea>
//               </div>

//               <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
//                 <button
//                   onClick={handleSaveVaccination}
//                   className="glow-button flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 hover:scale-105 relative overflow-hidden flex items-center justify-center gap-2"
//                 >
//                   <HiCheck className="text-xl" />
//                   {vaccinationModalMode === "add"
//                     ? "Thêm Lịch Tiêm"
//                     : "Cập Nhật"}
//                 </button>
//                 <button
//                   onClick={() => setShowVaccinationModal(false)}
//                   className="glow-button flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
//                 >
//                   Hủy
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showBulkScheduleModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn z-50">
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
//             onClick={() => setShowBulkScheduleModal(false)}
//           ></div>
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl z-50 relative animate-slideUp border border-gray-200 max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center z-10">
//               <h2 className="text-2xl font-bold flex items-center gap-2">
//                 <FaSyringe className="text-3xl" />
//                 Lên Lịch Tiêm Chung - Bước {bulkScheduleStep}/2
//               </h2>
//               <button
//                 onClick={() => setShowBulkScheduleModal(false)}
//                 className="text-white hover:bg-white hover:text-purple-600 rounded-full p-2 transition-all duration-300"
//               >
//                 <HiX className="text-2xl" />
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
//               {bulkScheduleStep === 1 ? (
//                 <>
//                   <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-xl border border-purple-200">
//                     <p className="text-gray-700 dark:text-gray-300">
//                       <strong>Số lượng thú cưng đã chọn:</strong>{" "}
//                       {selectedVaccinationPets.length}
//                     </p>
//                     <div className="mt-2 flex flex-wrap gap-2">
//                       {allPets
//                         .filter((p) => selectedVaccinationPets.includes(p.id))
//                         .map((pet) => (
//                           <span
//                             key={pet.id}
//                             className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium"
//                           >
//                             {pet.name}
//                           </span>
//                         ))}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Loại Vaccine
//                     </label>
//                     <select
//                       value={vaccineType}
//                       onChange={(e) => setVaccineType(e.target.value)}
//                       className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all cursor-pointer"
//                     >
//                       <option value="">Chọn loại vaccine</option>
//                       <option value="Rabies">Rabies (Dại)</option>
//                       <option value="Distemper">Distemper (Carré)</option>
//                       <option value="Parvovirus">Parvovirus</option>
//                       <option value="Hepatitis">Hepatitis (Viêm gan)</option>
//                       <option value="Bordetella">
//                         Bordetella (Ho cũi chó)
//                       </option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Chọn Ngày Tiêm
//                     </label>
//                     <Calendar
//                       onDateSelect={handleDateSelect}
//                       selectedDates={selectedDates}
//                     />
//                     {selectedDates.length > 0 && (
//                       <div className="mt-3 p-3 bg-purple-50 rounded-lg">
//                         <p className="text-sm font-semibold text-purple-700 mb-2">
//                           Đã chọn {selectedDates.length} ngày:
//                         </p>
//                         <div className="flex flex-wrap gap-2">
//                           {selectedDates.map((date, idx) => (
//                             <span
//                               key={idx}
//                               className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium"
//                             >
//                               {date.toLocaleDateString("vi-VN")}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Giờ Tiêm
//                     </label>
//                     <input
//                       type="time"
//                       value={selectedTime}
//                       onChange={(e) => setSelectedTime(e.target.value)}
//                       className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Ghi Chú
//                     </label>
//                     <textarea
//                       value={vaccineNotes}
//                       onChange={(e) => setVaccineNotes(e.target.value)}
//                       className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
//                       rows="3"
//                       placeholder="Nhập ghi chú về lịch tiêm..."
//                     ></textarea>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-xl border border-green-200">
//                     <p className="text-gray-700 dark:text-gray-300 mb-2">
//                       <strong>Thông tin lịch tiêm:</strong>
//                     </p>
//                     <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
//                       <li>
//                         • Loại vaccine: <strong>{vaccineType}</strong>
//                       </li>
//                       <li>
//                         • Số ngày: <strong>{selectedDates.length}</strong>
//                       </li>
//                       <li>
//                         • Giờ tiêm: <strong>{selectedTime}</strong>
//                       </li>
//                       <li>
//                         • Số thú cưng:{" "}
//                         <strong>{selectedVaccinationPets.length}</strong>
//                       </li>
//                     </ul>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                       Nội dung thông báo email
//                     </label>
//                     <textarea
//                       value={emailContent}
//                       onChange={(e) => setEmailContent(e.target.value)}
//                       className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
//                       rows="6"
//                       placeholder="Nhập nội dung thông báo cho khách hàng về lịch tiêm phòng..."
//                     ></textarea>
//                   </div>
//                 </>
//               )}

//               <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
//                 {bulkScheduleStep === 2 && (
//                   <button
//                     onClick={() => setBulkScheduleStep(1)}
//                     className="glow-button flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
//                   >
//                     Quay Lại
//                   </button>
//                 )}
//                 <button
//                   onClick={handleBulkScheduleNext}
//                   className="glow-button flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 hover:scale-105 relative overflow-hidden flex items-center justify-center gap-2"
//                 >
//                   {bulkScheduleStep === 1 ? (
//                     <>
//                       Tiếp Theo <FaChevronRight />
//                     </>
//                   ) : (
//                     <>
//                       <HiMail className="text-xl" />
//                       Xác Nhận & Gửi Email
//                     </>
//                   )}
//                 </button>
//                 <button
//                   onClick={() => setShowBulkScheduleModal(false)}
//                   className="glow-button flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
//                 >
//                   Hủy
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Email modal */}
//       {showEmailModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn z-50">
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
//             onClick={() => setShowEmailModal(false)}
//           ></div>
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl z-50 relative animate-slideUp border border-gray-200">
//             <div className="bg-green-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
//               <h2 className="text-2xl font-bold flex items-center gap-2">
//                 <HiMail className="text-3xl" />
//                 Gửi Thông Báo Email
//               </h2>
//               <button
//                 onClick={() => setShowEmailModal(false)}
//                 className="text-white hover:bg-white hover:text-green-600 rounded-full p-2 transition-all duration-300"
//               >
//                 <HiX className="text-2xl" />
//               </button>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-xl border border-blue-200">
//                 <p className="text-gray-700 dark:text-gray-300">
//                   <strong>Số lượng thú cưng đã chọn:</strong>{" "}
//                   {selectedPets.length}
//                 </p>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
//                   Email sẽ được gửi đến khách hàng của các thú cưng đã chọn
//                 </p>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                   Nội dung thông báo
//                 </label>
//                 <textarea
//                   value={emailContent}
//                   onChange={(e) => setEmailContent(e.target.value)}
//                   className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
//                   rows="6"
//                   placeholder="Nhập nội dung thông báo cho khách hàng. Ví dụ: Thú cưng của bạn đã sẵn sàng để đặt hàng..."
//                 ></textarea>
//               </div>

//               <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
//                 <button
//                   onClick={handleConfirmSendEmail}
//                   className="glow-button flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 hover:scale-105 relative overflow-hidden flex items-center justify-center gap-2"
//                 >
//                   <HiMail className="text-xl" />
//                   Gửi Thông Báo
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowEmailModal(false);
//                     setEmailContent("");
//                   }}
//                   className="glow-button flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
//                 >
//                   Hủy
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Pet/Service modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn z-50">
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
//             onClick={() => setModalOpen(false)}
//           ></div>
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] z-50 relative animate-slideUp custom-scrollbar border border-gray-200">
//             <div className="sticky top-0 bg-blue-600 text-white p-6 rounded-t-2xl flex justify-between items-center z-10">
//               <h2 className="text-2xl font-bold">
//                 {modalMode === "add"
//                   ? activeTab === "pets"
//                     ? "✨ Thêm Thú Cưng Mới"
//                     : "✨ Thêm Dịch Vụ Mới"
//                   : activeTab === "pets"
//                   ? "✏️ Sửa Thú Cưng"
//                   : "✏️ Sửa Dịch Vụ"}
//               </h2>
//               <button
//                 onClick={() => {
//                   setModalOpen(false);
//                   setNewImages([]);
//                 }}
//                 className="text-white hover:bg-white hover:text-blue-600 rounded-full p-2 transition-all duration-300"
//               >
//                 <HiX className="text-2xl" />
//               </button>
//             </div>

//             <div className="overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
//               <form onSubmit={handleAddItem} className="p-6 space-y-6">
//                 {activeTab === "pets" ? (
//                   <>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                           Tên Thú Cưng
//                         </label>
//                         <input
//                           type="text"
//                           name="name"
//                           value={
//                             modalMode === "edit"
//                               ? editedItem?.name || ""
//                               : newPet.name
//                           }
//                           onChange={handleItemChange}
//                           className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                           placeholder="Nhập tên thú cưng"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                           Loại
//                         </label>
//                         <input
//                           type="text"
//                           name="category"
//                           value={
//                             modalMode === "edit"
//                               ? editedItem?.category || ""
//                               : newPet.category
//                           }
//                           onChange={handleItemChange}
//                           className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                           placeholder="Nhập loại"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                           Giống
//                         </label>
//                         <input
//                           type="text"
//                           name="breed"
//                           value={
//                             modalMode === "edit"
//                               ? editedItem?.breed || ""
//                               : newPet.breed
//                           }
//                           onChange={handleItemChange}
//                           className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                           placeholder="Nhập giống"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                           Giá
//                         </label>
//                         <input
//                           type="text"
//                           name="price"
//                           value={
//                             modalMode === "edit"
//                               ? editedItem?.price.replace("$", "") || ""
//                               : newPet.price
//                           }
//                           onChange={handleItemChange}
//                           className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                           placeholder="Nhập giá"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                           Email Khách Hàng
//                         </label>
//                         <input
//                           type="email"
//                           name="email"
//                           value={
//                             modalMode === "edit"
//                               ? editedItem?.email || ""
//                               : newPet.email
//                           }
//                           onChange={handleItemChange}
//                           className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                           placeholder="Nhập email khách hàng"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                         Mô Tả
//                       </label>
//                       <textarea
//                         name="details"
//                         value={
//                           modalMode === "edit"
//                             ? editedItem?.details || ""
//                             : newPet.details
//                         }
//                         onChange={handleItemChange}
//                         className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                         rows="4"
//                         placeholder="Nhập mô tả thú cưng"
//                       ></textarea>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                           Tên Dịch Vụ
//                         </label>
//                         <input
//                           type="text"
//                           name="name"
//                           value={
//                             modalMode === "edit"
//                               ? editedItem?.name || ""
//                               : newService.name
//                           }
//                           onChange={handleItemChange}
//                           className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                           placeholder="Nhập tên dịch vụ"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                           Giá
//                         </label>
//                         <input
//                           type="text"
//                           name="price"
//                           value={
//                             modalMode === "edit"
//                               ? editedItem?.price.replace("$", "") || ""
//                               : newService.price
//                           }
//                           onChange={handleItemChange}
//                           className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                           placeholder="Nhập giá"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                           Thời Gian
//                         </label>
//                         <input
//                           type="text"
//                           name="duration"
//                           value={
//                             modalMode === "edit"
//                               ? editedItem?.duration || ""
//                               : newService.duration
//                           }
//                           onChange={handleItemChange}
//                           className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                           placeholder="Ví dụ: 2 hours"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                           Trạng Thái
//                         </label>
//                         <select
//                           name="status"
//                           value={
//                             modalMode === "edit"
//                               ? editedItem?.status || ""
//                               : newService.status
//                           }
//                           onChange={handleItemChange}
//                           className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer"
//                         >
//                           <option value="ACTIVE">Hoạt Động</option>
//                           <option value="INACTIVE">Tạm Ngưng</option>
//                           <option value="PENDING">Chờ Duyệt</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                         Mô Tả
//                       </label>
//                       <textarea
//                         name="description"
//                         value={
//                           modalMode === "edit"
//                             ? editedItem?.description || ""
//                             : newService.description
//                         }
//                         onChange={handleItemChange}
//                         className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                         rows="4"
//                         placeholder="Nhập mô tả dịch vụ"
//                       ></textarea>
//                     </div>
//                   </>
//                 )}

//                 <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
//                   <button
//                     type="submit"
//                     className="glow-button flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
//                   >
//                     {modalMode === "add" ? "✨ Thêm Mới" : "💾 Cập Nhật"}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setModalOpen(false);
//                       setNewImages([]);
//                     }}
//                     className="glow-button flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
//                   >
//                     Hủy
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }
//         @keyframes slideUp {
//           from {
//             transform: translateY(20px);
//             opacity: 0;
//           }
//           to {
//             transform: translateY(0);
//             opacity: 1;
//           }
//         }
//         /* New dynamic pulsing border animation with rotating gradient */
//         @keyframes pulsingBorder {
//           0% {
//             transform: rotate(0deg) scale(1);
//             opacity: 0.8;
//           }
//           50% {
//             transform: rotate(180deg) scale(1.05);
//             opacity: 1;
//           }
//           100% {
//             transform: rotate(360deg) scale(1);
//             opacity: 0.8;
//           }
//         }
//         @keyframes glowPulse {
//           0%,
//           100% {
//             filter: brightness(1) drop-shadow(0 0 8px rgba(139, 92, 246, 0.6));
//           }
//           50% {
//             filter: brightness(1.2)
//               drop-shadow(0 0 16px rgba(139, 92, 246, 0.9));
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-in-out;
//         }
//         .animate-slideUp {
//           animation: slideUp 0.3s ease-out;
//         }
//         /* Updated animated border with pulsing and rotating effect */
//         .tab-button-active::before {
//           content: "";
//           position: absolute;
//           inset: -3px;
//           border-radius: 0.75rem;
//           background: conic-gradient(
//             from 0deg,
//             #6366f1,
//             #8b5cf6,
//             #ec4899,
//             #f59e0b,
//             #10b981,
//             #06b6d4,
//             #6366f1
//           );
//           animation: pulsingBorder 3s linear infinite;
//           z-index: -1;
//         }
//         .tab-button-active::after {
//           content: "";
//           position: absolute;
//           inset: 0;
//           border-radius: 0.5rem;
//           animation: glowPulse 2s ease-in-out infinite;
//           z-index: -1;
//           pointer-events: none;
//         }
//         /* Updated inactive tab hover with subtle animation */
//         .tab-button-inactive::before {
//           content: "";
//           position: absolute;
//           inset: -2px;
//           border-radius: 0.75rem;
//           background: conic-gradient(
//             from 0deg,
//             #94a3b8,
//             #64748b,
//             #475569,
//             #94a3b8
//           );
//           opacity: 0;
//           transition: opacity 0.3s ease;
//           z-index: -1;
//         }
//         .tab-button-inactive:hover::before {
//           opacity: 0.6;
//           animation: pulsingBorder 4s linear infinite;
//         }
//         .glow-button {
//           position: relative;
//           overflow: visible;
//           z-index: 1;
//         }
//         .glow-button::after {
//           content: "";
//           position: absolute;
//           bottom: -6px;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 80%;
//           height: 20px;
//           background: currentColor;
//           filter: blur(12px);
//           opacity: 0.4;
//           z-index: -1;
//           border-radius: 50%;
//           pointer-events: none;
//           transition: all 0.3s ease;
//         }
//         .glow-button:hover::after {
//           height: 24px;
//           filter: blur(16px);
//           opacity: 0.5;
//         }
//         .custom-scrollbar {
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//         }
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 0px;
//           background: transparent;
//         }
//         @media (max-width: 768px) {
//           table {
//             font-size: 0.875rem;
//           }
//           th,
//           td {
//             padding: 0.75rem !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
