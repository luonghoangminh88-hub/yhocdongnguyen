-- Update all 64 prescriptions with hexagram analysis
-- This explains the connection between I Ching hexagram interpretation and prescription selection

-- NHÓM CÀN (KIM) - Metal Element Group
UPDATE solutions SET hexagram_analysis = 
'Quẻ Càn Vi Thiên: Quẻ thuần Dương, đại biểu cho Khí Kim thuần túy của Trời. Nội và Ngoại đều là Càn, thuộc Kim, hợp với Phế tạng (Phổi). Khi Phế Khí bị tổn thương, xuất hiện ho, suyễn, phế nhiệt. Bài thuốc này thanh phế nhiệt, bổ phế khí, điều hòa hô hấp.'
WHERE hexagram_key = '1_1_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thiên Trạch Lý: Trên Càn (Kim - Phế) dưới Đoài (Kim - Họng). Cả hai đều thuộc Kim, tạo thành cục diện Kim quá thịnh, khiến họng khô, đau, sưng viêm, mất tiếng. Bài thuốc giải độc thanh nhiệt, mở thanh âm, điều hòa Phế và Họng.'
WHERE hexagram_key = '1_8_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thiên Hỏa Đồng Nhân: Trên Càn (Kim - Phế) dưới Ly (Hỏa - Tâm). Kim và Hỏa tương khắc, Hỏa thái khả sinh Tâm Phế hỏa vượng, gây nóng trong, phiền muộn, ngực tức. Bài thuốc thanh tâm hỏa, thanh phế nhiệt, làm dịu triệu chứng.'
WHERE hexagram_key = '1_3_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thiên Lôi Vô Vọng: Trên Càn (Kim - Phế) dưới Chấn (Mộc - Can). Mộc khắc Thổ, Kim khắc Mộc, tạo thành tuần hoàn bất ổn, gây chóng mặt, đau đầu do phong nhiệt. Bài thuốc khu phong, định thống, bình can dương.'
WHERE hexagram_key = '1_4_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thiên Phong Cấu: Trên Càn (Kim - Phế) dưới Tốn (Mộc - Phong). Phong tà xâm phạm Phế, gây cảm mạo, đau đầu, mình mẩy nhức. Bài thuốc tán hàn, giải biểu, khu phong tà ra ngoài qua mồ hôi.'
WHERE hexagram_key = '1_5_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thiên Thủy Tụng: Trên Càn (Kim - Phế) dưới Khảm (Thủy - Thận). Khí Kim đi xuống Thủy đạo nhưng bị ứ đọng, gây bí tiểu, nước tiểu đỏ rát. Bài thuốc thông lợi Bàng Quang, giải nhiệt, lợi tiểu.'
WHERE hexagram_key = '1_6_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thiên Sơn Độn: Trên Càn (Kim - Phế) dưới Cấn (Thổ - Tỳ). Kim và Thổ tương sinh, nhưng nếu Thổ yếu thì không sinh được Kim, người mệt mỏi, khí hư. Bài thuốc bổ khí, dưỡng tỳ, tăng cường vận hóa.'
WHERE hexagram_key = '1_7_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thiên Địa Phủ: Trên Càn (Kim - Phế) dưới Khôn (Thổ - Tỳ Vị). Khí Phế và Vị không thông suốt, gây bụng đầy, nôn mửa, khí trệ. Bài thuốc điều hòa trung tiêu, hành khí giảm trướng.'
WHERE hexagram_key = '1_2_0' AND solution_type = 'prescription';

-- NHÓM KHÔN (THỔ) - Earth Element Group
UPDATE solutions SET hexagram_analysis = 
'Quẻ Khôn Vi Địa: Quẻ thuần Âm, đại biểu cho Thổ của Đất. Nội và Ngoại đều Khôn, thuộc Thổ, hợp với Tỳ Vị. Khi Tỳ Vị hư yếu, ăn không tiêu, bụng đầy. Bài thuốc bình vị, kiện tỳ, giúp tiêu hóa.'
WHERE hexagram_key = '8_8_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Địa Thiên Thái: Dưới Càn (Kim) trên Khôn (Thổ). Thổ sinh Kim, Trời Đất giao thông, khí huyết hài hòa. Nhưng nếu suy yếu cần bổ. Bài thuốc Bát Trân bổ toàn diện khí huyết.'
WHERE hexagram_key = '8_1_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Địa Hỏa Minh Di: Dưới Ly (Hỏa) trên Khôn (Thổ - Vị). Hỏa sinh Thổ nhưng nếu Hỏa quá vượng, Vị bị nhiệt, miệng hôi, loét. Bài thuốc thanh tỳ, tả hỏa, giáng vị nhiệt.'
WHERE hexagram_key = '8_3_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Địa Lôi Phục: Dưới Chấn (Lôi - Mộc) trên Khôn (Thổ - Tỳ). Dương khí Lôi ở dưới cần phục hồi, Tỳ bị lạnh. Bài thuốc ôn trung, tán hàn, phục hồi dương khí.'
WHERE hexagram_key = '8_4_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Địa Phong Thăng: Dưới Tốn (Phong - Mộc) trên Khôn (Thổ - Tỳ). Mộc khắc Thổ quá, Tỳ khí bị hãm, cần thăng dương. Bài thuốc kiện tỳ, thăng dương, hành khí tiêu trướng.'
WHERE hexagram_key = '8_5_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Địa Thủy Sư: Dưới Khảm (Thủy) trên Khôn (Thổ - Tỳ). Thủy thổ bất hòa, thủy khí ứ đọng, gây phù thũng. Bài thuốc lợi thủy, tiêu thũng, thông đường thủy đạo.'
WHERE hexagram_key = '8_6_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Địa Sơn Khiêm: Dưới Cấn (Sơn - Thổ) trên Khôn (Thổ - Tỳ). Cả hai đều Thổ, Thổ quá nhiều sinh Thấp, gây khớp đau, tê bại. Bài thuốc trừ thấp, lợi khớp, dưỡng cân mạch.'
WHERE hexagram_key = '8_7_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Địa Trạch Lâm: Dưới Đoài (Trạch - Kim) trên Khôn (Thổ - Vị). Thổ sinh Kim nhưng Vị Âm hư, họng khô, táo bón. Bài thuốc dưỡng vị âm, nhuận tràng, giảm táo.'
WHERE hexagram_key = '8_2_0' AND solution_type = 'prescription';

-- NHÓM CHẤN (MỘC) - Wood/Thunder Element Group
UPDATE solutions SET hexagram_analysis = 
'Quẻ Chấn Vi Lôi: Quẻ thuần Dương động, Lôi chấn động mạnh. Cả hai đều Chấn, thuộc Mộc (Can). Khi Can phong nội động, gây kinh giật, co giật. Bài thuốc định kinh, tức phong, an thần.'
WHERE hexagram_key = '4_4_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Lôi Thiên Đại Tráng: Dưới Càn (Kim) trên Chấn (Mộc - Can). Mộc dương quá vượng, Can dương thượng viên, gây cao huyết áp, chóng mặt. Bài thuốc trấn can, hạ áp, định phong.'
WHERE hexagram_key = '4_1_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Lôi Trạch Quy Muội: Dưới Đoài (Trạch - Kim) trên Chấn (Mộc - Can). Kim khắc Mộc, Can khí uất kết, gây phụ nữ kinh nguyệt rối loạn. Bài thuốc điều kinh, hoạt huyết, giải uất.'
WHERE hexagram_key = '4_8_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Lôi Hỏa Phong: Dưới Ly (Hỏa) trên Chấn (Mộc - Can). Mộc sinh Hỏa, Can hỏa quá vượng, mắt đỏ, tính nóng nảy. Bài thuốc thanh can, tả hỏa, giảm nhiệt.'
WHERE hexagram_key = '4_3_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Lôi Phong Hằng: Dưới Tốn (Phong - Mộc) trên Chấn (Lôi - Mộc). Cả hai đều Mộc, Mộc quá sinh Phong, phong thấp xâm khớp. Bài thuốc khu phong, hoạt lạc, trừ thấp.'
WHERE hexagram_key = '4_5_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Lôi Thủy Giải: Dưới Khảm (Thủy) trên Chấn (Mộc - Can). Thủy sinh Mộc nhưng Can khí uất kết, đau tức sườn. Bài thuốc thông kinh, hoạt huyết, giải uất khí.'
WHERE hexagram_key = '4_6_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Lôi Sơn Tiểu Quá: Dưới Cấn (Sơn - Thổ) trên Chấn (Lôi - Mộc). Mộc khắc Thổ, cơ khớp co thắt, đau nhẹ. Bài thuốc chỉ thống, dư cơ, giảm co thắt.'
WHERE hexagram_key = '4_7_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Lôi Địa Dự: Dưới Khôn (Thổ - Tỳ) trên Chấn (Mộc - Can). Mộc khắc Thổ, Can tỳ bất hòa, tiêu hóa kém. Bài thuốc tùng can, kiện tỳ, điều hòa Can Tỳ.'
WHERE hexagram_key = '4_2_0' AND solution_type = 'prescription';

-- NHÓM TỐN (MỘC) - Wind/Wood Element Group  
UPDATE solutions SET hexagram_analysis = 
'Quẻ Tốn Vi Phong: Quẻ thuần Mộc, đại biểu Phong tà. Cả hai Tốn đều Mộc, Phong tà thịnh, gây phong tà xâm nhập. Bài thuốc khu phong, giải biểu, đuổi tà ra ngoài.'
WHERE hexagram_key = '5_5_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Phong Thiên Tiểu Súc: Dưới Càn (Kim) trên Tốn (Phong - Mộc). Kim khắc Mộc, Phong khí bị cản, khí huyết không thông. Bài thuốc hành khí, hoạt huyết, thông kinh lạc.'
WHERE hexagram_key = '5_1_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Phong Trạch Trung Phu: Dưới Đoài (Trạch - Kim) trên Tốn (Phong - Mộc). Kim khắc Mộc, Phế khí và Can khí bất hòa, ho khan. Bài thuốc nhuận phế, khu phong, giảm ho.'
WHERE hexagram_key = '5_8_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Phong Hỏa Gia Nhân: Dưới Ly (Hỏa) trên Tốn (Phong - Mộc). Mộc sinh Hỏa, Hỏa viêm thượng, gây sốt cao, phát ban. Bài thuốc thanh nhiệt, giải độc, tiêu viêm.'
WHERE hexagram_key = '5_3_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Phong Lôi Ích: Dưới Chấn (Lôi - Mộc) trên Tốn (Phong - Mộc). Cả hai Mộc, Phong Lôi đều động, Can dương quá vượng, đầu nặng chóng. Bài thuốc bình can, định phong, giảm chóng.'
WHERE hexagram_key = '5_4_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Phong Thủy Hoán: Dưới Khảm (Thủy) trên Tốn (Phong - Mộc). Thủy sinh Mộc, nhưng Thủy khí tán mát, gây ra hàn thấp. Bài thuốc ôn kinh, tán hàn, lợi thấp.'
WHERE hexagram_key = '5_6_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Phong Sơn Tiệm: Dưới Cấn (Sơn - Thổ) trên Tốn (Phong - Mộc). Mộc khắc Thổ, Phong thấp xâm Tỳ, ăn kém. Bài thuốc kiện tỳ, khu phong, trừ thấp.'
WHERE hexagram_key = '5_7_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Phong Địa Quán: Dưới Khôn (Thổ - Tỳ) trên Tốn (Phong - Mộc). Mộc khắc Thổ, Tỳ hư phong động, bụng đau lỏng. Bài thuốc kiện tỳ, chỉ tả, định phong.'
WHERE hexagram_key = '5_2_0' AND solution_type = 'prescription';

-- NHÓM LY (HỎA) - Fire Element Group
UPDATE solutions SET hexagram_analysis = 
'Quẻ Ly Vi Hỏa: Quẻ thuần Hỏa, Âm trong Dương ngoài. Cả hai Ly đều Hỏa, thuộc Tâm. Tâm hỏa vượng, gây mất ngủ, hồi hộp. Bài thuốc thanh tâm, an thần, dưỡng huyết.'
WHERE hexagram_key = '3_3_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Hỏa Thiên Đại Hữu: Dưới Càn (Kim) trên Ly (Hỏa - Tâm). Hỏa khắc Kim, Tâm Phế nhiệt thịnh, ho có đờm vàng. Bài thuốc thanh phế, hóa đờm, giáng hỏa.'
WHERE hexagram_key = '3_1_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Hỏa Trạch Khuê: Dưới Đoài (Trạch - Kim) trên Ly (Hỏa - Tâm). Hỏa khắc Kim, Tâm Phế bất hòa, ngực tức, thở ngắn. Bài thuốc điều hòa Tâm Phế, hành khí.'
WHERE hexagram_key = '3_8_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Hỏa Lôi Phệ Hạp: Dưới Chấn (Lôi - Mộc) trên Ly (Hỏa - Tâm). Mộc sinh Hỏa quá mạnh, Tâm Can hỏa vượng, tính nóng, mất ngủ. Bài thuốc thanh tâm can, an thần.'
WHERE hexagram_key = '3_4_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Hỏa Phong Đỉnh: Dưới Tốn (Phong - Mộc) trên Ly (Hỏa - Tâm). Mộc sinh Hỏa, Hỏa viêm liên tục, sốt cao không hạ. Bài thuốc thanh nhiệt, giải biểu, hạ sốt.'
WHERE hexagram_key = '3_5_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Hỏa Thủy Vị Tế: Dưới Khảm (Thủy - Thận) trên Ly (Hỏa - Tâm). Thủy Hỏa bất tế, Tâm Thận không giao, mất ngủ, đau lưng. Bài thuốc giao thông Tâm Thận.'
WHERE hexagram_key = '3_6_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Hỏa Sơn Lữ: Dưới Cấn (Sơn - Thổ) trên Ly (Hỏa - Tâm). Hỏa sinh Thổ nhưng Hỏa quá thiêu, Tâm Tỳ nhiệt, miệng khô đắng. Bài thuốc thanh tâm tỳ nhiệt.'
WHERE hexagram_key = '3_7_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Hỏa Địa Tấn: Dưới Khôn (Thổ - Tỳ Vị) trên Ly (Hỏa - Tâm). Hỏa sinh Thổ, nhưng Vị nhiệt thịnh, khát nước, miệng loét. Bài thuốc thanh vị nhiệt, dưỡng âm.'
WHERE hexagram_key = '3_2_0' AND solution_type = 'prescription';

-- NHÓM KHẢM (THỦY) - Water Element Group
UPDATE solutions SET hexagram_analysis = 
'Quẻ Khảm Vi Thủy: Quẻ thuần Thủy, hiểm trở trùng trùng. Cả hai Khảm đều Thủy, thuộc Thận. Thận dương hư, sợ lạnh, đau lưng. Bài thuốc ôn thận, tráng dương, bổ hỏa.'
WHERE hexagram_key = '6_6_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thủy Thiên Nhu: Dưới Càn (Kim) trên Khảm (Thủy - Thận). Kim sinh Thủy, nhưng Thận âm hư, họng khô, tiểu đêm nhiều. Bài thuốc bổ thận âm, nhuận táo.'
WHERE hexagram_key = '6_1_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thủy Trạch Tiết: Dưới Đoài (Trạch - Kim) trên Khảm (Thủy - Thận). Kim sinh Thủy, Thủy khí quá, bàng quang lạnh, tiểu nhiều. Bài thuốc ôn bàng quang, cố tiểu.'
WHERE hexagram_key = '6_8_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thủy Hỏa Ký Tế: Dưới Ly (Hỏa - Tâm) trên Khảm (Thủy - Thận). Thủy Hỏa đã giao nhưng cần duy trì, Tâm Thận cần bổ. Bài thuốc giao thông Tâm Thận, dưỡng sinh.'
WHERE hexagram_key = '6_3_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thủy Lôi Truân: Dưới Chấn (Lôi - Mộc) trên Khảm (Thủy - Thận). Thủy sinh Mộc, nhưng Thận hư Can mộc không nuôi, mắt mờ, gân yếu. Bài thuốc bổ thận can, sáng mắt.'
WHERE hexagram_key = '6_4_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thủy Phong Tỉnh: Dưới Tốn (Phong - Mộc) trên Khảm (Thủy - Thận). Thủy sinh Mộc, Thận Phong hàn thấp, khớp đau. Bài thuốc ôn thận, khu phong, lợi thấp.'
WHERE hexagram_key = '6_5_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thủy Sơn Kiển: Dưới Cấn (Sơn - Thổ) trên Khảm (Thủy - Thận). Thủy bị Thổ cản, Thận khí bất thông, đau lưng, tiểu khó. Bài thuốc thông thận, lợi tiểu, giảm đau.'
WHERE hexagram_key = '6_7_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Thủy Địa Tỷ: Dưới Khôn (Thổ - Tỳ) trên Khảm (Thủy - Thận). Thổ khắc Thủy, Tỳ Thận dương hư, lạnh bụng, tiêu chảy. Bài thuốc ôn tỳ thận, chỉ tả.'
WHERE hexagram_key = '6_2_0' AND solution_type = 'prescription';

-- NHÓM CẤN (THỔ/SƠN) - Mountain/Earth Element Group
UPDATE solutions SET hexagram_analysis = 
'Quẻ Cấn Vi Sơn: Quẻ thuần Thổ Sơn, tĩnh chỉ. Cả hai Cấn đều Thổ, thuộc Vị. Vị khí ứ trệ, ăn no đầy, khó tiêu. Bài thuốc tiêu thực, hành khí, giảm trướng.'
WHERE hexagram_key = '7_7_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Sơn Thiên Đại Súc: Dưới Càn (Kim) trên Cấn (Thổ - Vị). Thổ sinh Kim, nhưng Vị ứ khí, khí ngược, ợ hơi. Bài thuốc hành khí, giảm ngược, tiêu thực.'
WHERE hexagram_key = '7_1_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Sơn Trạch Tổn: Dưới Đoài (Trạch - Kim) trên Cấn (Thổ - Vị). Thổ sinh Kim quá, Vị âm bị tổn, khát nước, đói nhưng ăn không vào. Bài thuốc dưỡng vị âm, khai vị.'
WHERE hexagram_key = '7_8_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Sơn Hỏa Bí: Dưới Ly (Hỏa - Tâm) trên Cấn (Thổ - Vị). Hỏa sinh Thổ, Vị có hỏa, miệng loét, khát nước, tiểu vàng. Bài thuốc thanh vị hỏa, dưỡng âm.'
WHERE hexagram_key = '7_3_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Sơn Lôi Di: Dưới Chấn (Lôi - Mộc) trên Cấn (Thổ - Vị). Mộc khắc Thổ, Vị khí bị Mộc xâm, ăn đau bụng. Bài thuốc điều hòa Can Vị, giảm đau.'
WHERE hexagram_key = '7_4_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Sơn Phong Cổ: Dưới Tốn (Phong - Mộc) trên Cấn (Thổ - Vị). Mộc khắc Thổ, Phong Thổ bất hòa, bụng đau, tiêu chảy do thức ăn ôi thiu. Bài thuốc tiêu thực, chỉ tả.'
WHERE hexagram_key = '7_5_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Sơn Thủy Mông: Dưới Khảm (Thủy - Thận) trên Cấn (Thổ - Vị). Thổ khắc Thủy, Vị Thận bất hòa, ăn lạnh đau bụng, tiểu rắt. Bài thuốc ôn vị thận, chỉ đau.'
WHERE hexagram_key = '7_6_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Sơn Địa Bác: Dưới Khôn (Thổ - Tỳ) trên Cấn (Thổ - Vị). Cả hai đều Thổ, thuộc Tỳ Vị. Khi Tỳ Vị suy yếu dần, vận hóa kém, khí hư, mệt mỏi. Bài thuốc Bổ Trung Ích Khí nâng Trung Tiêu, bổ khí.'
WHERE hexagram_key = '7_8_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Sơn Địa Bác: Dưới Khôn (Thổ - Tỳ) trên Cấn (Thổ - Vị). Quẻ Bác cho thấy sự suy yếu dần, mất mát nguyên khí.

**NỘI QUẺ (KHÔN - ĐỊA):** Khí Thể - Tạng Tỵ
Chủ về vận hóa, tiêu hóa trung tiêu. Khôn - Thổ hợp với Tỳ tạng, khi suy yếu làm chức vận hóa không tốt, tiêu món của chính khí. Trong cơ thể, Tỵ Hư Nhuộc, khí thể bị đình trệ, bụng đầy trướng.

**NGOẠI QUẺ (CẤN - SƠN):** Khí Thể - Vị (Dạ dày)
Chủ về tiếp thu ẩm thực ăn xuống. Vị khí uất dư đình trệ, gây biểu hiện của Tỵ Vị Hư Nhuộc, khí Thể bị đình trệ, kém, ăn uống không tiêu, bụng đầy trướng.

**PHÂN TÍCH:** Quẻ Bác cho thấy sự suy yếu dần của chính khí trong người mất mát nguyên khí. Tỵ Vị khởi tổn khiến người mệt mỏi, ăn uống không ngon, khó tiêu. Bài thuốc Bổ Trung Ích Khí Thang được chọn để bổ dưỡng Trung Tiêu, nâng Dương khí bị suy hãm, cải thiện chức năng tiêu hóa và hồi phục nguyên khí.'
WHERE hexagram_key = '7_8_0' AND solution_type = 'prescription';

-- NHÓM ĐOÀI (KIM) - Lake/Metal Element Group
UPDATE solutions SET hexagram_analysis = 
'Quẻ Đoài Vi Trạch: Quẻ thuần Kim, vui vẻ nhưng nếu quá sẽ tổn. Cả hai Đoài đều Kim, thuộc Phế Họng. Họng khô, ho khan. Bài thuốc nhuận phế, dưỡng thanh.'
WHERE hexagram_key = '2_2_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Trạch Thiên Quải: Dưới Càn (Kim) trên Đoài (Kim). Cả hai Kim, Kim quá cứng, Phế khí quá, ho ra máu, khạc đờm. Bài thuốc nhuận phế, chỉ huyết, giáng khí.'
WHERE hexagram_key = '2_1_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Trạch Hỏa Cách: Dưới Ly (Hỏa - Tâm) trên Đoài (Kim - Phế). Hỏa khắc Kim, Tâm Phế nhiệt, ho, ngực nóng. Bài thuốc thanh phế, giáng hỏa, chỉ ho.'
WHERE hexagram_key = '2_3_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Trạch Lôi Tùy: Dưới Chấn (Lôi - Mộc) trên Đoài (Kim - Phế). Kim khắc Mộc, Phế Can bất hòa, ho, sườn đau. Bài thuốc điều hòa Can Phế, giảm ho đau.'
WHERE hexagram_key = '2_4_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Trạch Phong Đại Quá: Dưới Tốn (Phong - Mộc) trên Đoài (Kim - Phế). Kim khắc Mộc, Phế khí quá, phong tà xâm, ho nhiều. Bài thuốc khu phong, nhuận phế.'
WHERE hexagram_key = '2_5_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Trạch Thủy Khốn: Dưới Khảm (Thủy - Thận) trên Đoài (Kim - Phế). Kim sinh Thủy, Phế Thận hư, khó thở, tiểu ít. Bài thuốc bổ phế thận, nạp khí.'
WHERE hexagram_key = '2_6_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Trạch Sơn Hàm: Dưới Cấn (Sơn - Thổ) trên Đoài (Kim - Phế). Thổ sinh Kim, Phế Vị cùng bệnh, ho và trướng bụng. Bài thuốc điều hòa Phế Vị.'
WHERE hexagram_key = '2_7_0' AND solution_type = 'prescription';

UPDATE solutions SET hexagram_analysis = 
'Quẻ Trạch Địa Tụy: Dưới Khôn (Thổ - Tỳ) trên Đoài (Kim - Phế). Thổ sinh Kim, Tỳ Phế liên bệnh, ho có đờm, bụng no. Bài thuốc hóa đờm, kiện tỳ.'
WHERE hexagram_key = '2_8_0' AND solution_type = 'prescription';
