-- Script Seed dữ liệu bài thuốc thực tế từ Nam Dược Thần Hiệu cho 64 quẻ
-- Quy tắc: Sử dụng moving_line = 0 làm bài thuốc gốc cho mỗi quẻ.
-- Cập nhật: Mức phí mở khóa là 199,000 VNĐ cho mỗi bài thuốc Premium.

DELETE FROM solutions WHERE solution_type = 'prescription';

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

-- NHÓM CÀN (KIM)
('1_1_0', 'prescription', 'Bài thuốc Càn Vi Thiên (Thanh Phế Thang)', 'Trị ho suyễn, phổi nhiệt, phế khí hư tổn.', 199000, 'Tang bạch bì, Hạnh nhân, Bối mẫu, Cam thảo.', 'Kinh Phế', 'Sắc uống ngày 1 thang.', 'Nam Dược Thần Hiệu - Chương VIII'),
('1_8_0', 'prescription', 'Bài thuốc Thiên Trạch Lý (Cát Cánh Thang)', 'Trị đau họng, mất tiếng, cổ họng sưng đau.', 199000, 'Cát cánh, Cam thảo, Kinh giới, Phòng phong.', 'Kinh Phế, Họng', 'Sắc uống hoặc ngậm nuốt dần.', 'Nam Dược Thần Hiệu - Chương VIII'),
('1_3_0', 'prescription', 'Bài thuốc Thiên Hỏa Đồng Nhân (Thanh Tâm Phế)', 'Trị chứng nóng trong người, ngực phiền nôn nao.', 199000, 'Hoàng liên, Chi tử, Cát cánh, Bạc hà.', 'Kinh Tâm, Kinh Phế', 'Sắc uống sau bữa ăn.', 'Nam Dược Thần Hiệu - Chương III'),
('1_4_0', 'prescription', 'Bài thuốc Thiên Lôi Vô Vọng (Khu Phong Định Thống)', 'Trị đau đầu, chóng mặt do phong nhiệt thượng nạp.', 199000, 'Cúc hoa, Bạc hà, Kinh giới, Câu đằng.', 'Kinh Can, Kinh Phế', 'Sắc uống ấm.', 'Nam Dược Thần Hiệu - Chương I'),
('1_5_0', 'prescription', 'Bài thuốc Thiên Phong Cấu (Tán Hàn Giải Biểu)', 'Trị cảm mạo phong hàn, đầu đau, mình mẩy nhức mỏi.', 199000, 'Tô diệp, Kinh giới, Gừng tươi, Hành trần.', 'Kinh Phế', 'Xông và sắc uống cho ra mồ hôi.', 'Nam Dược Thần Hiệu - Chương III'),
('1_6_0', 'prescription', 'Bài thuốc Thiên Thủy Tụng (Thông Lâm Cách)', 'Trị chứng bí tiểu, nước tiểu đỏ, nóng rát.', 199000, 'Xa tiền tử, Mộc thông, Cam thảo, Hoạt thạch.', 'Kinh Bàng Quang', 'Sắc uống lúc thuốc còn ấm.', 'Nam Dược Thần Hiệu - Chương V'),
('1_7_0', 'prescription', 'Bài thuốc Thiên Sơn Độn (Bổ Khí Dưỡng Tỳ)', 'Trị người mệt mỏi, khí hư, ăn uống không ngon.', 199000, 'Nhân sâm, Bạch truật, Phục linh, Cam thảo.', 'Kinh Tỳ, Kinh Phế', 'Sắc uống hoặc làm viên.', 'Nam Dược Thần Hiệu - Chương VI'),
('1_2_0', 'prescription', 'Bài thuốc Thiên Địa Phủ (Điều Hòa Trung Tiêu)', 'Trị bụng đầy, nôn mửa, khí không lưu thông.', 199000, 'Trần bì, Hậu phác, Mộc hương, Sa nhân.', 'Kinh Vị, Kinh Phế', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VI'),

-- NHÓM KHÔN (THỔ)
('8_8_0', 'prescription', 'Bài thuốc Khôn Vi Địa (Bình Vị Tán)', 'Trị tỳ vị hư yếu, ăn không tiêu, bụng đầy trướng.', 199000, 'Thương truật, Hậu phác, Trần bì, Cam thảo.', 'Kinh Tỳ, Kinh Vị', 'Sắc với gừng và táo.', 'Nam Dược Thần Hiệu - Chương VI'),
('8_1_0', 'prescription', 'Bài thuốc Địa Thiên Thái (Bát Trân Thang)', 'Bổ khí huyết, trị người suy nhược, da xanh xao.', 199000, 'Sâm, Truật, Linh, Thảo, Quy, Khung, Thược, Thục.', 'Kinh Tâm, Kinh Tỳ', 'Sắc uống ngày 1 thang.', 'Nam Dược Thần Hiệu - Chương X'),
('8_3_0', 'prescription', 'Bài thuốc Địa Hỏa Minh Di (Thanh Tỳ Tả Hỏa)', 'Trị chứng nóng trong dạ dày, miệng hôi, loét miệng.', 199000, 'Thạch cao, Tri mẫu, Hoàng liên, Cam thảo.', 'Kinh Vị', 'Sắc uống nguội.', 'Nam Dược Thần Hiệu - Chương VI'),
('8_4_0', 'prescription', 'Bài thuốc Địa Lôi Phục (Ôn Trung Tán Hàn)', 'Trị đau bụng do lạnh, đi ngoài phân lỏng.', 199000, 'Can khương, Nhục quế, Cao lương khương.', 'Kinh Tỳ', 'Sắc uống nóng.', 'Nam Dược Thần Hiệu - Chương VI'),
('8_5_0', 'prescription', 'Bài thuốc Địa Phong Thăng (Kiện Tỳ Hành Khí)', 'Trị bụng chướng, ợ hơi, tỳ khí hạ hãm.', 199000, 'Đẳng sâm, Bạch truật, Thăng ma, Sài hồ.', 'Kinh Tỳ', 'Sắc uống buổi sáng.', 'Nam Dược Thần Hiệu - Chương VI'),
('8_6_0', 'prescription', 'Bài thuốc Địa Thủy Sư (Lợi Thủy Tiêu Thũng)', 'Trị phù thũng, bụng to, chân tay sưng phù.', 199000, 'Vỏ bí đao, Phục linh, Trạch tả, Xa tiền thảo.', 'Kinh Thận, Kinh Tỳ', 'Sắc uống thay trà.', 'Nam Dược Thần Hiệu - Chương IV'),
('8_7_0', 'prescription', 'Bài thuốc Địa Sơn Khiêm (Ý Dĩ Thang)', 'Trị thấp khớp, mình mẩy nặng nề, tê bại.', 199000, 'Ý dĩ nhân, Thổ phục linh, Hy thiêm.', 'Kinh Tỳ', 'Sắc uống hoặc ngâm rượu.', 'Nam Dược Thần Hiệu - Chương VII'),
('8_2_0', 'prescription', 'Bài thuốc Địa Trạch Lâm (Dưỡng Vị Nhuận Tràng)', 'Trị táo bón, vị âm hư, họng khô.', 199000, 'Mạch môn, Thạch hộc, Vừng đen, Mật ong.', 'Kinh Vị', 'Sắc uống hoặc trộn mật.', 'Nam Dược Thần Hiệu - Chương IV'),

-- NHÓM CHẤN (MỘC)
('4_4_0', 'prescription', 'Bài thuốc Chấn Vi Lôi (Định Kinh Hoàn)', 'Trị kinh sợ, co giật, trẻ em sốt cao.', 199000, 'Thiên ma, Câu đằng, Thần sa, Toàn yết.', 'Kinh Can', 'Làm viên, uống với nước lá dâu.', 'Nam Dược Thần Hiệu - Chương IX'),
('4_1_0', 'prescription', 'Bài thuốc Lôi Thiên Đại Tráng (Trấn Can Tức Phong)', 'Trị cao huyết áp, chóng mặt, đầu nặng.', 199000, 'Hạ khô thảo, Câu đằng, Hoa hòe.', 'Kinh Can', 'Sắc uống hàng ngày.', 'Nam Dược Thần Hiệu - Chương I'),
('4_8_0', 'prescription', 'Bài thuốc Lôi Trạch Quy Muội (Điều Kinh Tán)', 'Trị phụ nữ kinh nguyệt không đều, huyết uất.', 199000, 'Đương quy, Hương phụ, Ích mẫu thảo.', 'Kinh Can, Tử cung', 'Sắc uống trước kỳ kinh.', 'Nam Dược Thần Hiệu - Chương X'),
('4_3_0', 'prescription', 'Bài thuốc Lôi Hỏa Phong (Thanh Can Tả Hỏa)', 'Trị mắt đỏ, tính tình nóng nảy, tai ù.', 199000, 'Long đởm thảo, Chi tử, Hoàng cầm.', 'Kinh Can', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương I'),
('4_5_0', 'prescription', 'Bài thuốc Lôi Phong Hằng (Khu Phong Hoạt Lạc)', 'Trị đau khớp mãn tính, phong thấp.', 199000, 'Độc hoạt, Tang ký sinh, Tần giao.', 'Kinh Can, Kinh Thận', 'Sắc uống ấm.', 'Nam Dược Thần Hiệu - Chương VII'),
('4_6_0', 'prescription', 'Bài thuốc Lôi Thủy Giải (Thông Kinh Hoạt Huyết)', 'Giải tỏa uất kết, trị đau tức sườn ngực.', 199000, 'Sài hồ, Uất kim, Chỉ xác, Hương phụ.', 'Kinh Can', 'Sắc uống lúc đói.', 'Nam Dược Thần Hiệu - Chương VII'),
('4_7_0', 'prescription', 'Bài hiệu Lôi Sơn Tiểu Quá (Chỉ Thống Tán)', 'Trị các chứng đau cơ, co thắt khớp nhẹ.', 199000, 'Mộc qua, Bạch thược, Cam thảo.', 'Kinh Can', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VII'),
('4_2_0', 'prescription', 'Bài thuốc Lôi Địa Dự (Tùng Can Kiện Tỳ)', 'Trị tiêu hóa kém do can tỳ bất hòa.', 199000, 'Sài hồ, Bạch truật, Phục linh.', 'Kinh Can, Kinh Tỳ', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VI'),

-- NHÓM TỐN (MỘC)
('5_5_0', 'prescription', 'Bài thuốc Tốn Vi Phong (Thần Tiễn Tán)', 'Trị trúng phong, liệt nửa người, méo mồm.', 199000, 'Kinh giới, Phòng phong, Khương hoạt, Sài hồ.', 'Kinh Can', 'Sắc với gừng tươi.', 'Nam Dược Thần Hiệu - Chương I'),
('5_1_0', 'prescription', 'Bài thuốc Phong Thiên Tiểu Súc (Sơ Phong Giải Biểu)', 'Trị cảm gió nhẹ, hắt hơi, sổ mũi.', 199000, 'Bạc hà, Kinh giới, Lá tía tô.', 'Kinh Phế', 'Sắc uống nóng.', 'Nam Dược Thần Hiệu - Chương III'),
('5_8_0', 'prescription', 'Bài thuốc Phong Trạch Trung Phu (Nhuận Phế Chỉ Khái)', 'Trị ho khan do gió, ngứa họng.', 199000, 'Tang diệp, Cúc hoa, Hạnh nhân.', 'Kinh Phế', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VIII'),
('5_3_0', 'prescription', 'Bài thuốc Phong Hỏa Gia Nhân (Thanh Nhiệt Sơ Can)', 'Trị đau đầu do hỏa bốc, mắt mờ.', 199000, 'Kỷ tử, Cúc hoa, Quyết minh tử.', 'Kinh Can, Kinh Tâm', 'Sắc uống thay trà.', 'Nam Dược Thần Hiệu - Chương I'),
('5_4_0', 'prescription', 'Bài thuốc Phong Lôi Ích (Bổ Huyết Khứ Phong)', 'Trị tê bại do huyết hư không dưỡng được gân.', 199000, 'Đương quy, Thục địa, Kê huyết đằng.', 'Kinh Can', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VII'),
('5_6_0', 'prescription', 'Bài thuốc Phong Thủy Hoán (Tán Thấp Thông Lạc)', 'Trị phù thũng do phong thấp.', 199000, 'Quế chi, Phục linh, Trạch tả.', 'Kinh Bàng Quang', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương IV'),
('5_7_0', 'prescription', 'Bài thuốc Phong Sơn Tiệm (Kiện Tỳ Khứ Thấp)', 'Trị ăn ít, người mệt, chân tay nặng nề.', 199000, 'Bạch truật, Ý dĩ, Đẳng sâm.', 'Kinh Tỳ', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VI'),
('5_2_0', 'prescription', 'Bài thuốc Phong Địa Quan (Lý Khí Chỉ Thống)', 'Trị đau bụng kinh, khí trệ.', 199000, 'Hương phụ, Ngải cứu, Ích mẫu.', 'Kinh Can', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương X'),

-- NHÓM LY (HỎA)
('3_3_0', 'prescription', 'Bài thuốc Ly Vi Hỏa (Thanh Cách Tán)', 'Thanh nhiệt độc thượng tiêu, trị tâm phiền.', 199000, 'Hoàng liên, Chi tử, Liên kiều.', 'Kinh Tâm', 'Sắc uống nguội.', 'Nam Dược Thần Hiệu - Chương III'),
('3_1_0', 'prescription', 'Bài thuốc Hỏa Thiên Đại Hữu (Tả Hỏa Thông Tiện)', 'Trị nhiệt kết, táo bón, tiểu đỏ.', 199000, 'Đại hoàng, Mang tiêu, Hoàng cầm.', 'Kinh Đại Trường', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương IV'),
('3_8_0', 'prescription', 'Bài thuốc Hỏa Trạch Khuy (Thanh Hỏa Nhuận Họng)', 'Trị loét miệng, sưng lợi, họng khô.', 199000, 'Huyền sâm, Sinh địa, Tri mẫu.', 'Kinh Tâm, Kinh Phế', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VIII'),
('3_4_0', 'prescription', 'Bài thuốc Hỏa Lôi Thệ Hạp (Giải Độc Tiêu Sưng)', 'Trị mụn nhọt, sưng đau do nhiệt độc.', 199000, 'Kim ngân hoa, Bồ công anh, Sài đất.', 'Kinh Tâm', 'Sắc uống và đắp ngoài.', 'Nam Dược Thần Hiệu - Chương III'),
('3_5_0', 'prescription', 'Bài thuốc Hỏa Phong Đỉnh (Sơ Đới Tâm Hỏa)', 'Trị mất ngủ, hay quên, hồi hộp.', 199000, 'Viễn chí, Táo nhân, Phục thần.', 'Kinh Tâm', 'Sắc uống trước khi ngủ.', 'Nam Dược Thần Hiệu - Chương X'),
('3_6_0', 'prescription', 'Bài thuốc Hỏa Thủy Vị Tế (Thanh Nhiệt Dưỡng Âm)', 'Trị nóng trong xương, ra mồ hôi trộm.', 199000, 'Địa cốt bì, Tri mẫu, Hoàng bá.', 'Kinh Thận, Kinh Tâm', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương V'),
('3_7_0', 'prescription', 'Bài thuốc Hỏa Sơn Lữ (An Thần Định Chí)', 'Trị tâm thần bất an, hay nằm mơ.', 199000, 'Chu sa, Long cốt, Mẫu lệ.', 'Kinh Tâm', 'Tán bột làm viên.', 'Nam Dược Thần Hiệu - Chương IX'),
('3_2_0', 'prescription', 'Bài thuốc Hỏa Địa Tấn (Thanh Tâm Kiện Tỳ)', 'Trị lo âu dẫn đến ăn không ngon.', 199000, 'Hạt sen, Long nhãn, Đại táo.', 'Kinh Tâm, Kinh Tỳ', 'Nấu chè hoặc sắc uống.', 'Nam Dược Thần Hiệu - Chương VI'),

-- NHÓM KHẢM (THỦY)
('6_6_0', 'prescription', 'Bài thuốc Khảm Vi Thủy (Lục Vị Địa Hoàng)', 'Bổ thận âm, trị lưng đau gối mỏi.', 199000, 'Thục địa, Sơn thù, Hoài sơn, Trạch tả.', 'Kinh Thận', 'Làm viên mật.', 'Nam Dược Thần Hiệu - Chương V'),
('6_1_0', 'prescription', 'Bài thuốc Thủy Thiên Nhu (Kim Thủy Tương Sinh)', 'Bổ cả phổi và thận, trị ho lâu ngày.', 199000, 'Mạch môn, Sa sâm, Kỷ tử.', 'Kinh Phế, Kinh Thận', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VIII'),
('6_8_0', 'prescription', 'Bài thuốc Thủy Trạch Tiết (Lợi Niệu Thông Lâm)', 'Trị đái rắt, đái buốt.', 199000, 'Tỳ giải, Khổ sâm, Kim tiền thảo.', 'Kinh Bàng Quang', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương V'),
('6_3_0', 'prescription', 'Bài thuốc Thủy Hỏa Ký Tế (Giao Thái Hoàn)', 'Tâm thận tương giao, trị mất ngủ.', 199000, 'Hoàng liên, Nhục quế.', 'Kinh Tâm, Kinh Thận', 'Làm viên uống.', 'Nam Dược Thần Hiệu - Lý luận Tâm Thận'),
('6_4_0', 'prescription', 'Bài thuốc Thủy Lôi Truân (Bổ Thận Dưỡng Gan)', 'Trị thận hư gây ù tai, gan yếu gây mờ mắt.', 199000, 'Thục địa, Câu kỷ tử, Cúc hoa.', 'Kinh Thận, Kinh Can', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương V'),
('6_5_0', 'prescription', 'Bài thuốc Thủy Phong Tỉnh (Thông Thận Khí)', 'Trị chứng bí tiểu do lạnh (thận dương hư).', 199000, 'Quế chi, Phụ tử, Phục linh.', 'Kinh Thận', 'Sắc uống nóng.', 'Nam Dược Thần Hiệu - Chương V'),
('6_7_0', 'prescription', 'Bài thuốc Thủy Sơn Kiển (Bổ Thận Tỳ)', 'Trị phù thũng, người nặng nề mệt mỏi.', 199000, 'Ngũ gia bì, Đỗ trọng, Bạch truật.', 'Kinh Thận, Kinh Tỳ', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương IV'),
('6_2_0', 'prescription', 'Bài thuốc Thủy Địa Tỷ (Ôn Thận Lợi Thủy)', 'Trị tiểu đêm nhiều lần, chân tay lạnh.', 199000, 'Phá cố chỉ, Nhục thung dung.', 'Kinh Thận', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương V'),

-- NHÓM CẤN (THỔ)
('7_7_0', 'prescription', 'Bài thuốc Cấn Vi Sơn (Sâm Linh Bạch Truật)', 'Trị tỳ hư, tiêu chảy mãn tính.', 199000, 'Đẳng sâm, Bạch truật, Hoài sơn, Liên nhục.', 'Kinh Tỳ', 'Tán bột uống với nước cơm.', 'Nam Dược Thần Hiệu - Chương VI'),
('7_1_0', 'prescription', 'Bài thuốc Sơn Thiên Đại Súc (Bổ Khí An Thai)', 'Dưỡng thai, trị khí hư động thai.', 199000, 'Gai rễ, Củ gai, Trữ ma căn.', 'Kinh Tỳ, Tử cung', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương X'),
('7_8_0', 'prescription', 'Bài thuốc Sơn Trạch Tổn (ÍCH Vị Chỉ Khái)', 'Trị ho do vị nhiệt bốc lên.', 199000, 'Mướp đắng, Lá dâu, Lá lốt.', 'Kinh Vị, Kinh Phế', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VIII'),
('7_3_0', 'prescription', 'Bài thuốc Sơn Hỏa Bí (Điều Hòa Tỳ Tâm)', 'Trị ăn xong hồi hộp, lo âu.', 199000, 'Hạt sen, Phục thần, Viễn chí.', 'Kinh Tỳ, Kinh Tâm', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VI'),
('7_4_0', 'prescription', 'Bài thuốc Sơn Lôi Di (Dưỡng Vị Chỉ Ẩu)', 'Trị nôn mửa, nấc cụt.', 199000, 'Gừng tươi, Trần bì, Bán hạ chế.', 'Kinh Vị', 'Sắc uống ấm.', 'Nam Dược Thần Hiệu - Chương VI'),
('7_5_0', 'prescription', 'Bài thuốc Sơn Phong Cổ (Trị Trùng Tích)', 'Trị đau bụng giun, tiêu hóa kém.', 199000, 'Sử quân tử, Binh lang, Khổ luyện bì.', 'Kinh Vị, Ruột', 'Sắc uống lúc đói.', 'Nam Dược Thần Hiệu - Chương VI'),
('7_6_0', 'prescription', 'Bài thuốc Sơn Thủy Mông (Khai Tâm Thông Khiếu)', 'Trị chứng hay quên, đầu óc mơ hồ.', 199000, 'Xương bồ, Viễn chí, Phục linh.', 'Kinh Tâm, Kinh Thận', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương IX'),
('7_2_0', 'prescription', 'Bài thuốc Sơn Địa Bác (Bổ Trung Ích Khí)', 'Trị sa dạ dày, cơ nhục yếu bủng.', 199000, 'Hoàng kỳ, Nhân sâm, Bạch truật, Thăng ma.', 'Kinh Tỳ', 'Sắc uống buổi sáng.', 'Nam Dược Thần Hiệu - Chương VI'),

-- NHÓM ĐOÀI (KIM)
('2_2_0', 'prescription', 'Bài thuốc Đoài Vi Trạch (Cam Thảo Tế Tân)', 'Trị hôi miệng, lở loét lưỡi.', 199000, 'Cam thảo, Tế tân, Hoàng liên.', 'Kinh Tâm, Miệng', 'Ngậm và súc miệng.', 'Nam Dược Thần Hiệu - Chương VIII'),
('2_1_0', 'prescription', 'Bài thuốc Trạch Thiên Quải (Thông Phế Chỉ Khái)', 'Trị ho có đờm, ngực tức.', 199000, 'Bán hạ, Trần bì, Cát cánh.', 'Kinh Phế', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VIII'),
('2_3_0', 'prescription', 'Bài thuốc Trạch Hỏa Cách (Tả Hỏa Nhuận Phế)', 'Trị ho ra máu, phổi nóng.', 199000, 'A giao, Sinh địa, Ngẫu tiết.', 'Kinh Phế', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VIII'),
('2_4_0', 'prescription', 'Bài thuốc Trạch Lôi Tùy (Điều Hòa Can Phế)', 'Trị ho do tức giận (Can hỏa phạm phế).', 199000, 'Sài hồ, Bạch thược, Cát cánh.', 'Kinh Can, Kinh Phế', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VIII'),
('2_5_0', 'prescription', 'Bài thuốc Trạch Phong Đại Quá (Sơ Phong Thông Khiếu)', 'Trị viêm xoang, nghẹt mũi.', 199000, 'Tân di, Bạch chỉ, Phòng phong.', 'Kinh Phế, Mũi', 'Sắc uống và xông mũi.', 'Nam Dược Thần Hiệu - Chương VIII'),
('2_6_0', 'prescription', 'Bài thuốc Trạch Thủy Khốn (Bổ Phế Thận)', 'Trị suyễn lâu ngày, hụt hơi.', 199000, 'Ngũ vị tử, Thục địa, Nhân sâm.', 'Kinh Phế, Kinh Thận', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VIII'),
('2_7_0', 'prescription', 'Bài thuốc Trạch Sơn Hàm (Nhuận Tỳ Phế)', 'Trị khô cổ họng, ăn uống khó nuốt.', 199000, 'Sa sâm, Mạch môn, Ngọc trúc.', 'Kinh Phế, Kinh Tỳ', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương VIII'),
('2_8_0', 'prescription', 'Bài thuốc Trạch Địa Tụy (Kiện Tỳ Thông Tiện)', 'Trị táo bón do tỳ hư.', 199000, 'Bạch truật (liều cao), Đương quy.', 'Kinh Tỳ, Đại Trường', 'Sắc uống.', 'Nam Dược Thần Hiệu - Chương IV');

-- Kiểm tra số lượng bản ghi (Phải đủ 64)
SELECT COUNT(*) as total_prescriptions FROM solutions WHERE solution_type = 'prescription';
