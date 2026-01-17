-- Timo Payment Integration Tables
-- Create tables for Timo payment system

-- Payment Methods table: Store bank account configurations
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bank_transfer', 'ewallet', 'card')),
  provider TEXT, -- 'vietqr' for Timo
  account_number TEXT, -- Số tài khoản Timo
  account_name TEXT, -- Tên chủ tài khoản
  bank_code TEXT, -- 'VCCB' for Timo
  fee_percentage DECIMAL(5,2) DEFAULT 0,
  fee_fixed INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deposits table: Track user deposit transactions
CREATE TABLE IF NOT EXISTS deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_method_id UUID NOT NULL REFERENCES payment_methods(id),
  amount INTEGER NOT NULL,
  fee INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  payment_code TEXT NOT NULL UNIQUE, -- NAPTEN format
  transfer_content TEXT NOT NULL,
  payment_data JSONB, -- Contains qr_url, bank_code, account_number, account_name
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank Transactions table: Log parsed email transactions
CREATE TABLE IF NOT EXISTS bank_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deposit_id UUID REFERENCES deposits(id) ON DELETE SET NULL,
  transaction_id TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  content TEXT NOT NULL,
  sender_info TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE,
  parsed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'matched', 'unmatched', 'error')) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_payment_code ON deposits(payment_code);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
CREATE INDEX IF NOT EXISTS idx_deposits_created_at ON deposits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_deposit_id ON bank_transactions(deposit_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_transaction_id ON bank_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_status ON bank_transactions(status);

-- Add triggers for updated_at
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deposits_updated_at
  BEFORE UPDATE ON deposits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed Timo payment method (Update with real account info)
INSERT INTO payment_methods (
  name, 
  type, 
  provider, 
  account_number, 
  account_name, 
  bank_code,
  is_active
) VALUES (
  'Chuyển khoản Timo',
  'bank_transfer',
  'vietqr',
  '1055116973', -- TODO: Thay bằng số tài khoản Timo thật
  'NGUYEN VAN A', -- TODO: Thay bằng tên chủ tài khoản thật
  'VCCB',
  true
) ON CONFLICT DO NOTHING;

COMMENT ON TABLE payment_methods IS 'Bank account configurations for payment processing';
COMMENT ON TABLE deposits IS 'User deposit transactions via bank transfer';
COMMENT ON TABLE bank_transactions IS 'Parsed email transactions from bank notifications';
