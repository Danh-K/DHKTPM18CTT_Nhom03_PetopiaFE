import Cookies from "js-cookie";
import {Pet} from "../server/routers/pet";

/* ----- types ----- */



export type CartItem = {
  pet: Pet;
  quantity: number;
  img: string | null; // URL hoặc null nếu chưa có ảnh (dữ liệu cũ)
};

const CART_KEY = "cart";

/* ----- write ----- */
export function setCartCookie(cart: CartItem[], days = 7) {
  try {
    Cookies.set(CART_KEY, JSON.stringify(cart), { expires: days, path: "/" });
    
  } catch (err) {
    console.error("setCartCookie error:", err);
  }
}

/* ----- read + migrate ----- */
export function getCartCookie(): CartItem[] {
  try {
    const raw = Cookies.get(CART_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // migrate: nếu dữ liệu cũ thiếu img, thêm img: null
    return parsed.map((it: CartItem) => {
      // Nếu đã có img, giữ nguyên
      if (typeof it.img !== "undefined") {
        return {
          pet: it.pet,
          quantity: typeof it.quantity === "number" ? it.quantity : 1,
          img: it.img || null,
        };
      }
      // Nếu là dữ liệu cũ (không có img)
      return {
        pet: it.pet,
        quantity: typeof it.quantity === "number" ? it.quantity : 1,
        img: null,
      };
    });
  } catch (err) {
    console.error("getCartCookie parse error:", err);
    return [];
  }
}


/* ----- remove ----- */
export function removeCartCookie() {
  Cookies.remove(CART_KEY, { path: "/" });
}
