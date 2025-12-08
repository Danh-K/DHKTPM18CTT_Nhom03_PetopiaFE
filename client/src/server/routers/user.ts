// src/server/routers/user.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

// Định nghĩa Enum cho vai trò người dùng
export const UserRole = z.enum(["ADMIN", "CUSTOMER"]);

export type User = {
  userId: string; // PK
  username: string;
  email: string;
  passwordHash: string; // Sẽ được hash ở server, không bao giờ lộ ra client
  fullName?: string | null;
  phoneNumber?: string | null;
  role: z.infer<typeof UserRole>;
  loyaltyPoints: number;
  isActive: boolean;
  createdAt: string; // DATETIME -> ISO string
  updatedAt: string; // DATETIME -> ISO string
  avatar: string;
};

// Dữ liệu mẫu - Thay thế bằng logic truy vấn CSDL của bạn
const mockUsers: User[] = [
  {
    userId: "U001",
    username: "johndoe",
    email: "john.doe@example.com",
    passwordHash: "hashed_password_1", // Đã được hash
    fullName: "John Doe",
    phoneNumber: "0912345678",
    role: "CUSTOMER",
    loyaltyPoints: 150,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    userId: "U002",
    username: "admin_user",
    email: "admin@example.com",
    passwordHash: "hashed_password_2", // Đã được hash
    fullName: "Admin Power",
    phoneNumber: "0987654321",
    role: "ADMIN",
    loyaltyPoints: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const userRouter = router({
  /**
   * Lấy danh sách tất cả người dùng (chỉ dành cho admin)
   */
  getAll: publicProcedure.query(() => {
    // Trong thực tế, bạn cần kiểm tra vai trò của người dùng ở đây
    return mockUsers;
  }),

  /**
   * Lấy thông tin một người dùng bằng ID
   */
  getById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      const user = mockUsers.find((u) => u.userId === input.userId);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Không tìm thấy người dùng.",
        });
      }
      return user;
    }),

  /**
   * Tạo người dùng mới (Đăng ký)
   */
  update: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        fullName: z.string().optional(),
        phoneNumber: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, ...updateData } = input;
      
      // Logic để tìm và cập nhật user trong CSDL
      const userIndex = mockUsers.findIndex(u => u.userId === userId);
      if (userIndex === -1) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updateData, updatedAt: new Date().toISOString() };
      
      console.log("Updated User:", mockUsers[userIndex]);

      // Trả về user đã cập nhật
      return mockUsers[userIndex];
    }),
  create: publicProcedure
    .input(
      z.object({
        username: z.string().min(3, "Tên người dùng phải có ít nhất 3 ký tự."),
        email: z.string().email("Email không hợp lệ."),
        password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
        fullName: z.string().optional(),
        phoneNumber: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Giả lập kiểm tra email hoặc username đã tồn tại
      if (mockUsers.some((u) => u.email === input.email)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email này đã được sử dụng.",
        });
      }
      if (mockUsers.some((u) => u.username === input.username)) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Tên người dùng này đã tồn tại.",
        });
      }
      
      // Giả lập việc hash mật khẩu ở server
      // KHÔNG BAO GIỜ lưu mật khẩu gốc vào CSDL
      const passwordHash = `hashed_${input.password}`;
      
      const now = new Date().toISOString();
      const newUser: User = {
        userId: `U${Date.now()}`, // Tạo ID mới
        username: input.username,
        email: input.email,
        passwordHash: passwordHash,
        fullName: input.fullName || null,
        phoneNumber: input.phoneNumber || null,
        role: "CUSTOMER", // Mặc định vai trò là khách hàng
        loyaltyPoints: 0, // Mặc định điểm tích lũy là 0
        isActive: true, // Mặc định tài khoản được kích hoạt
        createdAt: now,
        updatedAt: now,
      };

      // Logic để lưu `newUser` vào CSDL của bạn sẽ ở đây
      // mockUsers.push(newUser);

      // Trả về đối tượng người dùng mới (loại bỏ passwordHash)
      const { passwordHash: _, ...userToReturn } = newUser;
      return userToReturn;
    }),
});