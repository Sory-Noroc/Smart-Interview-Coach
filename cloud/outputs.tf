output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnets" {
  value = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]
}

output "private_subnets" {
  value = [
    aws_subnet.private_a.id,
    aws_subnet.private_b.id
  ]
}

output "db_endpoint" {
  value = aws_db_instance.postgres.address
}

output "uac_repo_url" {
  value = aws_ecr_repository.uac.repository_url
}

output "interview_repo_url" {
  value = aws_ecr_repository.interview_engine.repository_url
}

output "alb_dns" {
  value = aws_lb.main.dns_name
}

output "cloudfront_url" {
  value = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}