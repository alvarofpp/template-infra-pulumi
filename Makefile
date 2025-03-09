# Variables
ROOT=$(shell pwd)

## Lint
DOCKER_IMAGE_LINTER=alvarofpp/linter:latest
LINT_COMMIT_TARGET_BRANCH=origin/main

# Commands
.PHONY: lint
lint:
	@docker pull ${DOCKER_IMAGE_LINTER}
	@docker run --rm -v ${ROOT}:/app ${DOCKER_IMAGE_LINTER} " \
		lint-commit ${LINT_COMMIT_TARGET_BRANCH} \
		&& lint-markdown \
		&& lint-dockerfile \
		&& lint-yaml \
		&& lint-shell-script \
		&& lint-python"

.PHONY: lint-fix
lint-fix:
	@docker pull ${DOCKER_IMAGE_LINTER}
	@docker run --rm -v ${ROOT}:/app ${DOCKER_IMAGE_LINTER} " \
		lint-python-fix"
