"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 text-green-950 font-sans dark:bg-black">

      <p className="text-center max-w-xl mb-4">
        ĐÂY LÀ TRANG TỔNG HỢP CÁC DỰ ÁN 3D CỦA TÔI, BẠN CÓ THỂ NHẤP VÀO ĐỂ XEM CHI TIẾT HƠN VỀ MỖI DỰ ÁN. CẢM ƠN BẠN ĐÃ GHÉ THĂM!
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger  className="px-4 py-2 text-black rounded">
          Chọn Dự Án
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-2">
         <DropdownMenuItem>
            <Link href="/Robotdance">Robot Dance</Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href="/House">House</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/House">House</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/Girl">Girl</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
}