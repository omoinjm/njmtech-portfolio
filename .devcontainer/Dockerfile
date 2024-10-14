FROM 	mcr.microsoft.com/devcontainers/base:ubuntu

ARG USERNAME=root

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends software-properties-common

# Set the working directory
WORKDIR /usr/src/app

COPY package*.json /usr/src/app

# Set up bash history
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
    && mkdir /commandhistory \
    && touch /commandhistory/.bash_history \
    && chown -R $USERNAME /commandhistory \
    && echo "$SNIPPET" >> "/$USERNAME/.bashrc"

EXPOSE 3000
EXPOSE 3001