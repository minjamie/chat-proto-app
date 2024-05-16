
export function toObjectHexString(number: any): string {
  // 숫자를 16진수 문자열로 변환
  const hexString = number.toString(16);
  // 16진수 문자열을 24자리의 문자열로 패딩하여 반환
  return hexString.padStart(24, "0").toString();
}