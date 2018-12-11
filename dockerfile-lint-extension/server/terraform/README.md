# Deploy the Dockerfile lint server using Terraform and AWS

**Note:** SSL is not yet supported so to test this with the Sourcegraph extension, you'll need to configure the browser tab to allow loading of insecure scripts.

To deploy:

1. Copy and rename `terraform.tfvars.sample` to `terraform.tfvars`.
1. Enter all required variables.
1. Run `make init`.
1. Run `make plan`
1. Run `make apply`

Run `make output` to see the public IP and hostname of the instance.
