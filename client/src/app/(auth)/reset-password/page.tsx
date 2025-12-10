"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/utils/axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ResetSchema = z.object({
  newPassword: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type ResetForm = z.infer<typeof ResetSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(ResetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    try {
      await axiosInstance.post("/auth/reset-password", {
        email,
        newPassword: data.newPassword,
      });

      alert("Đổi mật khẩu thành công!");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data || "Có lỗi xảy ra!");
    }
  };

  if (!email) return <p>Thiếu email!</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">Đặt lại mật khẩu</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Mật khẩu mới:</label>
        <input
          type="password"
          {...register("newPassword")}
          className="border p-2 w-full"
        />

        {errors.newPassword && (
          <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
        )}

        <button
          disabled={isSubmitting}
          className="bg-purple-600 text-white p-2 mt-4 w-full"
        >
          {isSubmitting ? "Đang xử lý..." : "Lưu mật khẩu mới"}
        </button>
      </form>
    </div>
  );
}
