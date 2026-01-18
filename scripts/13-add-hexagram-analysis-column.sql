-- Add hexagram_analysis column to solutions table
-- This column will store the analysis explaining how the hexagram relates to the prescription

ALTER TABLE solutions 
ADD COLUMN IF NOT EXISTS hexagram_analysis TEXT;

COMMENT ON COLUMN solutions.hexagram_analysis IS 
'Phân tích chi tiết cách giải thích từ quẻ dịch (bát quái) sang ngũ hành, tạng phủ và lý do chọn bài thuốc này.';

-- Update existing prescription records with analysis
-- Example for 7_8_0 (Sơn Địa Bác - Bổ Trung Ích Khí Thang)
UPDATE solutions 
SET hexagram_analysis = 'Quẻ Bác cho thấy sự suy yếu dần, mất mát nguyên khí. Trong quẻ này:

**NỘI QUẺ (KHÔN - ĐỊA):** Khí Thể - Tạng Tỵ
Chủ về vận hóa, tiêu hóa trung tiêu. Khôn - Thổ hợp với Tỳ tạng, khi suy yếu làm chức vận hóa không tốt, tiêu món của chính khí. Trong cơ thể, Tỵ Hư Nhuộc, khí thể bị đình trệ, bụng đầy trướng.

**NGOẠI QUẺ (CẤN - SƠN):** Khí Thể - Vị (Dạ dày)
Chủ về tiếp thu ẩm thực ăn xuống. Vị khí uất dư đình trệ, gây biểu hiện của Tỵ Vị Hư Nhuộc, khí Thể bị đình trệ, kém, ăn uống không tiêu, bụng đầy trướng.

**PHÂN TÍCH:** Quẻ Bác cho thấy sự suy yếu dần của chính khí trong người mất mát nguyên khí. Tỵ Vị khởi tổn khiến người mệt mỏi, ăn uống không ngon, khó tiêu. Bài thuốc Bổ Trung Ích Khí Thang được chọn để bổ dưỡng Trung Tiêu, nâng Dương khí bị suy hãm, cải thiện chức năng tiêu hóa và hồi phục nguyên khí.'
WHERE hexagram_key = '7_8_0' AND solution_type = 'prescription';
