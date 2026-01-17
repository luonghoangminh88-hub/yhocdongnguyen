"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Sparkles, User, MapPin, Activity } from "lucide-react"

interface ModernDiagnosisHeaderProps {
  hexagramName: string
  year: string
  month: string
  day: string
  hour: string
  minute: string
  gender?: string
  age?: string
  painLocation?: string
  userLocation?: string
}

export function ModernDiagnosisHeader({
  hexagramName,
  year,
  month,
  day,
  hour,
  minute,
  gender,
  age,
  painLocation,
  userLocation,
}: ModernDiagnosisHeaderProps) {
  const formatGender = (gender: string) => {
    if (gender === "male") return "Nam"
    if (gender === "female") return "Nữ"
    return gender
  }

  const formatPainLocation = (location: string) => {
    const translations: Record<string, string> = {
      left: "Bên trái cơ thể",
      right: "Bên phải cơ thể",
      center: "Bên trong/Nội tâm",
      whole: "Toàn thân",
      unknown: "Không rõ ràng",
    }
    return translations[location] || location
  }

  const formatLocation = (location: string) => {
    const translations: Record<string, string> = {
      hanoi: "Hà Nội",
      hochiminh: "TP. Hồ Chí Minh",
      danang: "Đà Nẵng",
      haiphong: "Hải Phòng",
      cantho: "Cần Thơ",
      halong: "Hạ Long (Quảng Ninh)",
      vungtau: "Vũng Tàu",
      nhatrang: "Nha Trang",
      dalat: "Đà Lạt",
      hue: "Huế",
      angiang: "An Giang",
      baria: "Bà Rịa - Vũng Tàu",
      baclieu: "Bạc Liêu",
      backan: "Bắc Kạn",
      bacgiang: "Bắc Giang",
      bacninh: "Bắc Ninh",
      bentre: "Bến Tre",
      binhdinh: "Bình Định",
      binhduong: "Bình Dương",
      binhphuoc: "Bình Phước",
      binhthuan: "Bình Thuận",
      camau: "Cà Mau",
      caobang: "Cao Bằng",
      daklak: "Đắk Lắk",
      daknong: "Đắk Nông",
      dienbien: "Điện Biên",
      dongnai: "Đồng Nai",
      dongthap: "Đồng Tháp",
      gialai: "Gia Lai",
      hagiang: "Hà Giang",
      hanam: "Hà Nam",
      hatinh: "Hà Tĩnh",
      haugiang: "Hậu Giang",
      hoabinh: "Hòa Bình",
      hungyen: "Hưng Yên",
      khanhhoa: "Khánh Hòa",
      kiengiang: "Kiên Giang",
      kontum: "Kon Tum",
      laichau: "Lai Châu",
      lamdong: "Lâm Đồng",
      langson: "Lạng Sơn",
      laocai: "Lào Cai",
      longan: "Long An",
      namdinh: "Nam Định",
      nghean: "Nghệ An",
      ninhbinh: "Ninh Bình",
      ninhthuan: "Ninh Thuận",
      phutho: "Phú Thọ",
      phuyen: "Phú Yên",
      quangbinh: "Quảng Bình",
      quangnam: "Quảng Nam",
      quangngai: "Quảng Ngãi",
      quangninh: "Quảng Ninh",
      quangtri: "Quảng Trị",
      soctrang: "Sóc Trăng",
      sonla: "Sơn La",
      tayninh: "Tây Ninh",
      thaibinh: "Thái Bình",
      thainguyen: "Thái Nguyên",
      thanhhoa: "Thanh Hóa",
      tiengiang: "Tiền Giang",
      travinh: "Trà Vinh",
      tuyenquang: "Tuyên Quang",
      vinhlong: "Vĩnh Long",
      vinhphuc: "Vĩnh Phúc",
      yenbai: "Yên Bái",
    }
    return translations[location] || location
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-xl border border-border/50 p-8 md:p-10">
      {/* Decorative pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
        <div className="absolute inset-0 bg-gradient-radial from-primary to-transparent" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <Badge variant="secondary" className="font-medium text-sm">
            Kết Quả Chẩn Đoán
          </Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{hexagramName}</h1>

        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Dựa trên nguyên lý <strong className="text-foreground">Mai Hoa Dịch Số</strong> của Thiệu Khang Tiết, phân
          tích quan hệ Thể-Dụng và Ngũ Hành để đánh giá tình trạng sức khỏe.
        </p>

        {(gender || age || painLocation || userLocation) && (
          <div className="flex flex-wrap gap-3 pt-3">
            {gender && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-lg border border-border/50">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Giới tính: {formatGender(gender)}</span>
              </div>
            )}
            {age && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-lg border border-border/50">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Tuổi: {age}</span>
              </div>
            )}
            {painLocation && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-lg border border-border/50">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Vị trí đau: {formatPainLocation(painLocation)}
                </span>
              </div>
            )}
            {userLocation && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-lg border border-border/50">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Địa điểm: {formatLocation(userLocation)}</span>
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        {(year || month || day) && (
          <div className="flex flex-wrap gap-4 pt-3 text-sm text-muted-foreground">
            {(year || month || day) && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {year && `${year}/`}
                  {month && `${month.padStart(2, "0")}/`}
                  {day && day.padStart(2, "0")}
                </span>
              </div>
            )}
            {(hour || minute) && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {hour && hour.padStart(2, "0")}
                  {minute && `:${minute.padStart(2, "0")}`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
