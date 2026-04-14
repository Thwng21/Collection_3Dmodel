"use client";
import Image from "next/image";
import House from "./components/House";
import RobotDance from "./components/RobotDance";
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 text-green-950  font-sans dark:bg-black">
    
      {/* <House/> */}
      <RobotDance/>
      ĐÂY LÀ TRANG TỔNG HỢP CÁC DỰ ÁN 3D CỦA TÔI, BẠN CÓ THỂ NHẤP VÀO ĐỂ XEM CHI TIẾT HƠN VỀ MỖI DỰ ÁN. CẢM ƠN BẠN ĐÃ GHÉ THĂM!
    </div>
  );
}
