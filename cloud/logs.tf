# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "uac_logs" {
  name              = "/ecs/uac"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "interview_logs" {
  name              = "/ecs/interview"
  retention_in_days = 7
}