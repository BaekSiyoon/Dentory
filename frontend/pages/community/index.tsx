import React, { useState } from "react";
import { useRouter } from "next/router";
import MainMenu from "../../components/mainMenu";
import CommunityWriteModal from "../../components/community/communityWriteModal";
import CommunityDetailModal from "../../components/community/communityDetailModal";

type PostType = "질문" | "리뷰";
type MainTab = "전체" | "질문" | "리뷰";
type Category =
  | "전체"
  | "일반 진료"
  | "심미 / 교정"
  | "잇몸 / 구강"
  | "수술 / 외과"
  | "특수진료"
  | "기타 전문";

type SortType = "최신순" | "오래된순" | "도움돼요순";

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

const posts: CommunityPost[] = [
  {
    id: 1,
    type: "질문",
    category: "일반 진료",
    title: "충치 치료 후 통증이 남아있어요",
    content:
      "충치 치료를 받고 일주일이 지났는데 아직도 씹을 때 통증이 있습니다. 정상인가요, 아니면 재방문해야 할까요?",
    author: "이아파",
    date: "2025.07.05",
    commentCount: 0,
    likeCount: 26,
  },
  {
    id: 2,
    type: "리뷰",
    category: "특수진료",
    title: "턱관절 치료 후기",
    content: "턱에서 소리가 나고 통증이 있어서 방문했는데 설명을 자세히 해주셔서 안심하고 치료받았어요.",
    author: "미소",
    date: "2025.08.02",
    commentCount: 3,
    likeCount: 41,
    verifiedReview: true,
    hospitalId: 2,
    hospitalName: "연세스마일치과",
  },
  {
    id: 3,
    type: "질문",
    category: "심미 / 교정",
    title: "라미네이트 vs 올세라믹 차이가 뭔가요?",
    content: "앞니 색이 마음에 안 들어서 심미치료를 고민 중입니다. 라미네이트랑 올세라믹 차이가 어떻게 되나요?",
    author: "하얀이",
    date: "2025.08.22",
    commentCount: 0,
    likeCount: 29,
  },
  {
    id: 4,
    type: "질문",
    category: "일반 진료",
    title: "어린이 첫 치과 방문 팁 있나요?",
    content: "7살 아이가 처음 치과에 가는데 많이 무서워해요. 아이가 두려움 없이 치료받을 수 있는 방법이 있을까요?",
    author: "엄마사랑",
    date: "2025.09.08",
    commentCount: 0,
    likeCount: 18,
    isMine: true,
  },
  {
    id: 5,
    type: "질문",
    category: "수술 / 외과",
    title: "사랑니 발치 후 붓기 얼마나 가나요?",
    content: "사랑니 2개를 한 번에 뽑았는데 붓기가 5일째입니다. 이 정도면 정상 범위인가요? 병원에 가야 할까요?",
    author: "덴탈망",
    date: "2025.09.20",
    commentCount: 0,
    likeCount: 31,
  },
  {
    id: 6,
    type: "리뷰",
    category: "일반 진료",
    title: "스케일링 받고 왔어요",
    content: "대기 시간이 길지 않았고 설명도 친절했어요. 스케일링도 꼼꼼하게 해주셔서 만족했습니다.",
    author: "치카치카",
    date: "2025.10.01",
    commentCount: 2,
    likeCount: 35,
    verifiedReview: true,
    hospitalId: 3,
    hospitalName: "서울바른치과",
  },
  {
    id: 7,
    type: "질문",
    category: "잇몸 / 구강",
    title: "잇몸에서 피가 자주 나요",
    content: "양치할 때마다 잇몸에서 피가 나는데 치주질환일까요? 스케일링을 받아야 하는지 궁금합니다.",
    author: "잇몸튼튼",
    date: "2025.10.12",
    commentCount: 1,
    likeCount: 17,
  },
  {
    id: 8,
    type: "리뷰",
    category: "심미 / 교정",
    title: "교정 상담 후기",
    content: "교정 기간과 비용을 자세히 설명해주셔서 좋았습니다. 무리하게 권유하지 않아서 신뢰가 갔어요.",
    author: "교정고민",
    date: "2025.10.20",
    commentCount: 4,
    likeCount: 44,
    verifiedReview: true,
    hospitalId: 4,
    hospitalName: "미소라인치과",
  },
  {
    id: 9,
    type: "질문",
    category: "일반 진료",
    title: "충치 치료 비용은 보통 어느 정도인가요?",
    content: "충치가 생긴 것 같은데 레진 치료 비용이 어느 정도인지 궁금합니다.",
    author: "궁금이",
    date: "2025.10.28",
    commentCount: 2,
    likeCount: 22,
  },
  {
    id: 10,
    type: "리뷰",
    category: "수술 / 외과",
    title: "사랑니 발치 후기",
    content: "걱정을 많이 했는데 생각보다 빨리 끝났고 안내도 자세히 해주셨어요. 붓기는 이틀 정도 갔습니다.",
    author: "발치완료",
    date: "2025.11.03",
    commentCount: 5,
    likeCount: 52,
    verifiedReview: true,
    hospitalId: 5,
    hospitalName: "우리동네치과",
  },
  {
    id: 11,
    type: "질문",
    category: "특수진료",
    title: "턱관절 통증은 어느 과로 가야 하나요?",
    content: "입을 벌릴 때 턱에서 소리가 나고 통증이 있습니다. 일반 치과로 가도 되는지 궁금해요.",
    author: "턱아픔",
    date: "2025.11.15",
    commentCount: 1,
    likeCount: 16,
  },
  {
    id: 12,
    type: "리뷰",
    category: "기타 전문",
    title: "야간진료 가능한 치과 방문 후기",
    content: "퇴근 후 방문할 수 있어서 좋았고 접수부터 진료까지 안내가 깔끔했습니다.",
    author: "직장인",
    date: "2025.11.22",
    commentCount: 2,
    likeCount: 37,
    hospitalId: 6,
    hospitalName: "365편한치과",
  },
];

const mainTabs: MainTab[] = ["전체", "질문", "리뷰"];
const categories: Category[] = [
  "전체",
  "일반 진료",
  "심미 / 교정",
  "잇몸 / 구강",
  "수술 / 외과",
  "특수진료",
  "기타 전문",
];
const sortOptions: SortType[] = ["최신순", "오래된순", "도움돼요순"];

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

const Community = () => {
  const router = useRouter();

  const [mainTab, setMainTab] = useState<MainTab>("전체");
  const [category, setCategory] = useState<Category>("전체");
  const [sort, setSort] = useState<SortType>("최신순");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [writeModalOpen, setWriteModalOpen] = useState(false); // 작성 팝업
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null); // 상세 팝업
  
  const pageSize = 10;

  const filteredPosts = posts.filter((post) => {
    const matchTab = mainTab === "전체" || post.type === mainTab;
    const matchCategory = category === "전체" || post.category === category;

    return matchTab && matchCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sort === "오래된순") {
      return a.date.localeCompare(b.date);
    }

    if (sort === "도움돼요순") {
      return b.likeCount - a.likeCount;
    }

    return b.date.localeCompare(a.date);
  });

  const totalCount = sortedPosts.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const pageGroupSize = 5;
  const currentGroup = Math.floor(currentPage / pageGroupSize);
  const startPage = currentGroup * pageGroupSize;
  const endPage = Math.min(startPage + pageGroupSize, totalPages);

  const pageNumbers = Array.from(
    { length: endPage - startPage },
    (_, index) => startPage + index
  );

  const pagedPosts = sortedPosts.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);
  };

  const resetPage = () => {
    setCurrentPage(0);
  };

  return (
    <>
      <MainMenu />
      {/* 작성 팝업 */}
      <CommunityWriteModal
        open={writeModalOpen}
        onClose={() => setWriteModalOpen(false)}
      />
      {/* 상세 팝업 */}
      <CommunityDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
      <main className="min-h-screen bg-[#FFFAF0] px-5 py-10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8">
          <section className="rounded-3xl bg-white p-6 shadow-[0_10px_25px_rgba(80,60,40,0.12)]">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-[17px] font-extrabold text-[#5A4033]">
                치과 관련 경험과 정보를 나눠보세요.
              </p>

              <button
                type="button"
                onClick={() => setWriteModalOpen(true)}
                className="flex h-10 w-fit cursor-pointer items-center gap-1.5 rounded-full bg-[#FCBF5D] px-5 text-[14px] font-bold text-[#5A4033] shadow-[0_6px_14px_rgba(80,60,40,0.16)] transition hover:bg-[#F3AD43]"
              >
                작성하기
              </button>
            </div>

            <div className="relative">
              <svg
                className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#C5A072]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="text"
                placeholder="제목, 내용, 작성자 검색..."
                className="h-11 w-full rounded-full border border-[#EEEAE5] bg-white pl-12 pr-5 text-[14px] font-bold text-[#5A4033] outline-none placeholder:text-[#C5A072] transition-all duration-200 focus:border-[#FCBF5D]"
              />
            </div>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-full border border-[#EEEAE5] bg-white p-1">
                {mainTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setMainTab(tab);
                      resetPage();
                    }}
                    className={`cursor-pointer rounded-full px-4 py-2 text-[14px] font-bold transition-all duration-200 ${
                      mainTab === tab
                        ? "bg-[#FCBF5D] text-[#5A4033]"
                        : "text-[#6A554B] hover:bg-[#FFF7EA]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
                    resetPage();
                  }}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[12px] font-bold transition-all duration-200 ${
                    category === item
                      ? "border-[#FCBF5D] bg-[#FCBF5D] text-[#5A4033]"
                      : "border-[#EEEAE5] bg-white text-[#6A554B] hover:border-[#FCBF5D]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortOpen((prev) => !prev)}
                className={`flex h-10 cursor-pointer items-center gap-2 rounded-full border bg-white px-4 text-[14px] font-bold text-[#5A4033] transition-all duration-200 ${
                  isSortOpen
                    ? "border-[#FCBF5D]"
                    : "border-[#EEEAE5] hover:border-[#FCBF5D]"
                }`}
              >
                {sort}
                <span
                  className={`ml-1 h-2.5 w-2.5 shrink-0 rotate-45 border-b-2 border-r-2 transition-all duration-200 ${
                    isSortOpen
                      ? "translate-y-[1.5px] rotate-225 border-[#FCBF5D]"
                      : "-translate-y-1 border-[#6A554B]"
                  }`}
                />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[140px] rounded-[22px] border-2 border-[#EEEAE5] bg-white p-3 shadow-[0_12px_35px_rgba(80,60,40,0.15)]">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSort(option);
                        setIsSortOpen(false);
                        resetPage();
                      }}
                      className={`mb-2 last:mb-0 w-full cursor-pointer rounded-full px-4 py-2 text-left text-[14px] font-bold transition-all duration-200 ${
                        sort === option
                          ? "bg-[#FCBF5D] text-[#5A4033]"
                          : "bg-white text-[#5A4033] hover:bg-[#FFF7EA]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <p className="-mb-6 ml-2 text-[18px] font-bold text-[#5A4033]">
            총{" "}
            <span className="text-[#FCBF5D]">
              {totalCount.toLocaleString()}
            </span>
            개
          </p>

          <section className="flex flex-col gap-5">
            {pagedPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="cursor-pointer rounded-3xl bg-white p-5 shadow-[0_6px_18px_rgba(80,60,40,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(80,60,40,0.12)]"
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  {post.verifiedReview && (
                    <span className="rounded-full bg-[#DDECC8] px-3.5 py-1 text-[12px] font-bold text-[#7DA35A]">
                      영수증 인증
                    </span>
                  )}

                  {post.isMine && (
                    <span className="rounded-full bg-[#E8F3FF] px-3.5 py-1 text-[12px] font-bold text-[#4A7EBB]">
                      작성자
                    </span>
                  )}

                  <Badge text={post.type} />
                  <Badge text={post.category} />
                </div>

                <h2 className="text-[20px] font-bold text-[#5A4033]">
                  {post.title}
                </h2>

                <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#6A554B]">
                  {post.content}
                </p>

                {post.type === "리뷰" && post.hospitalName && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      router.push(`/dental/${post.hospitalId}`);
                    }}
                    className="mt-3 flex cursor-pointer items-center gap-1.5 text-[14px] font-bold text-[#6A554B] transition hover:text-[#FCBF5D]"
                  >
                    <span className="text-[#FCBF5D]">📍</span>
                    {post.hospitalName}
                  </button>
                )}

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 text-[13px] font-bold text-[#C19A6B]">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF4CC] text-[12px] font-bold text-[#B8860B]">
                        {post.author.slice(0, 1)}
                      </span>
                      <span>{post.author}</span>
                    </div>

                    <span>{post.date}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[13px] font-bold text-[#C19A6B]">
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M21 15C21 16.1046 20.1046 17 19 17H8L3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {post.commentCount}
                    </span>

                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M7 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H7M7 22V10M7 22H17.3152C18.2768 22 19.1026 21.3157 19.2792 20.3705L20.8125 12.1705C21.0422 10.9411 20.0986 9.8 18.848 9.8H14V5C14 3.34315 12.6569 2 11 2L7 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {post.likeCount}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {totalPages > 1 && (
            <nav className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
                  currentPage === 0
                    ? "cursor-not-allowed border-[#F1EBDD] text-[#D3C9BA]"
                    : "cursor-pointer border-[#EEE4D5] text-[#5A4033] hover:border-[#FCBF5D]"
                }`}
              >
                <svg
                  className="h-3 w-3 md:h-5 md:w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M15 6L9 12L15 18"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {pageNumbers.map((page) => {
                const active = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border text-[14px] font-semibold transition-all duration-200 ${
                      active
                        ? "border-[#FCBF5D] bg-[#FCBF5D] text-[#5A4033]"
                        : "border-[#EEE4D5] bg-transparent text-[#5A4033] hover:border-[#FCBF5D]"
                    }`}
                  >
                    {page + 1}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
                  currentPage >= totalPages - 1
                    ? "cursor-not-allowed border-[#F1EBDD] text-[#D3C9BA]"
                    : "cursor-pointer border-[#EEE4D5] text-[#5A4033] hover:border-[#FCBF5D]"
                }`}
              >
                <svg
                  className="h-3 w-3 md:h-5 md:w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </nav>
          )}
        </div>
      </main>
    </>
  );
};

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

export default Community;