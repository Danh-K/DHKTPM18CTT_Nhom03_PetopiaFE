"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

import { UserUpdateDTO, Address } from "@/service/user.service";
import { 
  User, Phone, MapPin, Camera, Save, Sparkles, Loader2, PawPrint, 
  Plus, Edit2, Trash2, CheckCircle2, X, Globe
} from "lucide-react";
import { toast } from "sonner";
import { useAddAddress, useDeleteAddress, useMyAddresses, useSetDefaultAddress, useUpdateAddress, useUpdateProfile, useUserProfile } from "@/hook/useUsers";

export default function ProfilePage() {
 
  const { data: user, isLoading: loadingUser } = useUserProfile();
  const { data: addresses = [], isLoading: loadingAddr } = useMyAddresses();
  
 
  const { mutate: updateProfile, isPending: updatingProfile } = useUpdateProfile();
  
  const { mutate: addAddress, isPending: addingAddr } = useAddAddress();
  const { mutate: updateAddress, isPending: updatingAddr } = useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();
  const { mutate: setDefaultAddress } = useSetDefaultAddress();

 
 
  const [formData, setFormData] = useState<UserUpdateDTO>({ fullName: "", phoneNumber: "" });
  
 
  const [previewAvatar, setPreviewAvatar] = useState<string>(""); 
  
 
  const fileInputRef = useRef<HTMLInputElement>(null);

 
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);
  const defaultAddrForm: Address = {
      street: "", ward: "", district: "", province: "", country: "Vietnam", isDefault: false
  };
  const [addrForm, setAddrForm] = useState<Address>(defaultAddrForm);

 
 
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
      });
     
      setPreviewAvatar(user.avatar || "");
    }
  }, [user]);

 
  
 
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       
        const objectUrl = URL.createObjectURL(file);
        setPreviewAvatar(objectUrl);

       
        setFormData(prev => ({ ...prev, file: file }));

       
        return () => URL.revokeObjectURL(objectUrl);
    }
  };

 
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
   console.log("formatData: " , formData);
    updateProfile(formData);
  };

 
  const openAddAddr = () => { setEditingAddr(null); setAddrForm(defaultAddrForm); setShowAddrModal(true); };
  const openEditAddr = (addr: Address) => { setEditingAddr(addr); setAddrForm(addr); setShowAddrModal(true); };
  
  const handleSaveAddress = (e: React.FormEvent) => {
      e.preventDefault();
     
      const submitData = { ...addrForm, ward: addrForm.ward || "", district: addrForm.district || "" };
      if (editingAddr?.addressId) {
          updateAddress(submitData);
      } else {
          addAddress(submitData);
      }
      setShowAddrModal(false);
  };

 
  if (loadingUser) return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#FDF5F0]">
        <Loader2 className="animate-spin text-[#FF6B6B] w-12 h-12" />
        <p className="mt-4 text-[#5A3E2B] font-bold animate-pulse">Đang tìm hồ sơ của Sen...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF5F0] py-12 px-4 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-10 left-10 text-[#FF6B6B] opacity-10 -rotate-12"><PawPrint size={150} /></div>
      <div className="absolute bottom-10 right-10 text-[#FF6B6B] opacity-10 rotate-12"><PawPrint size={180} /></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        
        <h1 className="text-3xl font-bold text-[#5A3E2B] mb-8 text-center flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-400 fill-yellow-400" /> Hồ Sơ Của Sen <Sparkles className="text-yellow-400 fill-yellow-400" />
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- COLUMN 1: Avatar & Personal Info --- */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-[2rem] p-6 shadow-xl border-4 border-white relative overflow-hidden">
                    {/* Pink Header Background */}
                    <div className="absolute top-0 left-0 w-full h-24 bg-[#FF6B6B]"></div>
                    
                    <div className="relative z-10 flex flex-col items-center mt-4">
                        
                        {/* Avatar Circle */}
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="w-40 h-40 rounded-full border-[6px] border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                <Image 
                                    src={previewAvatar || "/assets/imgs/imgPet/cat-6593947_1280.jpg"} 
                                    alt="Avatar" 
                                    width={160} height={160}
                                    className="object-cover w-full h-full"
                                    unoptimized={true}
                                    onError={(e) => { e.currentTarget.srcset = "/assets/imgs/imgPet/cat-6593947_1280.jpg" }}
                                />
                            </div>
                            
                            {/* Camera Icon Overlay */}
                            <div className="absolute bottom-2 right-2 bg-[#5A3E2B] text-white p-2.5 rounded-full border-2 border-white shadow-md group-hover:bg-[#FF6B6B] transition-colors">
                                <Camera size={18} />
                            </div>
                            
                            {/* Input File Ẩn */}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                            />
                        </div>

                        <h2 className="text-xl font-bold text-[#5A3E2B] mt-4 text-center">{formData.fullName || "Sen Chưa Đặt Tên"}</h2>
                        <p className="text-[#FF6B6B] bg-[#FF6B6B]/10 px-3 py-1 rounded-full text-xs font-bold mt-1">@{user?.username}</p>
                    </div>

                    {/* Edit Form */}
                    <form onSubmit={handleSaveProfile} className="mt-8 space-y-5">
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#8B6E5B] uppercase ml-1 flex items-center gap-1">
                                <User size={12}/> Họ và tên
                            </label>
                            <input 
                                name="fullName" value={formData.fullName} onChange={handleInfoChange}
                                className="w-full bg-[#F9F9F9] border-2 border-transparent focus:border-[#FF6B6B] rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all placeholder-gray-300 text-[#5A3E2B]"
                                placeholder="Tên hiển thị"
                            />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#8B6E5B] uppercase ml-1 flex items-center gap-1">
                                <Phone size={12}/> Số điện thoại
                            </label>
                            <input 
                                name="phoneNumber" value={formData.phoneNumber} onChange={handleInfoChange}
                                className="w-full bg-[#F9F9F9] border-2 border-transparent focus:border-[#FF6B6B] rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all placeholder-gray-300 text-[#5A3E2B]"
                                placeholder="Số điện thoại"
                            />
                         </div>
                         
                         <button 
                            type="submit" disabled={updatingProfile}
                            className="w-full bg-[#5A3E2B] hover:bg-[#4a332a] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#5A3E2B]/20 mt-4 flex items-center justify-center gap-2 transition-all active:scale-95 hover:-translate-y-1"
                         >
                            {updatingProfile ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} 
                            Lưu Thông Tin
                         </button>
                    </form>
                </div>
            </div>

            {/* --- COLUMN 2: Address Book --- */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-[2rem] p-8 shadow-xl border-4 border-white h-full min-h-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-[#5A3E2B] flex items-center gap-2">
                            <MapPin className="text-[#FF6B6B] fill-[#FF6B6B]" /> Sổ Địa Chỉ
                        </h3>
                        <button 
                            onClick={openAddAddr} 
                            className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 transition-transform hover:-translate-y-0.5 active:scale-95"
                        >
                            <Plus size={18} /> Thêm Mới
                        </button>
                    </div>

                    {loadingAddr ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 className="animate-spin text-[#FF6B6B] w-8 h-8" />
                            <span className="text-gray-400 text-sm">Đang tải danh sách...</span>
                        </div>
                    ) : addresses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-[#F5E6D3] rounded-2xl bg-[#FFfaf5]">
                            <MapPin size={48} className="text-[#FF6B6B] opacity-50 mb-3" />
                            <p className="text-[#5A3E2B]">Chưa có địa chỉ nào.</p>
                            <p className="text-gray-400 text-sm">Thêm địa chỉ để chúng mình giao hàng nhé!</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {addresses.map((addr : Address) => (
                                <div key={addr.addressId} className={`border-2 rounded-2xl p-5 relative transition-all duration-300 ${addr.isDefault ? 'border-[#FF6B6B] bg-[#FFF5F5] shadow-sm' : 'border-gray-100 hover:border-[#FF6B6B]/50 hover:shadow-md'}`}>
                                    {addr.isDefault && (
                                        <div className="absolute top-0 right-0 bg-[#FF6B6B] text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg flex items-center gap-1 shadow-sm">
                                            <CheckCircle2 size={12} /> Mặc định
                                        </div>
                                    )}
                                    <div className="pr-4">
                                        <p className="font-bold text-[#5A3E2B] text-lg">{addr.street}</p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {addr.ward ? `${addr.ward}, ` : ""}
                                            {addr.district ? `${addr.district}, ` : ""}
                                            <span className="font-medium text-[#5A3E2B]">{addr.province}</span>
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1 flex items-center gap-1"><Globe size={10} /> {addr.country}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-5 pl-0 sm:pl-[52px]">
                                        <button onClick={() => openEditAddr(addr)} className="text-gray-600 hover:text-[#FF6B6B] bg-white border border-gray-200 hover:border-[#FF6B6B] px-4 py-1.5 rounded-lg text-xs font-bold flex gap-1.5 transition-all">
                                            <Edit2 size={12} /> Sửa
                                        </button>
                                        {!addr.isDefault && (
                                            <>
                                                <button onClick={() => deleteAddress(addr.addressId!)} className="text-gray-400 hover:text-red-600 bg-white border border-gray-200 hover:border-red-600 px-4 py-1.5 rounded-lg text-xs font-bold flex gap-1.5 transition-all">
                                                    <Trash2 size={12} /> Xóa
                                                </button>
                                                <button onClick={() => setDefaultAddress(addr.addressId!)} className="text-[#FF6B6B] hover:text-white bg-white hover:bg-[#FF6B6B] border border-[#FF6B6B] px-4 py-1.5 rounded-lg text-xs font-bold transition-all ml-auto sm:ml-0">
                                                    Đặt làm mặc định
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* --- MODAL ADD/EDIT ADDRESS --- */}
      {showAddrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#5A3E2B]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-8 relative animate-in zoom-in-95 duration-200 border-4 border-[#FDF5F0]">
                  <button onClick={() => setShowAddrModal(false)} className="absolute top-5 right-5 text-gray-400 hover:text-[#FF6B6B] transition-colors"><X size={28} /></button>
                  
                  <h3 className="text-2xl font-bold text-[#5A3E2B] mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFF0F5] flex items-center justify-center text-[#FF6B6B]">
                        {editingAddr ? <Edit2 size={20}/> : <Plus size={20}/>}
                      </div>
                      {editingAddr ? "Cập Nhật Địa Chỉ" : "Thêm Địa Chỉ Mới"}
                  </h3>
                  
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                      {/* Address Fields */}
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#8B6E5B] uppercase ml-1">Địa chỉ cụ thể <span className="text-red-500">*</span></label>
                          <input required value={addrForm.street} onChange={(e) => setAddrForm({...addrForm, street: e.target.value})} className="w-full bg-[#F9F9F9] border-2 border-transparent focus:border-[#FF6B6B] rounded-xl px-4 py-3.5 outline-none text-sm font-medium text-[#5A3E2B]" placeholder="Ví dụ: 123 Đường Nguyễn Huệ" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[#8B6E5B] uppercase ml-1">Phường / Xã</label>
                              <input value={addrForm.ward || ""} onChange={(e) => setAddrForm({...addrForm, ward: e.target.value})} className="w-full bg-[#F9F9F9] border-2 border-transparent focus:border-[#FF6B6B] rounded-xl px-4 py-3.5 outline-none text-sm font-medium" placeholder="Phường..." />
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[#8B6E5B] uppercase ml-1">Quận / Huyện</label>
                              <input value={addrForm.district || ""} onChange={(e) => setAddrForm({...addrForm, district: e.target.value})} className="w-full bg-[#F9F9F9] border-2 border-transparent focus:border-[#FF6B6B] rounded-xl px-4 py-3.5 outline-none text-sm font-medium" placeholder="Quận..." />
                          </div>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#8B6E5B] uppercase ml-1">Tỉnh / Thành phố <span className="text-red-500">*</span></label>
                          <input required value={addrForm.province} onChange={(e) => setAddrForm({...addrForm, province: e.target.value})} className="w-full bg-[#F9F9F9] border-2 border-transparent focus:border-[#FF6B6B] rounded-xl px-4 py-3.5 outline-none text-sm font-medium" placeholder="TP Hồ Chí Minh" />
                      </div>

                      <div className="pt-6 flex gap-3">
                          <button type="button" onClick={() => setShowAddrModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3.5 rounded-xl transition-colors">Hủy</button>
                          <button type="submit" disabled={addingAddr || updatingAddr} className="flex-1 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-200 transition-all flex justify-center items-center gap-2 hover:-translate-y-1">
                              {(addingAddr || updatingAddr) && <Loader2 className="animate-spin" size={18} />} Lưu Địa Chỉ
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}