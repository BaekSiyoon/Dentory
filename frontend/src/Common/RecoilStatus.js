import { atom } from "recoil";
import { selector } from "recoil";

// 1. 공통으로 사용할 빈 문자열 상태 atom 정의
export const commonEmptyStringState = atom({
  key: "commonEmptyString", // 고유한 식별자
  default: "", // 초기값: 빈 문자열
});

// 2. 공통으로 사용할 문자 상태 atom 정의
export const commonCharState = atom({
  key: "commonChar", // 고유한 식별자
  default: "A", // 초기값: 문자 'A'
});

// 3. 공통으로 사용할 숫자 상태 atom 정의
export const commonNumberState = atom({
  key: "commonNumber", // 고유한 식별자
  default: 0, // 초기값: 숫자 0
});

// 4. 공통으로 사용할 불리언 상태 atom 정의
export const commonBooleanState = atom({
  key: "commonBoolean", // 고유한 식별자
  default: false, // 초기값: 불리언 false
});

// 5. 공통으로 사용할 리스트 상태 atom 정의
export const commonListState = atom({
  key: "commonList", // 고유한 식별자
  default: [], // 초기값: 빈 리스트
});

// 6. 공통으로 사용할 객체 상태 atom 정의
export const commonObjectState = atom({
  key: "commonObject", // 고유한 식별자
  default: { key: "value" }, // 초기값: 객체 { key: 'value' }
});

// 공통으로 사용할 selector 정의
export const commonTextLengthSelector = selector({
  key: "commonTextLengthSelector", // 고유한 식별자
  get: ({ get }) => {
    const text = get(commonEmptyStringState); // commonEmptyStringState atom에서 값 가져오기
    return text.length; // text의 길이를 반환
  },
});
