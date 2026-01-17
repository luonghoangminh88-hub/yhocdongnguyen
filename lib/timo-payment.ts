/**
 * Timo Payment Integration Module
 *
 * Tích hợp thanh toán qua tài khoản Timo sử dụng VietQR
 * Bank Code: VCCB (Viet Capital Bank)
 */

// ==================== CONSTANTS ====================

/**
 * Bank code chuẩn của Timo theo VietQR
 * Timo thuộc Viet Capital Bank nên dùng mã VCCB
 */
export const TIMO_BANK_CODE = "VCCB"

/**
 * Email patterns để nhận dạng email từ Timo
 */
export const TIMO_EMAIL_PATTERNS = {
  fromEmail: "timo",
  supportEmail: "support@timo.vn",
}

// ==================== INTERFACES ====================

export interface TimoPaymentMethod {
  id: string
  name: string
  type: "bank_transfer"
  provider: "vietqr"
  bank_code: "VCCB"
  account_number: string
  account_name: string
  min_amount: number
  max_amount?: number
  fee_percentage: number
  fee_fixed: number
  is_active: boolean
}

export interface TimoPaymentData {
  qr_url: string
  bank_code: "VCCB"
  account_number: string
  account_name: string
}

export interface TimoDeposit {
  id: string
  user_id: string
  payment_method_id: string
  amount: number
  fee: number
  total_amount: number
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  payment_code: string
  transfer_content: string
  payment_data: TimoPaymentData
  created_at: string
}

// ==================== PAYMENT CODE GENERATION ====================

/**
 * Generate unique payment code for Timo transfer
 * Format: NAPTEN{First_8_Chars_UserID}{Random_4_Chars}
 *
 * @param userId - UUID của user
 * @returns Payment code (e.g., "NAPTEND43E5D42BF7G")
 *
 * @example
 * const code = generateTimoPaymentCode("d43e5d42-0137-1170-8e3f-0242ac120002")
 * // Returns: "NAPTEND43E5D42BF7G"
 */
export function generateTimoPaymentCode(userId: string): string {
  // Remove hyphens and convert to uppercase
  const cleanUserId = userId.replace(/-/g, "").toUpperCase()

  // Take first 8 characters
  const userIdShort = cleanUserId.substring(0, 8)

  // Generate 4 random characters
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()

  return `NAPTEN${userIdShort}${randomSuffix}`
}

/**
 * Generate transfer content for Timo payment
 *
 * @param paymentCode - Mã thanh toán
 * @param amount - Số tiền (VND)
 * @returns Nội dung chuyển khoản
 */
export function generateTimoTransferContent(paymentCode: string, amount: number): string {
  return `${paymentCode} ${amount.toLocaleString("vi-VN")}VND`
}

// ==================== VIETQR GENERATION ====================

/**
 * Generate VietQR URL for Timo payment
 * Uses VietQR API: https://img.vietqr.io
 *
 * @param accountNumber - Số tài khoản Timo
 * @param accountName - Tên chủ tài khoản
 * @param amount - Số tiền (VND)
 * @param paymentCode - Mã thanh toán
 * @returns URL của QR code image
 *
 * @example
 * const qrUrl = generateTimoVietQRUrl(
 *   "1055116973",
 *   "NGUYEN VAN A",
 *   100000,
 *   "NAPTEND43E5D42BF7G"
 * )
 */
export function generateTimoVietQRUrl(
  accountNumber: string,
  accountName: string,
  amount: number,
  paymentCode: string,
): string {
  const baseUrl = "https://img.vietqr.io/image"
  const bankCode = TIMO_BANK_CODE
  const template = "compact2"

  // Encode parameters for URL
  const encodedContent = encodeURIComponent(paymentCode)
  const encodedAccountName = encodeURIComponent(accountName)

  // Build QR URL
  // Format: /image/{BANK_CODE}-{ACCOUNT_NUMBER}-{TEMPLATE}.jpg
  const qrUrl = `${baseUrl}/${bankCode}-${accountNumber}-${template}.jpg?amount=${amount}&addInfo=${encodedContent}&accountName=${encodedAccountName}`

  return qrUrl
}

// ==================== FEE CALCULATION ====================

/**
 * Calculate fee for Timo payment
 *
 * @param amount - Số tiền nạp
 * @param feePercentage - Phí theo %
 * @param feeFixed - Phí cố định
 * @returns Tổng phí
 */
export function calculateTimoFee(amount: number, feePercentage = 0, feeFixed = 0): number {
  const percentageFee = (amount * feePercentage) / 100
  return percentageFee + feeFixed
}

// ==================== VALIDATION ====================

/**
 * Validate Timo payment amount for fixed-price packages
 * Only accepts: 99,000 | 199,000 | 299,000 VND
 *
 * @param amount - Số tiền cần kiểm tra
 * @returns Object chứa validation result
 */
export function validateTimoAmount(amount: number): { valid: boolean; error?: string } {
  const validAmounts = [99000, 199000, 299000]

  if (!validAmounts.includes(amount)) {
    return {
      valid: false,
      error: `Số tiền thanh toán phải là 99.000đ, 199.000đ hoặc 299.000đ`,
    }
  }

  return { valid: true }
}

/**
 * Validate payment code format
 *
 * @param paymentCode - Mã thanh toán cần kiểm tra
 * @returns true nếu format đúng
 */
export function validateTimoPaymentCode(paymentCode: string): boolean {
  // Format: NAPTEN + 8 chars + 4 chars = 18 chars total
  const pattern = /^NAPTEN[A-Z0-9]{12}$/i
  return pattern.test(paymentCode)
}

// ==================== EMAIL PARSER CONFIG ====================

/**
 * Email parser configuration for Timo bank
 * Used by auto-payment-processor to parse Timo transaction emails
 */
export const TIMO_EMAIL_PARSER_CONFIG = {
  name: "Timo",
  fromEmail: "timo",
  patterns: {
    // Match full MBVCB code or NAPTEN code
    // Example: MBVCB.12225147306.5354BFTVG2RR99AD.NAPTEND43E5D4201371170
    transactionId: /MBVCB\.\d+(?:\.[A-Z0-9]+)+|NAPTEN[A-Z0-9]+/i,

    // Match amount like "tăng 10.000 VND"
    amount: /(?:tăng|nhận|chuyển|giảm|cộng)\s+([\d.,]+)\s*VND/i,

    // Match content from "Mô tả:" until "Cảm ơn" or "Trân trọng"
    content: /Mô tả[:\s]*(.+?)(?=Cảm ơn|Trân trọng|$)/is,

    // Match sender like "CT tu 1055116973 LUONG VAN HOC"
    sender: /CT\s+tu\s+(\d+)\s+([A-Z\s]+?)(?=\s+toi|\s+tai|$)/i,
  },
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Extract user ID from payment code
 *
 * @param paymentCode - Payment code (e.g., "NAPTEND43E5D42BF7G")
 * @returns User ID prefix (first 8 chars after NAPTEN)
 */
export function extractUserIdFromPaymentCode(paymentCode: string): string | null {
  const match = paymentCode.match(/NAPTEN([A-Z0-9]{8})/i)
  return match ? match[1].toLowerCase() : null
}

/**
 * Check if deposit is expired (pending for more than 30 minutes)
 *
 * @param createdAt - ISO timestamp của deposit
 * @returns true nếu đã hết hạn
 */
export function isTimoDepositExpired(createdAt: string): boolean {
  const created = new Date(createdAt).getTime()
  const now = Date.now()
  const thirtyMinutes = 30 * 60 * 1000
  return now - created > thirtyMinutes
}

/**
 * Format Timo account number for display
 * Add spaces for readability
 *
 * @param accountNumber - Số tài khoản
 * @returns Formatted account number
 */
export function formatTimoAccountNumber(accountNumber: string): string {
  // Format: xxxx xxx xxx (every 4-3-3 digits)
  if (accountNumber.length === 10) {
    return `${accountNumber.slice(0, 4)} ${accountNumber.slice(4, 7)} ${accountNumber.slice(7)}`
  }
  return accountNumber
}

// ==================== DEPOSIT CREATION ====================

/**
 * Create Timo deposit data object
 *
 * @param params - Deposit parameters
 * @returns Complete deposit object ready to insert to DB
 */
export function createTimoDepositData(params: {
  userId: string
  paymentMethodId: string
  amount: number
  accountNumber: string
  accountName: string
  feePercentage?: number
  feeFixed?: number
}): Omit<TimoDeposit, "id" | "created_at"> {
  const { userId, paymentMethodId, amount, accountNumber, accountName, feePercentage = 0, feeFixed = 0 } = params

  // Generate payment code
  const paymentCode = generateTimoPaymentCode(userId)

  // Calculate fee
  const fee = calculateTimoFee(amount, feePercentage, feeFixed)
  const totalAmount = amount + fee

  // Generate transfer content
  const transferContent = generateTimoTransferContent(paymentCode, amount)

  // Generate QR code URL
  const qrUrl = generateTimoVietQRUrl(accountNumber, accountName, amount, paymentCode)

  // Build payment data
  const paymentData: TimoPaymentData = {
    qr_url: qrUrl,
    bank_code: TIMO_BANK_CODE,
    account_number: accountNumber,
    account_name: accountName,
  }

  return {
    user_id: userId,
    payment_method_id: paymentMethodId,
    amount,
    fee,
    total_amount: totalAmount,
    status: "pending",
    payment_code: paymentCode,
    transfer_content: transferContent,
    payment_data: paymentData,
  }
}

// ==================== EXPORTS ====================

export default {
  // Constants
  TIMO_BANK_CODE,
  TIMO_EMAIL_PATTERNS,
  TIMO_EMAIL_PARSER_CONFIG,

  // Main functions
  generateTimoPaymentCode,
  generateTimoTransferContent,
  generateTimoVietQRUrl,
  calculateTimoFee,

  // Validation
  validateTimoAmount,
  validateTimoPaymentCode,

  // Helpers
  extractUserIdFromPaymentCode,
  isTimoDepositExpired,
  formatTimoAccountNumber,

  // Deposit creation
  createTimoDepositData,
}
