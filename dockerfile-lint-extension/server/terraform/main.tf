provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.region}"
}

# ------------------------------------------
# SECURITY GROUP
# ------------------------------------------

resource "aws_security_group" "this" {
  name        = "dockerlint-server-sg"
  description = "Allow all inbound traffic to 22 and 8080"
  vpc_id      = "${var.vpc_id}"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${var.ssh_inbound_cidr}"]
  }

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
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name = "dockerlint-server"
  }
}

# ------------------------------------------
# EC2 INSTANCE
# ------------------------------------------

resource "aws_key_pair" "this" {
  key_name   = "${var.key_name}"
  public_key = "${var.public_key}"
}

resource "aws_instance" "this" {
  ami                    = "${var.ami_id}"
  instance_type          = "${var.instance_type}"
  vpc_security_group_ids = ["${aws_security_group.this.id}"]
  subnet_id              = "${var.subnet_id}"
  key_name               = "${var.key_name}"

  user_data = "${file("resources/user-data.sh")}"

  lifecycle {
    create_before_destroy = true
  }

  tags {
    Name = "dockerlint-server"
  }
}
