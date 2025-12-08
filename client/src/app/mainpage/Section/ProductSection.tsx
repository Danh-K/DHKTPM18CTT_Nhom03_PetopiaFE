"use client";
import React from "react";
import { Loading } from "../../components/loading";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCartStore";
import MiniCart from "@/app/carts/_components/MiniCart";
import type { Pet } from "@/types/Pet";
import { usePets } from "@/hook/usePets";
import ProductCard from "@/app/components/product/ProductCard"; 

export default function ProductSection() {
  const { data: pets, isLoading, error } = usePets();
  const { addItem, openMiniCart } = useCart();
  const router = useRouter();

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-10 text-red-500">Lỗi: {error.message}</div>;

  const productList: Pet[] = (Array.isArray(pets) ? pets : Object.values(pets ?? {})) as Pet[];
  const products = productList.slice(0, 6);

  return (
    <section className="py-16 px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl text-[#8B4513] mb-4 font-bold">SẢN PHẨM NỔI BẬT</h2>
          <div className="h-1 w-20 bg-[#FF6B6B] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.petId}
              product={{
                petId: product.petId,
                name: product.name,
                price: product.price || 0,
                discountPrice: product.discountPrice || undefined,
                rating: product.rating || undefined,
                image: product.mainImageUrl || "/assets/imgs/imgPet/animal-8165466_1280.jpg",
                isSale: !!product.discountPrice
              }}
              onAddToCart={() => {
                addItem({ pet: product as Pet, quantity: 1, img: product.mainImageUrl || "" });
                openMiniCart();
              }}
              onBuyNow={() => {
                addItem({ pet: product as Pet, quantity: 1, img: product.mainImageUrl || "" });
                router.push('/carts');
              }}
            />
          ))}
        </div>
      </div>
      <MiniCart />
    </section>
  );
}