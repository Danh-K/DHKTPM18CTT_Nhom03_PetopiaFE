import { useState, useEffect, useCallback } from "react";
import reviewApi from "../api/reviewApi";
import petApi from "../api/petApi";
import { toast } from "react-toastify";

export const useReviewManagement = () => {
  const [pets, setPets] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    repliedCount: 0,
    unrepliedCount: 0,
    starCounts: {},
  });
  const [loading, setLoading] = useState(false);

  // --- FETCH DATA ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, reviewsRes] = await Promise.all([
        reviewApi.getStats(),
        reviewApi.getAll({ size: 2000 }),
      ]);

      const statsData = statsRes.data || statsRes;
      if (statsData) setStats(statsData);

      const rawReviews = reviewsRes.data || reviewsRes;
      const reviewList = Array.isArray(rawReviews)
        ? rawReviews
        : rawReviews.content || [];
      setAllReviews(reviewList);

      // Gom nhóm Review theo Pet
      const petMap = new Map();
      reviewList.forEach((r) => {
        if (!petMap.has(r.petId)) {
          petMap.set(r.petId, {
            id: r.petId,
            name: r.petName,
            imageUrl: r.petImage,
            categoryName: "Thú cưng",
            totalRating: 0,
            reviewCount: 0,
            unrepliedCount: 0,
          });
        }
        const pet = petMap.get(r.petId);
        pet.totalRating += r.rating;
        pet.reviewCount += 1;
        if (!r.reply || r.reply.trim() === "") {
          pet.unrepliedCount += 1;
        }
      });

      const mappedPets = Array.from(petMap.values()).map((p) => ({
        ...p,
        avgRating:
          p.reviewCount > 0 ? (p.totalRating / p.reviewCount).toFixed(1) : 0,
      }));

      mappedPets.sort((a, b) => b.unrepliedCount - a.unrepliedCount);
      setPets(mappedPets);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- ACTIONS ---

  // 1. Lấy review chi tiết của 1 pet (Gọi API riêng để đảm bảo data mới nhất)
  const fetchPetReviews = async (petId) => {
    try {
      const res = await reviewApi.getByPet(petId);
      const data = res.data || res;
      return data.content || [];
    } catch (error) {
      return [];
    }
  };

  // 2. Trả lời / Cập nhật câu trả lời
  const replyReview = async (reviewId, content) => {
    try {
      await reviewApi.reply(reviewId, content);
      toast.success("Đã gửi phản hồi thành công!");
      await fetchData(); // Refresh Dashboard Stats
      return true;
    } catch (error) {
      toast.error(
        "Lỗi: " + (error.response?.data?.message || "Không thể trả lời")
      );
      return false;
    }
  };

  // 3. Xóa câu trả lời của Admin
  const deleteAdminReply = async (reviewId) => {
    try {
      await reviewApi.deleteReply(reviewId);
      toast.success("Đã xóa câu trả lời!");
      await fetchData();
      return true;
    } catch (error) {
      toast.error("Lỗi khi xóa câu trả lời");
      return false;
    }
  };

  // 4. Xóa Review của User (Spam)
  const deleteReview = async (reviewId) => {
    try {
      await reviewApi.deleteReview(reviewId);
      toast.success("Đã xóa đánh giá vi phạm!");
      await fetchData();
      return true;
    } catch (error) {
      toast.error("Lỗi khi xóa đánh giá");
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    pets,
    stats,
    loading,
    fetchPetReviews,
    replyReview,
    deleteAdminReply,
    deleteReview,
    fetchData,
  };
};
