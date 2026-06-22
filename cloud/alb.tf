resource "aws_lb" "main" {

  name = "jobacer-alb"

  internal = false

  load_balancer_type = "application"

  security_groups = [
    aws_security_group.alb.id
  ]

  subnets = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]
}

# Target Group - UAC
resource "aws_lb_target_group" "uac" {

  name = "uac-targets"

  port     = 8081
  protocol = "HTTP"

  target_type = "ip"

  vpc_id = aws_vpc.main.id

  health_check {

    path = "/actuator/health"

    protocol = "HTTP"

    matcher = "200"

    interval = 60
  }
}


# Target Group - Interview
resource "aws_lb_target_group" "interview" {

  name = "interview-targets"

  port     = 8080
  protocol = "HTTP"

  target_type = "ip"

  vpc_id = aws_vpc.main.id

  health_check {

    path = "/actuator/health"

    protocol = "HTTP"

    matcher = "200"

    interval = 60
  }
}

# HTTPS Certificate Retrieval
data "aws_acm_certificate" "existing_backend_cert" {
  domain   = "*.sorinnoroc.com"
  statuses = ["ISSUED"]
}

# HTTP ALB Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# HTTPS ALB Listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy = "ELBSecurityPolicy-TLS13-1-2-2021-06"

  certificate_arn   = data.aws_acm_certificate.existing_backend_cert.arn

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "404: Not Found - Invalid Path"
      status_code  = "404"
    }
  }
}

# UAC ALB Listener Rule
resource "aws_lb_listener_rule" "uac" {

  listener_arn = aws_lb_listener.https.arn

  priority = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.uac.arn
  }

  condition {
    path_pattern {
      values = ["/uac/*"]
    }
  }
}

# Interview ALB Listener Rule
resource "aws_lb_listener_rule" "interview" {

  listener_arn = aws_lb_listener.https.arn

  priority = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.interview.arn
  }

  condition {
    path_pattern {
      values = [
        "/llm/*", 
        "/admin/*/metrics/*", 
        "/interview/*",
      ]
    }
  }
}