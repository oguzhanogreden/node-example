# Not used after all.
resource "aws_db_instance" "default" {
  allocated_storage   = 1
  apply_immediately   = true
  engine              = "postgres"
  engine_version      = "postgres14"
  instance_class      = "db.t4g.micro"
  username            = "postgres"
  password            = "example"
  skip_final_snapshot = true
}
