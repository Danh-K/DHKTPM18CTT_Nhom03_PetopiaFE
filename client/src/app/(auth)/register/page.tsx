"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"


import { useRouter } from "next/navigation"


import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RegisterRequest, RegisterSchema } from "@/lib/validations/auth"
import { authService } from "@/service/auth.service"
import { useAuthStore } from "@/store/useAuthStore"
export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {setAuth} = useAuthStore()
  
  const form = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",      
      email: "",
      fullName: "",      
      phoneNumber: "",   
      password: "",
      confirmPassword: "",
    },
  })

  
  async function onSubmit(values: RegisterRequest) {
    setIsLoading(true)
    try {
      const data = await authService.register(values) 
      
      setAuth(data.user, data.accessToken)
      
      alert("Đăng ký thành công! Đang chuyển hướng...")
      
      router.push("/") 
      
    } catch (error: any) {
      console.error(error)
      alert("Đăng ký thất bại: " + (error.response?.data?.message || "Lỗi hệ thống"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-50 py-12 px-4">
      <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#C46C2B]">
            Đăng ký tài khoản
          </CardTitle>
          <p className="text-gray-500 text-sm mt-2">
            Tạo tài khoản mới để trải nghiệm Petopia!
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} className="bg-gray-50 focus-visible:ring-[#C46C2B]" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder="user123" {...field} className="bg-gray-50 focus-visible:ring-[#C46C2B]" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@domain.com" {...field} className="bg-gray-50 focus-visible:ring-[#C46C2B]" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="09xxxxxxxxx" {...field} className="bg-gray-50 focus-visible:ring-[#C46C2B]" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} className="bg-gray-50 focus-visible:ring-[#C46C2B]" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Nhập lại mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} className="bg-gray-50 focus-visible:ring-[#C46C2B]" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#C46C2B] text-white font-bold rounded-lg py-3 text-lg hover:bg-[#7B4F35] transition mt-4"
              >
                 {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Đăng ký"}
              </Button>

            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-[#C46C2B] font-semibold hover:underline">
              Đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}