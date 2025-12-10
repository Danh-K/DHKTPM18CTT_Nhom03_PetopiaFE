"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axiosInstance from "@/lib/utils/axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const VerifySchema = z.object({
  otp: z.string().min(4, "OTP tối thiểu 4 số"),
});

type VerifyForm = z.infer<typeof VerifySchema>;

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyForm>({
    resolver: zodResolver(VerifySchema),
  });

  const onSubmit = async (data: VerifyForm) => {
    try {
      await axiosInstance.post("/auth/verify-otp", {
        email,
        otp: data.otp,
      });

      alert("OTP hợp lệ!");
      router.push(`/reset-password?email=${email}`);
    } catch (err: any) {
      alert(err.response?.data || "OTP sai!");
    }
  };

  if (!email) return <p>Thiếu email!</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">Xác thực OTP</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Nhập OTP:</label>
        <input
          type="text"
          {...register("otp")}
          className="border p-2 w-full"
        />
        {errors.otp && (
          <p className="text-red-500 text-sm">{errors.otp.message}</p>
        )}

        <button
          disabled={isSubmitting}
          className="bg-green-600 text-white p-2 mt-4 w-full"
        >
          {isSubmitting ? "Đang kiểm tra..." : "Xác thực OTP"}
        </button>
      </form>
    </div>
  );
}
