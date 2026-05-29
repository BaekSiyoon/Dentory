import React, { useEffect, useState } from "react";

// 데이터 타입 정의
interface DentalData {
  id: number;
  name: string;
  address: string;
  phone: string;
}

const DentalInfo: React.FC = () => {
  const [data, setData] = useState<DentalData[]>([]);
  useEffect(() => {
  fetch("http://localhost:8080/api/dentals")
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      setData(result);
    })
    .catch((error) => {
      console.error("치과 정보 조회 실패", error);
    });
}, []);
 
  const area = [
    { areaCd: "SL", areaName: "서울" },
    { areaCd: "BS", areaName: "부산" },
  ];

  const areaInfo = [
    { areaCd: "SL", areaInfoCd: "GN", areaInfo: "강남구" },
    { areaCd: "SL", areaInfoCd: "JR", areaInfo: "종로구" },
  ];

  const areaSelectChange = (areaCd: string) => {
    console.log(`selected ${areaCd}`);
  };

  const areaInfoSelectChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleChange = (value: string) => {
    // console.log("changed", value);
  };

  const onChange = (value: number | null) => {
    // console.log("changed", value);
  };

  return (
    <>
      {/* 메인 컨테이너 */}
      <div className="mt-10 w-full flex flex-col gap-6">
        {/* 검색 카드 */}
        <div className="w-full bg-white shadow rounded-2xl p-6">
          {/* 제목 행 */}
          <div className="grid grid-cols-12 mb-2">
            <div className="col-span-3 font-bold mb-2">지역</div>
            <div className="col-span-2 font-bold mb-2">치료</div>
            <div className="col-span-2 font-bold mb-2">진료 시간</div>
            <div className="col-span-5 font-bold mb-2">가격</div>
          </div>

          {/* 선택 행 */}
          <div className="grid grid-cols-12 items-center gap-4 mb-4">
            {/* 지역 */}
            <div className="col-span-3 flex gap-3">
              <select
                defaultValue="SL"
                onChange={(e) => areaSelectChange(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-24 text-sm focus:ring-2 focus:ring-blue-400"
              >
                {area.map((data) => (
                  <option key={data.areaCd} value={data.areaCd}>
                    {data.areaName}
                  </option>
                ))}
              </select>
              <select
                defaultValue="GN"
                onChange={(e) => areaInfoSelectChange(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-24 text-sm focus:ring-2 focus:ring-blue-400"
              >
                {areaInfo.map((data) => (
                  <option key={data.areaInfoCd} value={data.areaInfoCd}>
                    {data.areaInfo}
                  </option>
                ))}
              </select>
            </div>

            {/* 치료 */}
            <div className="col-span-2">
              <select
                defaultValue="전체"
                onChange={(e) => handleChange(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-28 text-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value="임플란트">임플란트</option>
                <option value="충치치료">충치치료</option>
                <option value="치아교정">치아교정</option>
              </select>
            </div>

            {/* 진료 시간 */}
            <div className="col-span-2">
              <select
                defaultValue="전체"
                onChange={(e) => handleChange(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-28 text-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value="전체">전체</option>
                <option value="진료중">진료중</option>
                <option value="야간진료">야간진료</option>
                <option value="휴일진료">휴일진료</option>
              </select>
            </div>

            {/* 가격 */}
            <div className="col-span-5 flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={100000}
                defaultValue={3}
                onChange={(e) => onChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2 w-20 text-sm focus:ring-2 focus:ring-blue-400"
              />
              <span>~</span>
              <input
                type="number"
                min={1}
                max={100000}
                defaultValue={3}
                onChange={(e) => onChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md p-2 w-20 text-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* 찾기 버튼 */}
          <div className="flex justify-end">
            <button
              id="dentalBtn"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md transition"
            >
              찾기
            </button>
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="text-sm text-gray-700">{data.length} 건</div>

        {/* 테이블 */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">치과</th>
                <th className="p-3 border-b">치료</th>
                <th className="p-3 border-b">진료</th>
                <th className="p-3 border-b">주소</th>
                <th className="p-3 border-b">방문자 리뷰</th>
              </tr>
            </thead>
            <tbody>
               {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b text-blue-600 cursor-pointer">
                    {item.name}
                  </td>
                  <td className="p-3 border-b">{item.address}</td>
                  <td className="p-3 border-b">{item.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DentalInfo;
