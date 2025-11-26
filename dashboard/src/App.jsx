"use client";

import Sidebar from "./components/Sidebar";
import Header from "./pages/Header";
import Products from "./components/Products";
import { useState } from "react";
import MyInvoices from "./components/MyInvoices";
import CreateInvoice from "./components/CreateInvoice";
import Transactions from "./components/Transactions";
import SingleTransaction from "./components/SingleTransaction";
import AllUsers from "./components/AllUsers";
import Profile from "./components/Profile";
import RevenueStatistics from "./components/RevenueStatistics";
import PetStatistics from "./components/PetStatistics";
import Dashboard from "./components/Dashboard";
import ArticleManager from "./components/ArticleManager";
import PromotionManagement from "./components/promotions/PromotionManagement";
import PetsManagement from "./components/PetManagement/PetsManagement";
import ServiceVice from "./components/PetManagement/ServicesManagement";
import ReviewsManagement from "./components/PetManagement/ReviewsManagement";
import VaccinationManagement from "./components/PetManagement/VaccinationManagement";
import LoginPage from "./pages/LoginPage";
import useAuth from "./hooks/useAuth";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { isAuthenticated, user, logout, loading } = useAuth(); 

  const handleLoginSuccess = () => {
    setCurrentPage("dashboard");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "pets":
        return <PetsManagement />;
      case "services":
        return <ServiceVice />;
      case "reviews":
        return <ReviewsManagement />;
      case "injections":
        return <VaccinationManagement />;
      case "revenue-statistics":
        return <RevenueStatistics />;
      case "pet-statistics":
        return <PetStatistics />;
      case "articles":
        return <ArticleManager />;
      case "promotions":
        return <PromotionManagement />;
      case "invoices":
        return (
          <MyInvoices onCreateInvoice={() => setCurrentPage("create-invoice")} />
        );
      case "create-invoice":
        return <CreateInvoice onBack={() => setCurrentPage("invoices")} />;
      case "transactions":
        return (
          <Transactions
            onSelectTransaction={(tx) => {
              setSelectedTransaction(tx);
              setCurrentPage("single-transactions");
            }}
          />
        );
      case "single-transactions":
        return (
          <SingleTransaction
            transaction={selectedTransaction}
            onBack={() => setCurrentPage("transactions")}
          />
        );
      case "users":
        return <AllUsers />;
      case "user-profiles":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

if (loading) {
    return (
      <div className="min-h-screen bg-[#7b4f35] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-8 border-white/30 rounded-full animate-ping"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-8 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-8 text-white text-lg font-medium animate-pulse">
            Đang tải hệ thống...
          </p>
        </div>
      </div>
    );
  }

  // === CHƯA ĐĂNG NHẬP → HIỆN LOGIN ===
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-yellow-300">
        <LoginPage onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // === ĐÃ ĐĂNG NHẬP → GIAO DIỆN ADMIN ===
  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} user={user} logout={logout} />
      <Sidebar darkMode={darkMode} onItemClick={setCurrentPage} currentPage={currentPage} />

      <main className="pt-20 pl-64 transition-all duration-300">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
}
export default App;