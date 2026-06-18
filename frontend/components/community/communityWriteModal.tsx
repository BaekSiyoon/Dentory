import React, { useState } from "react";

type PostType = "질문" | "리뷰";

type Category =
  | "일반 진료"
  | "심미 / 교정"
  | "잇몸 / 구강"
  | "수술 / 외과"
  | "특수진료"
  | "기타 전문";

interface CommunityWriteModalProps {
  open: boolean;
  onClose: () => void;
}

const categories: Category[] = [
  "일반 진료",
  "심미 / 교정",
  "잇몸 / 구강",
  "수술 / 외과",
  "특수진료",
  "기타 전문",
];

const CommunityWriteModal = ({
  open,
  onClose,
}: CommunityWriteModalProps) => {
  const [postType, setPostType] = useState<PostType>("질문");
  const [category, setCategory] = useState<Category>("일반 진료");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/35 px-5">
      <section className="max-h-[88vh] w-full max-w-[600px] overflow-y-auto overflow-x-hidden rounded-[22px] bg-white shadow-[0_16px_40px_rgba(60,45,35,0.22)]">
        <div className="flex items-center justify-between border-b border-[#EEEAE5] px-7 py-5">
          <h2 className="text-[18px] font-extrabold text-[#3B2D22]">
            게시글 작성
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[26px] leading-none text-[#9A8068] transition hover:text-[#fcbf5d]"
          >
            ×
          </button>
        </div>

        <div className="px-7 py-5">
          {/* 게시글 타입 */}
          <div className="mb-4 flex gap-2">
            {(["질문", "리뷰"] as PostType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPostType(type)}
                className={`h-9 cursor-pointer rounded-full px-5 text-[13px] font-extrabold transition-all duration-200 ${
                  postType === type
                    ? "bg-[#F4A72D] text-white"
                    : "bg-[#F6EEDC] text-[#8E725C] hover:bg-[#FFF4D8]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* 진료과목 */}
          <div className="mb-4">
            <p className="mb-2.5 text-[14px] font-extrabold text-[#8E725C]">
              진료과목
            </p>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`h-8 cursor-pointer rounded-full px-3.5 text-[12px] font-extrabold transition-all duration-200 ${
                    category === item
                      ? "border border-[#F4A72D] bg-white text-[#F4A72D]"
                      : "border border-transparent bg-[#F6EEDC] text-[#8E725C] hover:bg-[#FFF4D8]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <label className="mb-4 block">
            <span className="mb-2 block text-[14px] font-extrabold text-[#8E725C]">
              제목
            </span>

            <input
              type="text"
              placeholder="제목을 입력하세요"
              className="h-11 w-full rounded-2xl bg-[#F6EEDC] px-4 text-[13px] font-bold text-[#5A4033] outline-none placeholder:text-[#C5A072] focus:ring-2 focus:ring-[#FCBF5D]"
            />
          </label>

          {/* 리뷰 선택 시에만 병원명 입력 */}
          {postType === "리뷰" && (
            <label className="mb-4 block">
              <span className="mb-2 block text-[14px] font-extrabold text-[#8E725C]">
                병원명
              </span>

              <input
                type="text"
                placeholder="방문하신 병원 이름을 입력하세요"
                className="h-11 w-full rounded-2xl bg-[#F6EEDC] px-4 text-[13px] font-bold text-[#5A4033] outline-none placeholder:text-[#C5A072] focus:ring-2 focus:ring-[#FCBF5D]"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-[14px] font-extrabold text-[#8E725C]">
              내용
            </span>

            <textarea
              placeholder="내용을 입력하세요"
              className="h-[120px] w-full resize-none rounded-2xl bg-[#F6EEDC] px-4 py-3.5 text-[13px] font-bold text-[#5A4033] outline-none placeholder:text-[#C5A072] focus:ring-2 focus:ring-[#FCBF5D]"
            />
          </label>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 cursor-pointer rounded-2xl bg-[#F6EEDC] text-[14px] font-extrabold text-[#8E725C] transition hover:bg-[#EFE3CF]"
            >
              취소
            </button>

            <button
              type="button"
              className="h-11 cursor-pointer rounded-2xl bg-[#F6EEDC] text-[14px] font-extrabold text-[#C5A072] transition hover:bg-[#FCBF5D] hover:text-[#5A4033]"
            >
              게시하기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityWriteModal;