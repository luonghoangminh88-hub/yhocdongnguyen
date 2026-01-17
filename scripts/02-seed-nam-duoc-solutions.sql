-- Seed Nam Dược (Herbal) solutions for all 64 hexagrams
-- This script populates the solutions table with herbal treatment data

-- Clear existing herbal solutions to ensure exactly 64 records
DELETE FROM solutions WHERE solution_type = 'prescription';

-- Insert herbal solutions for all 64 hexagrams
INSERT INTO solutions (
  hexagram_key, 
  solution_type, 
  title, 
  description, 
  unlock_cost,
  herb_name,
  meridian_pathway,
  preparation_method,
  reference_source
) VALUES

-- 1. Càn Vi Thiên - Affects Lungs, Bones (Metal element)
('1_1_1', 'prescription', 'Bài thuốc Càn Vi Thiên', 
 'Điều trị bệnh phổi, xương khớp, hô hấp theo hành Kim. Các vị thuốc: Ô dược, Sa nhân, Tô diệp.',
 50,
 'Ô dược (K001), Sa nhân (K002), Tô diệp (K003)',
 'Kinh Phế (Phổi), Kinh Đại Tràng',
 'Sắc 300ml nước, chia 2 lần uống sáng chiều. Uống ấm sau bữa ăn.',
 'Nam Dược Thần Hiệu - Tuệ Tĩnh, Hành Kim chủ Phế'),

-- 2. Khôn Vi Địa - Affects Spleen, Stomach (Earth element)
('2_2_1', 'prescription', 'Bài thuốc Khôn Vi Địa',
 'Bổ tỳ vị, tiêu hóa theo hành Thổ. Các vị thuốc: Đại táo, Mía, Dừa.',
 50,
 'Đại táo (TH001), Mía (TH002), Dừa (TH003)',
 'Kinh Tỳ, Kinh Vị',
 'Sắc 300ml, uống sau bữa ăn. Có thể dùng hàng ngày để bổ tỳ vị.',
 'Nam Dược Thần Hiệu - Tuệ Tĩnh, Hành Thổ chủ Tỳ'),

-- 3. Thủy Lôi Truân
('6_4_1', 'prescription', 'Bài thuốc Thủy Lôi Truân',
 'Điều hòa thận và gan, hành Thủy - Mộc. Các vị thuốc: Me, Dấm, Chanh.',
 50,
 'Me (M001), Dấm (M002), Chanh (M003)',
 'Kinh Thận, Kinh Gan',
 'Sắc 400ml, uống 2 lần/ngày. Giúp bổ thận, dưỡng gan.',
 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),

-- 4. Sơn Thủy Mông
('7_6_1', 'prescription', 'Bài thuốc Sơn Thủy Mông',
 'Bổ thận, tỳ theo hành Thổ - Thủy. Các vị thuốc: Đại táo, Bồ hòn, Dấm.',
 50,
 'Đại táo (TH001), Bồ hòn (T002), Dấm (M002)',
 'Kinh Tỳ, Kinh Thận',
 'Sắc 350ml, uống 2 lần. Bổ khí, tăng cường tiêu hóa.',
 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),

-- 5. Thủy Thiên Nhu
('6_1_1', 'prescription', 'Bài thuốc Thủy Thiên Nhu',
 'Bổ thận, phổi theo hành Thủy - Kim. Các vị thuốc: Dấm, Ô dược, Sa nhân.',
 50,
 'Dấm (M002), Ô dược (K001), Sa nhân (K002)',
 'Kinh Thận, Kinh Phế',
 'Sắc 300ml, uống 2 lần. Bổ phổi thận, tăng cường hô hấp.',
 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),

-- 6. Thiên Thủy Tụng
('1_6_1', 'prescription', 'Bài thuốc Thiên Thủy Tụng',
 'Thanh phổi, thận theo hành Kim - Thủy. Các vị thuốc: Tô diệp, Bồ hòn, Cam thảo.',
 50,
 'Tô diệp (K003), Bồ hòn (T002), Cam thảo (TH004)',
 'Kinh Phế, Kinh Thận',
 'Sắc 350ml, uống ấm. Thanh nhiệt, bổ thận.',
 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),

-- 7. Địa Thủy Sư
('2_6_1', 'prescription', 'Bài thuốc Địa Thủy Sư',
 'Bổ tỳ, thận theo hành Thổ - Thủy. Các vị thuốc: Mía, Dấm, Bồ hòn.',
 50,
 'Mía (TH002), Dấm (M002), Bồ hòn (T002)',
 'Kinh Tỳ, Kinh Thận',
 'Sắc 350ml, uống 2 lần. Bổ tỳ thận, tăng sức khỏe.',
 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),

-- 8. Thủy Địa Tỷ
('6_2_1', 'prescription', 'Bài thuốc Thủy Địa Tỷ',
 'Điều hòa thận, tỳ theo hành Thủy - Thổ. Các vị thuốc: Bồ hòn, Đại táo, Dừa.',
 50,
 'Bồ hòn (T002), Đại táo (TH001), Dừa (TH003)',
 'Kinh Thận, Kinh Tỳ',
 'Sắc 300ml, uống sau ăn. Điều hòa tỳ thận.',
 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),

-- 9. Phong Thiên Tiểu Súc
('5_1_1', 'prescription', 'Bài thuốc Phong Thiên Tiểu Súc',
 'Điều hòa gan, phổi theo hành Mộc - Kim. Các vị thuốc: Me, Ô dược, Gừng.',
 50,
 'Me (M001), Ô dược (K001), Gừng (K004)',
 'Kinh Gan, Kinh Phế',
 'Sắc 300ml, uống ấm. Giúp khí lưu thông, giải cảm.',
 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),

-- 10. Thiên Trạch Lý
('1_8_1', 'prescription', 'Bài thuốc Thiên Trạch Lý',
 'Thanh phổi, miệng họng theo hành Kim. Các vị thuốc: Sa nhân, Tô diệp, Lá lốt.',
 50,
 'Sa nhân (K002), Tô diệp (K003), Lá lốt (K005)',
 'Kinh Phế, Họng',
 'Sắc 300ml, uống hoặc súc miệng. Thanh nhiệt họng, giảm ho.',
 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),

-- 11. Địa Thiên Thái
('2_1_1', 'prescription', 'Bài thuốc Địa Thiên Thái', 'Bổ tỳ, phổi theo hành Thổ - Kim', 50, 'Đại táo (TH001), Mía (TH002), Ô dược (K001)', 'Kinh Tỳ, Kinh Phế', 'Sắc 350ml, uống 2 lần', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 12. Thiên Địa Phủ
('1_2_1', 'prescription', 'Bài thuốc Thiên Địa Phủ', 'Điều hòa phổi, tỳ theo hành Kim - Thổ', 50, 'Ô dược (K001), Đại táo (TH001), Cam thảo (TH004)', 'Kinh Phế, Kinh Tỳ', 'Sắc 300ml, uống sau ăn', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 13. Thiên Hỏa Đồng Nhân
('1_3_1', 'prescription', 'Bài thuốc Thiên Hỏa Đồng Nhân', 'Thanh tâm, phổi theo hành Hỏa - Kim', 50, 'Chè xanh (H001), Ô dược (K001), Sa nhân (K002)', 'Kinh Tâm, Kinh Phế', 'Sắc 350ml, uống mát', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 14. Hỏa Thiên Đại Hữu
('3_1_1', 'prescription', 'Bài thuốc Hỏa Thiên Đại Hữu', 'Điều hòa tim, phổi theo hành Hỏa - Kim', 50, 'Khổ qua (H002), Ô dược (K001), Tô diệp (K003)', 'Kinh Tâm, Kinh Phế', 'Sắc 350ml, uống chiều', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 15. Địa Sơn Khiêm
('2_7_1', 'prescription', 'Bài thuốc Địa Sơn Khiêm', 'Bổ tỳ vị theo hành Thổ', 50, 'Đại táo (TH001), Mía (TH002), Gạo nếp (TH005)', 'Kinh Tỳ, Kinh Vị', 'Sắc 350ml hoặc nấu cháo', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 16. Lôi Địa Dự
('4_2_1', 'prescription', 'Bài thuốc Lôi Địa Dự', 'Điều hòa gan, tỳ theo hành Mộc - Thổ', 50, 'Me (M001), Đại táo (TH001), Mía (TH002)', 'Kinh Gan, Kinh Tỳ', 'Sắc 300ml, uống sau ăn', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 17. Trạch Lôi Tùy
('8_4_1', 'prescription', 'Bài thuốc Trạch Lôi Tùy', 'Thanh phổi, gan theo hành Kim - Mộc', 50, 'Ô dược (K001), Me (M001), Dấm (M002)', 'Kinh Phế, Kinh Gan', 'Sắc 350ml, uống ấm', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 18. Sơn Phong Cổ
('7_5_1', 'prescription', 'Bài thuốc Sơn Phong Cổ', 'Điều hòa tỳ, gan theo hành Thổ - Mộc', 50, 'Đại táo (TH001), Me (M001), Chanh (M003)', 'Kinh Tỳ, Kinh Gan', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 19. Địa Trạch Lâm
('2_8_1', 'prescription', 'Bài thuốc Địa Trạch Lâm', 'Bổ tỳ, phổi theo hành Thổ - Kim', 50, 'Mía (TH002), Ô dược (K001), Sa nhân (K002)', 'Kinh Tỳ, Kinh Phế', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 20. Phong Địa Quan
('5_2_1', 'prescription', 'Bài thuốc Phong Địa Quan', 'Điều hòa gan, tỳ theo hành Mộc - Thổ', 50, 'Dấm (M002), Đại táo (TH001), Dừa (TH003)', 'Kinh Gan, Kinh Tỳ', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 21. Hỏa Lôi Thệ Hạp
('3_4_1', 'prescription', 'Bài thuốc Hỏa Lôi Thệ Hạp', 'Thanh tâm, gan theo hành Hỏa - Mộc', 50, 'Chè xanh (H001), Me (M001), Dấm (M002)', 'Kinh Tâm, Kinh Gan', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 22. Sơn Hỏa Bí
('7_3_1', 'prescription', 'Bài thuốc Sơn Hỏa Bí', 'Điều hòa tỳ, tim theo hành Thổ - Hỏa', 50, 'Đại táo (TH001), Chè xanh (H001), Khổ qua (H002)', 'Kinh Tỳ, Kinh Tâm', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 23. Sơn Địa Bác
('7_2_1', 'prescription', 'Bài thuốc Sơn Địa Bác', 'Bổ tỳ vị theo hành Thổ', 50, 'Mía (TH002), Dừa (TH003), Cam thảo (TH004)', 'Kinh Tỳ, Kinh Vị', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 24. Địa Lôi Phục
('2_4_1', 'prescription', 'Bài thuốc Địa Lôi Phục', 'Điều hòa tỳ, gan theo hành Thổ - Mộc', 50, 'Đại táo (TH001), Me (M001), Quất (M004)', 'Kinh Tỳ, Kinh Gan', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 25. Thiên Lôi Vô Vọng
('1_4_1', 'prescription', 'Bài thuốc Thiên Lôi Vô Vọng', 'Điều hòa phổi, gan theo hành Kim - Mộc', 50, 'Sa nhân (K002), Me (M001), Dấm (M002)', 'Kinh Phế, Kinh Gan', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 26. Thiên Sơn Đại Súc
('7_1_1', 'prescription', 'Bài thuốc Thiên Sơn Đại Súc', 'Bổ tỳ, phổi theo hành Thổ - Kim', 50, 'Đại táo (TH001), Ô dược (K001), Sa nhân (K002)', 'Kinh Tỳ, Kinh Phế', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 27. Sơn Lôi Di
('7_4_1', 'prescription', 'Bài thuốc Sơn Lôi Di', 'Điều hòa tỳ, gan theo hành Thổ - Mộc', 50, 'Mía (TH002), Me (M001), Chanh (M003)', 'Kinh Tỳ, Kinh Gan', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 28. Trạch Phong Đại Quá
('8_5_1', 'prescription', 'Bài thuốc Trạch Phong Đại Quá', 'Thanh phổi, gan theo hành Kim - Mộc', 50, 'Tô diệp (K003), Me (M001), Dấm (M002)', 'Kinh Phế, Kinh Gan', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 29. Khảm Vi Thủy
('6_6_1', 'prescription', 'Bài thuốc Khảm Vi Thủy', 'Bổ thận, điều hòa nước theo hành Thủy', 50, 'Dấm (M002), Bồ hòn (T002), Cam thảo (TH004)', 'Kinh Thận, Kinh Bàng quang', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 30. Ly Vi Hỏa
('3_3_1', 'prescription', 'Bài thuốc Ly Vi Hỏa', 'Thanh tâm hỏa theo hành Hỏa', 50, 'Chè xanh (H001), Khổ qua (H002), Rau đắng (H003)', 'Kinh Tâm, Kinh Tiểu tràng', 'Sắc 300ml, uống mát', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 31. Trạch Sơn Hàm
('8_7_1', 'prescription', 'Bài thuốc Trạch Sơn Hàm', 'Điều hòa phổi, tỳ theo hành Kim - Thổ', 50, 'Ô dược (K001), Đại táo (TH001), Mía (TH002)', 'Kinh Phế, Kinh Tỳ', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 32. Lôi Phong Hằng
('4_5_1', 'prescription', 'Bài thuốc Lôi Phong Hằng', 'Điều hòa gan, mật theo hành Mộc', 50, 'Me (M001), Dấm (M002), Chanh (M003)', 'Kinh Gan, Kinh Mật', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 33. Thiên Sơn Độn
('1_7_1', 'prescription', 'Bài thuốc Thiên Sơn Độn', 'Bổ phổi, tỳ theo hành Kim - Thổ', 50, 'Ô dược (K001), Đại táo (TH001), Dừa (TH003)', 'Kinh Phế, Kinh Tỳ', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 34. Lôi Thiên Đại Tráng
('4_1_1', 'prescription', 'Bài thuốc Lôi Thiên Đại Tráng', 'Điều hòa gan, phổi theo hành Mộc - Kim', 50, 'Dấm (M002), Ô dược (K001), Sa nhân (K002)', 'Kinh Gan, Kinh Phế', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 35. Hỏa Địa Tấn
('3_2_1', 'prescription', 'Bài thuốc Hỏa Địa Tấn', 'Thanh tâm, bổ tỳ theo hành Hỏa - Thổ', 50, 'Chè xanh (H001), Đại táo (TH001), Mía (TH002)', 'Kinh Tâm, Kinh Tỳ', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 36. Địa Hỏa Minh Di
('2_3_1', 'prescription', 'Bài thuốc Địa Hỏa Minh Di', 'Bổ tỳ, thanh tâm theo hành Thổ - Hỏa', 50, 'Đại táo (TH001), Chè xanh (H001), Khổ qua (H002)', 'Kinh Tỳ, Kinh Tâm', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 37. Phong Hỏa Gia Nhân
('5_3_1', 'prescription', 'Bài thuốc Phong Hỏa Gia Nhân', 'Điều hòa gan, tim theo hành Mộc - Hỏa', 50, 'Me (M001), Chè xanh (H001), Khổ qua (H002)', 'Kinh Gan, Kinh Tâm', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 38. Hỏa Trạch Khuy
('3_8_1', 'prescription', 'Bài thuốc Hỏa Trạch Khuy', 'Thanh tâm, phổi theo hành Hỏa - Kim', 50, 'Khổ qua (H002), Ô dược (K001), Sa nhân (K002)', 'Kinh Tâm, Kinh Phế', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 39. Thủy Sơn Kiển
('6_7_1', 'prescription', 'Bài thuốc Thủy Sơn Kiển', 'Bổ thận, tỳ theo hành Thủy - Thổ', 50, 'Dấm (M002), Đại táo (TH001), Mía (TH002)', 'Kinh Thận, Kinh Tỳ', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 40. Lôi Thủy Giải
('4_6_1', 'prescription', 'Bài thuốc Lôi Thủy Giải', 'Điều hòa gan, thận theo hành Mộc - Thủy', 50, 'Me (M001), Dấm (M002), Bồ hòn (T002)', 'Kinh Gan, Kinh Thận', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 41. Sơn Trạch Tổn
('7_8_1', 'prescription', 'Bài thuốc Sơn Trạch Tổn', 'Điều hòa tỳ, phổi theo hành Thổ - Kim', 50, 'Mía (TH002), Ô dược (K001), Tô diệp (K003)', 'Kinh Tỳ, Kinh Phế', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 42. Phong Lôi Ích
('5_4_1', 'prescription', 'Bài thuốc Phong Lôi Ích', 'Điều hòa gan, mật theo hành Mộc', 50, 'Dấm (M002), Chanh (M003), Quất (M004)', 'Kinh Gan, Kinh Mật', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 43. Trạch Thiên Quải
('8_1_1', 'prescription', 'Bài thuốc Trạch Thiên Quải', 'Thanh phổi theo hành Kim', 50, 'Sa nhân (K002), Tô diệp (K003), Gừng (K004)', 'Kinh Phế, Kinh Đại tràng', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 44. Thiên Phong Cấu
('1_5_1', 'prescription', 'Bài thuốc Thiên Phong Cấu', 'Điều hòa phổi, gan theo hành Kim - Mộc', 50, 'Ô dược (K001), Me (M001), Dấm (M002)', 'Kinh Phế, Kinh Gan', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 45. Trạch Địa Tụy
('8_2_1', 'prescription', 'Bài thuốc Trạch Địa Tụy', 'Thanh phổi, bổ tỳ theo hành Kim - Thổ', 50, 'Sa nhân (K002), Đại táo (TH001), Mía (TH002)', 'Kinh Phế, Kinh Tỳ', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 46. Địa Phong Thăng
('2_5_1', 'prescription', 'Bài thuốc Địa Phong Thăng', 'Bổ tỳ, gan theo hành Thổ - Mộc', 50, 'Đại táo (TH001), Me (M001), Dấm (M002)', 'Kinh Tỳ, Kinh Gan', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 47. Trạch Thủy Khốn
('8_6_1', 'prescription', 'Bài thuốc Trạch Thủy Khốn', 'Điều hòa phổi, thận theo hành Kim - Thủy', 50, 'Ô dược (K001), Dấm (M002), Bồ hòn (T002)', 'Kinh Phế, Kinh Thận', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 48. Thủy Phong Tỉnh
('6_5_1', 'prescription', 'Bài thuốc Thủy Phong Tỉnh', 'Bổ thận, gan theo hành Thủy - Mộc', 50, 'Dấm (M002), Me (M001), Bồ hòn (T002)', 'Kinh Thận, Kinh Gan', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 49. Trạch Hỏa Cách
('8_3_1', 'prescription', 'Bài thuốc Trạch Hỏa Cách', 'Thanh phổi, tâm theo hành Kim - Hỏa', 50, 'Sa nhân (K002), Chè xanh (H001), Khổ qua (H002)', 'Kinh Phế, Kinh Tâm', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 50. Hỏa Phong Đỉnh
('3_5_1', 'prescription', 'Bài thuốc Hỏa Phong Đỉnh', 'Thanh tâm, gan theo hành Hỏa - Mộc', 50, 'Chè xanh (H001), Me (M001), Dấm (M002)', 'Kinh Tâm, Kinh Gan', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 51. Chấn Vi Lôi
('4_4_1', 'prescription', 'Bài thuốc Chấn Vi Lôi', 'Điều hòa gan, mật theo hành Mộc', 50, 'Me (M001), Dấm (M002), Chanh (M003)', 'Kinh Gan, Kinh Mật', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 52. Cấn Vi Sơn
('7_7_1', 'prescription', 'Bài thuốc Cấn Vi Sơn', 'Bổ tỳ vị theo hành Thổ', 50, 'Đại táo (TH001), Mía (TH002), Dừa (TH003)', 'Kinh Tỳ, Kinh Vị', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 53. Phong Sơn Tiệm
('5_7_1', 'prescription', 'Bài thuốc Phong Sơn Tiệm', 'Điều hòa gan, tỳ theo hành Mộc - Thổ', 50, 'Me (M001), Đại táo (TH001), Mía (TH002)', 'Kinh Gan, Kinh Tỳ', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 54. Lôi Trạch Quy Muội
('4_8_1', 'prescription', 'Bài thuốc Lôi Trạch Quy Muội', 'Điều hòa gan, phổi theo hành Mộc - Kim', 50, 'Dấm (M002), Ô dược (K001), Sa nhân (K002)', 'Kinh Gan, Kinh Phế', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 55. Lôi Hỏa Phong
('4_3_1', 'prescription', 'Bài thuốc Lôi Hỏa Phong', 'Điều hòa gan, tim theo hành Mộc - Hỏa', 50, 'Me (M001), Chè xanh (H001), Khổ qua (H002)', 'Kinh Gan, Kinh Tâm', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 56. Hỏa Sơn Lữ
('3_7_1', 'prescription', 'Bài thuốc Hỏa Sơn Lữ', 'Thanh tâm, bổ tỳ theo hành Hỏa - Thổ', 50, 'Khổ qua (H002), Đại táo (TH001), Mía (TH002)', 'Kinh Tâm, Kinh Tỳ', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 57. Tốn Vi Phong
('5_5_1', 'prescription', 'Bài thuốc Tốn Vi Phong', 'Điều hòa gan, mật theo hành Mộc', 50, 'Dấm (M002), Chanh (M003), Quất (M004)', 'Kinh Gan, Kinh Mật', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 58. Đoài Vi Trạch
('8_8_1', 'prescription', 'Bài thuốc Đoài Vi Trạch', 'Thanh phổi, họng theo hành Kim', 50, 'Ô dược (K001), Sa nhân (K002), Tô diệp (K003)', 'Kinh Phế, Họng', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 59. Phong Thủy Hoán
('5_6_1', 'prescription', 'Bài thuốc Phong Thủy Hoán', 'Điều hòa gan, thận theo hành Mộc - Thủy', 50, 'Me (M001), Dấm (M002), Bồ hòn (T002)', 'Kinh Gan, Kinh Thận', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 60. Thủy Trạch Tiết
('6_8_1', 'prescription', 'Bài thuốc Thủy Trạch Tiết', 'Bổ thận, phổi theo hành Thủy - Kim', 50, 'Dấm (M002), Ô dược (K001), Sa nhân (K002)', 'Kinh Thận, Kinh Phế', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 61. Phong Trạch Trung Phu
('5_8_1', 'prescription', 'Bài thuốc Phong Trạch Trung Phu', 'Điều hòa gan, phổi theo hành Mộc - Kim', 50, 'Dấm (M002), Ô dược (K001), Tô diệp (K003)', 'Kinh Gan, Kinh Phế', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 62. Lôi Sơn Tiểu Quá
('4_7_1', 'prescription', 'Bài thuốc Lôi Sơn Tiểu Quá', 'Điều hòa gan, tỳ theo hành Mộc - Thổ', 50, 'Me (M001), Đại táo (TH001), Dừa (TH003)', 'Kinh Gan, Kinh Tỳ', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 63. Thủy Hỏa Ký Tế
('6_3_1', 'prescription', 'Bài thuốc Thủy Hỏa Ký Tế', 'Điều hòa thận, tim (Thủy - Hỏa giao thái)', 50, 'Dấm (M002), Chè xanh (H001), Khổ qua (H002)', 'Kinh Thận, Kinh Tâm', 'Sắc 300ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh'),
-- 64. Hỏa Thủy Vị Tế
('3_6_1', 'prescription', 'Bài thuốc Hỏa Thủy Vị Tế', 'Cân bằng tâm thận, Hỏa - Thủy', 50, 'Chè xanh (H001), Dấm (M002), Bồ hòn (T002)', 'Kinh Tâm, Kinh Thận', 'Sắc 350ml', 'Nam Dược Thần Hiệu - Tuệ Tĩnh');

-- Verify exactly 64 records were inserted
SELECT COUNT(*) as total_herbal_solutions FROM solutions WHERE solution_type = 'prescription';
