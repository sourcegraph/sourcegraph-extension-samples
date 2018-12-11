init:
	terraform init -upgrade

plan:
	terraform plan -var-file terraform.tfvars

apply:
	terraform apply -auto-approve -var-file terraform.tfvars

destroy:
	terraform destroy -force -var-file terraform.tfvars

output:
	terraform output -json
