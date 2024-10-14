# Check for required environment variables
: "${GIT_USER_EMAIL:?Need to set GIT_USER_EMAIL}"
: "${GIT_USER_NAME:?Need to set GIT_USER_NAME}"

# Git config
chmod 600 /root/.ssh/id_rsa_bb
eval $(ssh-agent -s)
ssh-add /root/.ssh/id_rsa_bb

git config --global --add safe.directory /workspaces

git config --global user.email "$GIT_USER_EMAIL" && 
git config --global user.name "$GIT_USER_NAME"

# Angular config
chmod -R 775 /usr/src/app
chown -R root:root /usr/src/app

rm -rf node_modules pnpm-lock.yaml package-lock.json

pnpm install "$NODE_PROJECT_PATH" || { echo "pnpm install failed"; exit 1; }