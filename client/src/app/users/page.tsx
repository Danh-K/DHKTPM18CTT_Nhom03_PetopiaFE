// src/app/account/page.tsx (Ví dụ)
"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/utils/trpc";
// import { useSession } from "next-auth/react"; // Giả sử bạn dùng NextAuth để lấy session

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/app/components/loading"; // Component loading của bạn

export default function UserProfilePage() {
  // Giả sử bạn lấy userId từ session
  // const { data: session } = useSession();
  // const userId = session?.user?.id;
  const userId = "U001"; // <<--- TẠM THỜI DÙNG ID CỨNG ĐỂ TEST

  const { data: user, isLoading, error } = trpc.user.getById.useQuery(
    { userId: userId },
    { enabled: !!userId }
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });

  // Khi có dữ liệu user, cập nhật state cho form
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // TODO: Gọi mutation để cập nhật thông tin
  const handleSaveChanges = () => {
    console.log("Saving data:", formData);
    // userUpdateMutation.mutate({ userId, ...formData });
    setIsEditing(false);
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center text-red-500 py-10">Lỗi: {error.message}</div>;
  if (!user) return <div className="text-center text-gray-500 py-10">Không tìm thấy người dùng.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tài khoản của tôi</h1>
      <div className="grid gap-8">
        {/* THẺ THÔNG TIN CÁ NHÂN */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Thông tin cá nhân</CardTitle>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Chỉnh sửa
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tên đăng nhập */}
              <div>
                <Label htmlFor="username">Tên đăng nhập</Label>
                <p id="username" className="font-semibold text-gray-700">{user.username}</p>
              </div>
              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <p id="email" className="font-semibold text-gray-700">{user.email}</p>
              </div>
            </div>

            {/* Họ và tên */}
            <div>
              <Label htmlFor="fullName">Họ và tên</Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên của bạn"
                />
              ) : (
                <p className="font-semibold text-gray-700">{user.fullName || "Chưa cập nhật"}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div>
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <p className="font-semibold text-gray-700">{user.phoneNumber || "Chưa cập nhật"}</p>
              )}
            </div>

            {/* Nút Lưu / Hủy khi chỉnh sửa */}
            {isEditing && (
              <div className="flex gap-4">
                <Button onClick={handleSaveChanges}>Lưu thay đổi</Button>
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Hủy</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* THẺ ĐIỂM THƯỞNG VÀ THÔNG TIN KHÁC */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin thành viên</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Điểm thành viên</Label>
              <p className="text-2xl font-bold text-yellow-500">{user.loyaltyPoints} điểm</p>
            </div>
            <div>
              <Label>Vai trò</Label>
              <div>
                <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"}>{user.role}</Badge>
              </div>
            </div>
             <div>
              <Label>Ngày tham gia</Label>
              <p className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}