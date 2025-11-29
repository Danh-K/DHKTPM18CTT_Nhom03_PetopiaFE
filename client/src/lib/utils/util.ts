import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers/app";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}




export const trpc = createTRPCReact<AppRouter>();