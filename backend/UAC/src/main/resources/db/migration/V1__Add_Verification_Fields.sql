-- Add verification fields and initialize existing users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expiry TIMESTAMP;

-- Mark existing users as verified and enabled to avoid blocking them
UPDATE users 
SET is_verified = TRUE, 
    is_enabled = TRUE 
WHERE is_verified IS FALSE OR is_verified IS NULL;
