'use client';

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusStyles: Record<
  string,
  { badge: string; accent: string; description: string }
> = {
  "Đang giao": {
    badge: "bg-orange-50 text-amber-800",
    accent: "text-orange-500",
    description: "Đơn hàng đang trên đường vận chuyển",
  },
  "Đã giao": {
    badge: "bg-green-50 text-green-600",
    accent: "text-green-600",
    description: "Đơn hàng đã được giao thành công",
  },
  "Chờ xác nhận": {
    badge: "bg-yellow-50 text-amber-600",
    accent: "text-amber-600",
    description: "Đơn hàng sẽ được xác nhận trong ít phút",
  },
  "Tất cả": {
    badge: "bg-gray-100 text-gray-600",
    accent: "text-amber-800",
    description: "",
  },
};

const statusFilters = ["Tất cả", "Chờ xác nhận", "Đang giao", "Đã giao"];

const mockOrders = [
  {
    id: "PET-202401",
    date: "12/11/2024 - 09:12",
    status: "Đang giao",
    total: "1.250.000đ",
    payment: "VNPay",
    address: "12 Nguyễn Văn Bảo, Gò Vấp, TP.HCM",
    items: [
      {
        name: "Thức ăn hạt hữu cơ cho chó cỡ nhỏ",
        qty: 2,
        price: "450.000đ",
      },
      {
        name: "Dầu tắm dịu nhẹ cho thú cưng",
        qty: 1,
        price: "350.000đ",
      },
    ],
  },
  {
    id: "PET-202354",
    date: "02/11/2024 - 15:47",
    status: "Đã giao",
    total: "820.000đ",
    payment: "COD",
    address: "85 Thành Thái, Quận 10, TP.HCM",
    items: [
      {
        name: "Gói spa làm đẹp toàn diện",
        qty: 1,
        price: "520.000đ",
      },
      {
        name: "Phụ kiện vòng cổ handmade",
        qty: 1,
        price: "300.000đ",
      },
    ],
  },
  {
    id: "PET-202288",
    date: "28/10/2024 - 20:05",
    status: "Chờ xác nhận",
    total: "2.150.000đ",
    payment: "ZaloPay",
    address: "250 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
    items: [
      {
        name: "Combo vaccine tổng quát cho mèo",
        qty: 1,
        price: "1.500.000đ",
      },
      {
        name: "Bánh thưởng vị cá hồi",
        qty: 3,
        price: "650.000đ",
      },
    ],
  },
];

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return mockOrders.filter((order) => {
      const matchFilter =
        activeFilter === "Tất cả" || order.status === activeFilter;
      const matchSearch =
        !term ||
        order.id.toLowerCase().includes(term) ||
        order.items.some((item) => item.name.toLowerCase().includes(term));
      return matchFilter && matchSearch;
    });
  }, [activeFilter, searchTerm]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-amber-900">
          Đơn hàng của tôi
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Theo dõi tình trạng đơn mua trên Petopia – tương tự trải nghiệm Shopee
          bạn đã quen thuộc.
        </p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Tabs
            value={activeFilter}
            onValueChange={setActiveFilter}
            className="w-full md:w-auto"
          >
            <TabsList className="flex flex-wrap gap-1 bg-transparent p-0">
              {statusFilters.map((status) => (
                <TabsTrigger
                  key={status}
                  value={status}
                  className="rounded-full border px-4 py-1 text-sm data-[state=active]:bg-amber-800 data-[state=active]:text-white data-[state=active]:border-amber-800"
                >
                  {status}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Input
            placeholder="Tìm theo mã đơn hoặc sản phẩm"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="bg-gray-50 border-gray-200"
          />
        </div>
      </section>

      <section className="space-y-4">
        {filteredOrders.length === 0 && (
          <Card className="border-dashed text-center">
            <CardContent className="py-10 space-y-2">
              <p className="text-base font-semibold text-amber-900">
                Chưa có đơn hàng nào phù hợp
              </p>
              <p className="text-sm text-gray-500">
                Thử chuyển tab hoặc tìm bằng từ khóa khác nhé.
              </p>
            </CardContent>
          </Card>
        )}
        {filteredOrders.map((order) => {
          const status = statusStyles[order.status];
          return (
            <Card key={order.id} className="border-orange-200 shadow-sm">
              <CardHeader className="border-b pb-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span className="font-semibold text-amber-800">
                      Petopia Mall
                    </span>
                    <span>•</span>
                    <span>Mã đơn: {order.id}</span>
                    <span>•</span>
                    <span>{order.date}</span>
                  </div>
                  <Badge className={`${status.badge} border-0`}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {order.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 text-sm text-gray-700 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Số lượng: x{item.qty}</p>
                    </div>
                    <p className="font-semibold text-gray-800">{item.price}</p>
                  </div>
                ))}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-orange-50 px-4 py-3 text-sm text-gray-600">
                  <p>
                    Phương thức:{" "}
                    <span className="font-medium text-gray-900">
                      {order.payment}
                    </span>
                  </p>
                  <p>
                    Thành tiền:{" "}
                    <span className="text-lg font-semibold text-amber-800">
                      {order.total}
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-3">
                  <Button variant="outline" size="sm">
                    Liên hệ Shop
                  </Button>
                  <Button variant="outline" size="sm">
                    Theo dõi vận chuyển
                  </Button>
                  <Button size="sm" className="bg-amber-800 hover:bg-amber-900">
                    {order.status === "Đã giao" ? "Đánh giá" : "Mua lại"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

