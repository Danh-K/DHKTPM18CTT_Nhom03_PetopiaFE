import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/app/providers";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Toaster } from "sonner"; 
import ChatWidget from "@/app/chat/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Petopia - Thiên đường thú cưng",
  description: "Cung cấp thú cưng và dịch vụ chăm sóc tốt nhất",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
      >
        <TRPCProvider>
          <div className="font-sans flex flex-col min-h-screen w-full relative">
                
                
                <header className="w-full sticky top-0 z-50 shadow-lg">
                  <Header />
                </header>
          
                
                <main className="flex-1 bg-white w-full">
                  {children}
                </main>
          
                
                <footer className="w-full">
                  <Footer />
                </footer>

                
                
                <ChatWidget />
                
                <Toaster position="top-right" richColors />

             </div>
        </TRPCProvider>
      </body>
    </html>
  );
}