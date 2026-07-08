FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install or refresh SSH tooling used for git-over-ssh workflows.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssh-client \
  && rm -rf /var/lib/apt/lists/*
