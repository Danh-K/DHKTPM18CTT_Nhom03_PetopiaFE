"use client";

import { useState } from "react";
import DeliveryManagement from "./DeliveryManagement";
import DeliveryDetailView from "./DeliveryDetailView";

export default function DeliveryHome({ darkMode = false }) {
  const [currentView, setCurrentView] = useState("list"); // "list" hoặc "detail"
  const [selectedId, setSelectedId] = useState(null);

  const goToDetail = (deliveryId) => {
    setSelectedId(deliveryId);
    setCurrentView("detail");
  };

  const goBack = () => {
    setCurrentView("list");
    setSelectedId(null);
  };

  return (
    <>
      {currentView === "list" ? (
        <DeliveryManagement darkMode={darkMode} onViewDetail={goToDetail} />
      ) : (
        <DeliveryDetailView
          deliveryId={selectedId}
          darkMode={darkMode}
          onBack={goBack}
        />
      )}
    </>
  );
}