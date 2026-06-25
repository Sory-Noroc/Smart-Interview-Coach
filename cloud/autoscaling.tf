resource "aws_appautoscaling_target" "uac" {
  max_capacity       = 4
  min_capacity       = 2

  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.uac.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_target" "interview" {
  max_capacity       = 4
  min_capacity       = 2

  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.interview.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "uac_cpu" {
  name               = "uac-cpu-scaling"

  policy_type        = "TargetTrackingScaling"

  resource_id        = aws_appautoscaling_target.uac.resource_id

  scalable_dimension = aws_appautoscaling_target.uac.scalable_dimension

  service_namespace  = aws_appautoscaling_target.uac.service_namespace

  target_tracking_scaling_policy_configuration {

    target_value = 70

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    scale_in_cooldown  = 180
    scale_out_cooldown = 180
  }
}

resource "aws_appautoscaling_policy" "interview_cpu" {

  name = "interview-cpu-scaling"

  policy_type = "TargetTrackingScaling"

  resource_id = aws_appautoscaling_target.interview.resource_id

  scalable_dimension = aws_appautoscaling_target.interview.scalable_dimension

  service_namespace = aws_appautoscaling_target.interview.service_namespace

  target_tracking_scaling_policy_configuration {

    target_value = 70

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    scale_in_cooldown  = 180
    scale_out_cooldown = 180
  }
}