# I've left this very much in work in progress.
# This won't even run since it doesn't have a build step, but you may get an idea.

# Lambdas 
locals {
  app_name          = "energy-demo"
  object_source     = "${path.module}/../lambda.zip"
  build_package_key = "energy-demo-test"
}

resource "aws_s3_bucket" "builds" {
  bucket = "energy-demo-builds"
}

resource "aws_s3_object" "master" {
  bucket      = aws_s3_bucket.builds.id
  key         = format("%s-%s", local.build_package_key, filemd5(local.object_source))
  source      = local.object_source
  source_hash = filemd5(local.object_source)
  tags = {
    app : local.app_name
  }
}

# This is an example of how _a function_ is defined.
# I've used this to play with API Gateway integrations, which is new to me.
# That's why all API Gateway routes point to this. I realize that's not how
# serverless apps look :) 
module "dummy_lambda_function" {
  # Ideally: In hindsight, I should've stuck to lower level AWS-TF modules.
  #          This 3rd parth module feels like too much risk for the gain.

  source = "terraform-aws-modules/lambda/aws"

  function_name = "test"
  description   = "terraform test"

  handler = "lambda.handler"
  runtime = "nodejs16.x" # Setting runtime is required when building package in Docker and Lambda Layer resource.

  # See FAQ section of the module readme, specifically the point about being able to
  # add permissions and "$latest": https://github.com/terraform-aws-modules/terraform-aws-lambda/blob/9d164781174c441c724f86af5486db8fb368282c/README.md#faq 
  publish = true

  create_package = false
  s3_existing_package = {
    bucket = aws_s3_bucket.builds.id
    key    = aws_s3_object.master.id
  }

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${aws_apigatewayv2_api.example.execution_arn}/*/*/*"
    }
  }

  tags = {
    app = "energy-demo"
  }
}

# Api gateway
resource "aws_apigatewayv2_api" "example" {
  name          = format("%s-%s", local.app_name, "api")
  protocol_type = "HTTP"

  tags = {
    app = "energy-demo"
  }
}

# See note at "dummy_lambda_function".
# Using one integration from all routes to explore AWS Gateway - Lambda integrations.
resource "aws_apigatewayv2_integration" "energy-demo-lambda-integration" {
  api_id           = aws_apigatewayv2_api.example.id
  integration_type = "AWS_PROXY"

  connection_type    = "INTERNET"
  integration_method = "POST"
  integration_uri    = module.dummy_lambda_function.dummy_lambda_function_invoke_arn
}

resource "aws_apigatewayv2_route" "get_" {
  api_id    = aws_apigatewayv2_api.example.id
  route_key = "GET /"

  target = "integrations/${aws_apigatewayv2_integration.energy-demo-lambda-integration.id}"
}

resource "aws_apigatewayv2_route" "get_parks" {
  api_id    = aws_apigatewayv2_api.example.id
  route_key = "GET /parks"

  target = "integrations/${aws_apigatewayv2_integration.energy-demo-lambda-integration.id}"
}

resource "aws_apigatewayv2_route" "get_park" {
  api_id    = aws_apigatewayv2_api.example.id
  route_key = "GET /park/{parkId}"

  target = "integrations/${aws_apigatewayv2_integration.energy-demo-lambda-integration.id}"
}

resource "aws_apigatewayv2_route" "get_park_production" {
  api_id    = aws_apigatewayv2_api.example.id
  route_key = "GET /park/{parkId}/production"

  target = "integrations/${aws_apigatewayv2_integration.energy-demo-lambda-integration.id}"
}

resource "aws_apigatewayv2_route" "get_production" {
  api_id    = aws_apigatewayv2_api.example.id
  route_key = "GET /production"

  target = "integrations/${aws_apigatewayv2_integration.energy-demo-lambda-integration.id}"
}

# Add: $default? How to get a 404 message consistent with the application though?

resource "aws_apigatewayv2_stage" "example" {
  api_id      = aws_apigatewayv2_api.example.id
  name        = "Development"
  auto_deploy = true
}
