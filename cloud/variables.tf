variable "aws_region" {
  default = "eu-central-1"
}

variable "project_name" {
  default = "jobacer"
}

variable "db_username" {
  default = "postgres"
}

variable "db_password" {
  sensitive = true
}

variable "admin_password" {
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  type        = string
  sensitive   = true
}

variable "mail_password" {
    type        = string
    sensitive   = true
}

variable "google_api_key" {
  type          = string
  sensitive     = true
}

variable "interview_s3_url" {
  type          = string
  sensitive     = true
}

variable "frontend_url" {
  default = "https://jobacer.sorinnoroc.com"
}