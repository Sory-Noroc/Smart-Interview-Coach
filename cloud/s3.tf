resource "aws_s3_bucket" "cvbucket" {
  bucket = "jobacer-cvbucket"
}

resource "aws_s3_bucket" "frontend" {
  bucket = "jobacer-frontend"
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}