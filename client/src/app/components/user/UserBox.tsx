"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Heart,
  Bookmark,
  Clock,
  Star,
  Package,
} from "lucide-react";
import Link from "next/link";
export default function UserBox() {
  return (
    <Card className="shadow-xl border rounded-xl overflow-hidden">
      <CardContent className="p-0">
        {/* Banner */}
        <div className="bg-[#FDF5F0] p-4 flex justify-between items-center">
          <div>
            <p className="font-bold text-[#7B4F35] text-lg">Mua thì hời, bán thì lời.</p>
            <p className="text-sm text-gray-600">Đăng nhập cái đã!</p>
          </div>
          <div className="text-4xl">🐝</div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 p-4">
          <Link
            href="/register"
            className="flex-1 border border-[#7B4F35] text-[#7B4F35] hover:bg-[#7B4F35]/10 text-center py-2 rounded"
          >
            Tạo tài khoản
          </Link>
          <Link
            href="/users"
            className="flex-1 bg-[#7B4F35] hover:bg-[#6B3F25] text-white text-center py-2 rounded"
          >
            Đăng nhập
          </Link>
        </div>

        {/* Tiện ích */}
        <div className="border-t">
          <ul className="divide-y">
            <li className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer">
              <span className="flex items-center gap-2 text-gray-700">
                <Heart className="w-5 h-5 text-[#7B4F35]" />
                Tin đăng đã lưu
              </span>
            </li>
            <li className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer">
              <span className="flex items-center gap-2 text-gray-700">
                <Bookmark className="w-5 h-5 text-[#7B4F35]" />
                Tìm kiếm đã lưu
              </span>
            </li>
            <li className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer">
              <span className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5 text-[#7B4F35]" />
                Lịch sử xem tin
              </span>
            </li>
            <li className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer">
              <span className="flex items-center gap-2 text-gray-700">
                <Star className="w-5 h-5 text-[#7B4F35]" />
                Đánh giá từ tôi
              </span>
            </li>
            <li>
              <Link
                href="/orders"
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#7B4F35]" />
                  Đơn hàng của tôi
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
