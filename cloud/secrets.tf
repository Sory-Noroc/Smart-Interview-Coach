# Secrets Manager
resource "aws_secretsmanager_secret" "db_password" {
  name = "jobacer/db_password"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_secretsmanager_secret" "admin_password" {
  name = "jobacer/admin_password"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name = "jobacer/jwt_secret"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_secretsmanager_secret" "mail_password" {
  name = "jobacer/mail_password"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_secretsmanager_secret" "google_api_key" {
  name = "jobacer/google_api_key"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id = aws_secretsmanager_secret.db_password.id

  secret_string = var.db_password
}

resource "aws_secretsmanager_secret_version" "admin_password" {
  secret_id = aws_secretsmanager_secret.admin_password.id

  secret_string = var.admin_password
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id = aws_secretsmanager_secret.jwt_secret.id

  secret_string = var.jwt_secret
}

resource "aws_secretsmanager_secret_version" "mail_password" {
  secret_id = aws_secretsmanager_secret.mail_password.id

  secret_string = var.mail_password
}

resource "aws_secretsmanager_secret_version" "google_api_key" {
  secret_id = aws_secretsmanager_secret.google_api_key.id

  secret_string = var.google_api_key
}
