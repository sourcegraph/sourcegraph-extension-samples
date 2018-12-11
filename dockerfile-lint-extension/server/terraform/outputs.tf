output "instance_ip" {
  value = "${aws_instance.this.*.public_ip}"
}

output "instance_dns" {
  value = "${aws_instance.this.*.public_dns}"
}
