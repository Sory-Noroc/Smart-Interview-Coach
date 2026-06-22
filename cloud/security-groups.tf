# ECS SG
resource "aws_security_group" "ecs" {
  name   = "ecs-sg"
  vpc_id = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# PostgreSQL SG
resource "aws_security_group" "postgres" {
  name   = "postgres-sg"
  vpc_id = aws_vpc.main.id
}
resource "aws_vpc_security_group_ingress_rule" "postgres_from_ecs" {
  security_group_id = aws_security_group.postgres.id

  referenced_security_group_id = aws_security_group.ecs.id

  from_port = 5432
  to_port   = 5432

  ip_protocol = "tcp"
}

# ALB Security Groups
resource "aws_security_group" "alb" {
  name   = "alb-sg"
  vpc_id = aws_vpc.main.id

    ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
