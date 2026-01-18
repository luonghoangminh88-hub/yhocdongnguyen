// Core I-Ching Trigram and Organ mapping data
export const ZODIAC_VALUES: Record<string, number> = {
  Tý: 1,
  Sửu: 2,
  Dần: 3,
  Mão: 4,
  Thìn: 5,
  Tỵ: 6,
  Ngọ: 7,
  Mùi: 8,
  Thân: 9,
  Dậu: 10,
  Tuất: 11,
  Hợi: 12,
}

export interface TrigramData {
  number: number
  name: string
  vietnamese: string
  organ: string
  element: string
  lines: [boolean, boolean, boolean] // true = solid line, false = broken line. Order: [hào 1 (dưới), hào 2 (giữa), hào 3 (trên)]
}

export const TRIGRAMS: Record<string, TrigramData> = {
  Can: {
    number: 1,
    name: "Qian",
    vietnamese: "Càn",
    organ: "Phổi, Xương",
    element: "Kim",
    lines: [true, true, true], // ☰ Càn - ba hào dương
  },
  Doai: {
    number: 2,
    name: "Dui",
    vietnamese: "Đoài",
    organ: "Miệng, Lưỡi",
    element: "Kim",
    lines: [true, true, false], // ☱ Đoài - hai hào dương dưới, một hào âm trên
  },
  Ly: {
    number: 3,
    name: "Li",
    vietnamese: "Ly",
    organ: "Tim, Mắt",
    element: "Hỏa",
    lines: [true, false, true], // ☲ Ly - dương âm dương
  },
  Chan: {
    number: 4,
    name: "Zhen",
    vietnamese: "Chấn",
    organ: "Gan, Chân",
    element: "Mộc",
    lines: [true, false, false], // ☳ Chấn - một hào dương ở dưới, hai hào âm trên
  },
  Ton: {
    number: 5,
    name: "Xun",
    vietnamese: "Tốn",
    organ: "Mật, Đùi",
    element: "Mộc",
    lines: [false, true, true], // ☴ Tốn - âm dương dương
  },
  Kham: {
    number: 6,
    name: "Kan",
    vietnamese: "Khảm",
    organ: "Thận, Tai",
    element: "Thủy",
    lines: [false, true, false], // ☵ Khảm - âm dương âm
  },
  Can_Mountain: {
    number: 7,
    name: "Gen",
    vietnamese: "Cấn",
    organ: "Tỳ vị, Tay",
    element: "Thổ",
    lines: [false, false, true], // ☶ Cấn - hai hào âm dưới, một hào dương trên
  },
  Khon: {
    number: 8,
    name: "Kun",
    vietnamese: "Khôn",
    organ: "Bụng, Lá lách",
    element: "Thổ",
    lines: [false, false, false], // ☷ Khôn - ba hào âm
  },
}

export function getTrigramByNumber(num: number): TrigramData {
  const trigramKey = Object.keys(TRIGRAMS).find((key) => TRIGRAMS[key].number === num)
  return trigramKey ? TRIGRAMS[trigramKey] : TRIGRAMS.Khon
}

export function getTrigramByName(vietnameseName: string): TrigramData | null {
  const trigramKey = Object.keys(TRIGRAMS).find(
    (key) => TRIGRAMS[key].vietnamese === vietnameseName
  )
  return trigramKey ? TRIGRAMS[trigramKey] : null
}

export const HEXAGRAM_NAMES: Record<string, string> = {
  "1-1": "Càn Thiên",
  "1-2": "Càn Đoài",
  "1-3": "Càn Ly",
  "1-4": "Càn Chấn",
  "1-5": "Càn Tốn",
  "1-6": "Càn Khảm",
  "1-7": "Càn Cấn",
  "1-8": "Càn Khôn",
  "2-1": "Đoài Càn",
  "2-2": "Đoài",
  "2-3": "Đoài Ly",
  "2-4": "Đoài Chấn",
  "2-5": "Đoài Tốn",
  "2-6": "Đoài Khảm",
  "2-7": "Đoài Cấn",
  "2-8": "Đoài Khôn",
  "3-1": "Ly Càn",
  "3-2": "Ly Đoài",
  "3-3": "Ly",
  "3-4": "Ly Chấn",
  "3-5": "Ly Tốn",
  "3-6": "Ly Khảm",
  "3-7": "Ly Cấn",
  "3-8": "Ly Khôn",
  "4-1": "Chấn Càn",
  "4-2": "Chấn Đoài",
  "4-3": "Chấn Ly",
  "4-4": "Chấn",
  "4-5": "Chấn Tốn",
  "4-6": "Chấn Khảm",
  "4-7": "Chấn Cấn",
  "4-8": "Chấn Khôn",
  "5-1": "Tốn Càn",
  "5-2": "Tốn Đoài",
  "5-3": "Tốn Ly",
  "5-4": "Tốn Chấn",
  "5-5": "Tốn",
  "5-6": "Tốn Khảm",
  "5-7": "Tốn Cấn",
  "5-8": "Tốn Khôn",
  "6-1": "Khảm Càn",
  "6-2": "Khảm Đoài",
  "6-3": "Khảm Ly",
  "6-4": "Khảm Chấn",
  "6-5": "Khảm Tốn",
  "6-6": "Khảm",
  "6-7": "Khảm Cấn",
  "6-8": "Khảm Khôn",
  "7-1": "Cấn Càn",
  "7-2": "Cấn Đoài",
  "7-3": "Cấn Ly",
  "7-4": "Cấn Chấn",
  "7-5": "Cấn Tốn",
  "7-6": "Cấn Khảm",
  "7-7": "Cấn",
  "7-8": "Cấn Khôn",
  "8-1": "Khôn Càn",
  "8-2": "Khôn Đoài",
  "8-3": "Khôn Ly",
  "8-4": "Khôn Chấn",
  "8-5": "Khôn Tốn",
  "8-6": "Khôn Khảm",
  "8-7": "Khôn Cấn",
  "8-8": "Khôn",
}
