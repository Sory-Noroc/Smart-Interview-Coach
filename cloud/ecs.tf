# ECR
resource "aws_ecr_repository" "uac" {
  name = "uac"
}

resource "aws_ecr_repository" "interview_engine" {
  name = "interview-engine"
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "jobacer-cluster"
}

# UAC Task
resource "aws_ecs_task_definition" "uac" {
  family                   = "uac"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_execution.arn

  container_definitions = jsonencode([
    {
      name      = "uac"
      image     = "${aws_ecr_repository.uac.repository_url}:latest"
      essential = true

      portMappings = [
        {
          containerPort = 8081
          hostPort      = 8081
        }
      ]

      environment = [
        {
          name  = "DB_LINK"
          value = "jdbc:postgresql://${aws_db_instance.postgres.address}:5432/postgres"
        },
        {
          name  = "DB_USER"
          value = "postgres"
        },
        {
          name  = "MAIL_USERNAME"
          value = "pytechie02@gmail.com"
        },
        {
          name      = "JWT_SECRET"
          value = var.jwt_secret
        },
        {
          name      = "DB_PASSWORD"
          value = var.db_password
        },
        {
          name      = "MAIL_PASSWORD"
          value = var.mail_password
        },
        {
          name  = "CORS_ALLOWED_ORIGINS"
          value = var.frontend_url
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.uac_logs.name
          "awslogs-region"        = "eu-central-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# Interview ECS Task
resource "aws_ecs_task_definition" "interview" {
  family                   = "interview"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.interview_task.arn

  container_definitions = jsonencode([
    {
      name      = "interview"
      image     = "${aws_ecr_repository.interview_engine.repository_url}:latest"
      essential = true

      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]

      environment = [
        {
          name  = "DB_LINK"
          value = "jdbc:postgresql://${aws_db_instance.postgres.address}:5432/postgres"
        },
        {
          name  = "DB_USER"
          value = "postgres"
        },
        {
          name      = "JWT_SECRET"
          value = var.jwt_secret
        },
        {
          name      = "DB_PASSWORD"
          value = var.db_password
        },
        {
            name = "INTERVIEW_S3_URL"
            value = var.interview_s3_url
        },
        {
            name = "GOOGLE_API_KEY"
            value = var.google_api_key
        },
        {
          name  = "CORS_ALLOWED_ORIGINS"
          value = var.frontend_url
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.interview_logs.name
          "awslogs-region"        = "eu-central-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# ECS UAC Service
resource "aws_ecs_service" "uac" {
  name    = "uac"
  cluster = aws_ecs_cluster.main.id

  task_definition = aws_ecs_task_definition.uac.arn

  desired_count = 1

  launch_type = "FARGATE"

  network_configuration {
    subnets = [
      aws_subnet.private_a.id,
      aws_subnet.private_b.id
    ]

    security_groups = [
      aws_security_group.ecs.id
    ]

    assign_public_ip = false
  }

  load_balancer {

    target_group_arn = aws_lb_target_group.uac.arn

    container_name = "uac"

    container_port = 8081
  }

  depends_on = [
    aws_lb_listener_rule.uac
  ]
}

# ECS Interview Service
resource "aws_ecs_service" "interview" {
  name    = "interview"
  cluster = aws_ecs_cluster.main.id

  task_definition = aws_ecs_task_definition.interview.arn

  desired_count = 1

  launch_type = "FARGATE"

  network_configuration {
    subnets = [
      aws_subnet.private_a.id,
      aws_subnet.private_b.id
    ]

    security_groups = [
      aws_security_group.ecs.id
    ]

    assign_public_ip = false
  }

  load_balancer {

    target_group_arn = aws_lb_target_group.interview.arn

    container_name = "interview"

    container_port = 8080
  }

  depends_on = [
    aws_lb_listener_rule.interview
  ]
}

# ECS to ALB
resource "aws_vpc_security_group_ingress_rule" "ecs_from_alb" {

  security_group_id = aws_security_group.ecs.id

  referenced_security_group_id = aws_security_group.alb.id

  from_port = 8080
  to_port   = 8081

  ip_protocol = "tcp"
}
