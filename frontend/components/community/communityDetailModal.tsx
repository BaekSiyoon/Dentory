import React from "react";
import { useRouter } from "next/router";

type PostType = "질문" | "리뷰";

type Category =
  | "전체"
  | "일반 진료"
  | "심미 / 교정"
  | "잇몸 / 구강"
  | "수술 / 외과"
  | "특수진료"
  | "기타 전문";

interface CommunityPost {
  id: number;
  type: PostType;
  category: Category;
  title: string;
  content: string;
  author: string;
  date: string;
  commentCount: number;
  likeCount: number;
  isMine?: boolean;
  verifiedReview?: boolean;
  hospitalId?: number;
  hospitalName?: string;
}

interface CommunityDetailModalProps {
  post: CommunityPost | null;
  onClose: () => void;
}

// 게시글 타입/진료과목 태그 색상
const badgeColors: Record<string, string> = {
  질문: "bg-[#FFF4E8] text-[#C88752]",
  리뷰: "bg-[#FFF4E8] text-[#C88752]",

  "일반 진료": "bg-[#FFF4CC] text-[#B8860B]",
  "심미 / 교정": "bg-[#FFF4CC] text-[#B8860B]",
  "잇몸 / 구강": "bg-[#FFF4CC] text-[#B8860B]",
  "수술 / 외과": "bg-[#FFF4CC] text-[#B8860B]",
  특수진료: "bg-[#FFF4CC] text-[#B8860B]",
  "기타 전문": "bg-[#FFF4CC] text-[#B8860B]",
};

const CommunityDetailModal = ({ post, onClose }: CommunityDetailModalProps) => {
  const router = useRouter();

  if (!post) {
    return null;
  }

  // 임시 댓글 데이터
  const comments =
    post.commentCount > 0
      ? [
          {
            id: 1,
            author: "치과러",
            date: "2시간 전",
            content:
              post.type === "리뷰"
                ? "후기 공유 감사합니다. 병원 선택할 때 참고할게요!"
                : "저도 비슷한 경험이 있었는데 병원에 한번 문의해보시는 게 좋을 것 같아요.",
            verified: true,
            isMine: false,
          },
          {
            id: 2,
            author: "나",
            date: "1시간 전",
            content: "맞아요. 저도 여러 곳 비교해보고 결정하는 게 좋다고 생각해요.",
            verified: false,
            isMine: true,
          },
        ]
      : [];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/35 px-5">
      <section className="max-h-[88vh] w-full max-w-[600px] overflow-y-auto overflow-x-hidden rounded-[22px] bg-white shadow-[0_16px_40px_rgba(60,45,35,0.22)]">
        {/* 상단 게시글 정보 */}
        <div className="px-7 py-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge text={post.type} />
                <Badge text={post.category} />

                {post.verifiedReview && (
                  <span className="flex items-center gap-1 rounded-full bg-[#DDECC8] px-3.5 py-1 text-[12px] font-bold text-[#7DA35A]">
                    <VerifyIcon />
                    인증 리뷰
                  </span>
                )}
              </div>

              <h2 className="text-[20px] font-extrabold text-[#3B2D22]">
                {post.title}
              </h2>

              {/* 리뷰글인 경우 클릭 시 병원 상세로 이동 */}
              {post.type === "리뷰" && post.hospitalName && (
                <button
                  type="button"
                  onClick={() => router.push(`/dental/${post.hospitalId}`)}
                  className="mt-3 flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E7D8C1] bg-[#F6EEDC] px-3.5 py-1.5 text-[12px] font-bold text-[#6A554B] transition hover:border-[#FCBF5D] hover:text-[#FCBF5D]"
                >
                  <span className="text-[#FCBF5D]">📍</span>
                  {post.hospitalName}
                  <span className="text-[11px]">↗</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-[26px] leading-none text-[#9A8068] transition hover:text-[#5A4033]"
            >
              ×
            </button>
          </div>

          {/* 작성자 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF4CC] text-[14px] font-extrabold text-[#B8860B]">
                {post.author.slice(0, 1)}
              </span>

              <div>
                <p className="text-[14px] font-extrabold text-[#3B2D22]">
                  {post.author}
                </p>
                <p className="text-[12px] font-bold text-[#9A8068]">
                  {post.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[12px] font-bold text-[#9A8068]">
              <CommentIcon />
              {post.commentCount}
            </div>
          </div>
        </div>

        {/* 게시글 */}
        <div className="border-y border-[#EEEAE5] px-7 py-5">
          <p className="text-[15px] font-semibold leading-[1.9] text-[#3B2D22]">
            {post.content}
          </p>
        </div>

        {/* 도움돼요 */}
        <div className="border-b border-[#EEEAE5] px-7 py-4">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-full border border-[#FCBF5D] bg-[#FFF7EA] px-4 py-2 text-[13px] font-extrabold text-[#F4A72D] transition hover:bg-[#FCBF5D] hover:text-[#5A4033]"
          >
            <LikeIcon />
            도움돼요 {post.likeCount}
          </button>
        </div>

        {/* 댓글 */}
        <div className="px-7 py-5">
          <h3 className="mb-4 text-[16px] font-extrabold text-[#3B2D22]">
            댓글 <span className="text-[#F4A72D]">{post.commentCount}</span>
          </h3>

          {comments.length === 0 ? (
            <div className="flex h-[110px] flex-col items-center justify-center text-[#C5A072]">
              <CommentIcon size="28" />
              <p className="mt-2 text-[13px] font-bold">
                첫 번째 댓글을 남겨보세요
              </p>
            </div>
          ) : (
            <div className="mb-5 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F6EEDC] text-[12px] font-extrabold text-[#9A8068]">
                    {comment.author.slice(0, 1)}
                  </span>

                  <div className="flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-[13px] font-extrabold text-[#3B2D22]">
                        {comment.author}
                      </span>

                      {comment.verified && (
                        <span className="flex items-center gap-1 rounded-full border border-[#B7D79A] bg-[#DDECC8] px-2 py-0.5 text-[10px] font-bold text-[#7DA35A]">
                          <VerifyIcon />
                          인증
                        </span>
                      )}

                      <span className="text-[12px] font-bold text-[#C5A072]">
                        {comment.date}
                      </span>

                      {comment.isMine && (
                        <button
                          type="button"
                          className="ml-auto cursor-pointer text-[12px] font-bold text-[#FF8A8A] transition hover:text-[#E65F5F]"
                        >
                          삭제
                        </button>
                      )}
                    </div>

                    <p className="rounded-[15px] bg-[#FBF6EE] px-4 py-3 text-[13px] font-semibold leading-relaxed text-[#3B2D22]">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 댓글 입력 */}
          <div className="flex items-center gap-2.5">
            <input
              type="text"
              placeholder="댓글을 입력하세요."
              className="h-11 flex-1 rounded-2xl border border-[#E7D8C1] bg-[#FBF6EE] px-4 text-[13px] font-bold text-[#5A4033] outline-none placeholder:text-[#C5A072] focus:border-[#FCBF5D]"
            />

            <button
              type="button"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-[#F6EEDC] text-[#C5A072] transition hover:bg-[#FCBF5D] hover:text-[#5A4033]"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// 게시글 타입/카테고리 뱃지
const Badge = ({ text }: { text: string }) => {
  return (
    <span
      className={`rounded-full px-3.5 py-1 text-[12px] font-bold ${
        badgeColors[text] ?? "bg-[#F6EEDC] text-[#8E725C]"
      }`}
    >
      {text}
    </span>
  );
};

// 인증 표시 아이콘
const VerifyIcon = () => {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L19 5V11C19 16 15.5 20 12 22C8.5 20 5 16 5 11V5L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// 댓글 아이콘
const CommentIcon = ({ size = "16" }: { size?: string }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M21 15C21 16.1046 20.1046 17 19 17H8L3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// 도움돼요 아이콘
const LikeIcon = () => {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H7M7 22V10M7 22H17.3152C18.2768 22 19.1026 21.3157 19.2792 20.3705L20.8125 12.1705C21.0422 10.9411 20.0986 9.8 18.848 9.8H14V5C14 3.34315 12.6569 2 11 2L7 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// 댓글 전송 아이콘
const SendIcon = () => {
  return (
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 2L11 13"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CommunityDetailModal;