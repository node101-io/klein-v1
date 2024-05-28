module.exports = (docker_compose_content, dockerfile_content) => `
  mkdir -p klein-node
  cd klein-node
  cat > docker-compose.yaml << EOF
  ${docker_compose_content}
  EOF
  cat > Dockerfile << EOF
  ${dockerfile_content}
  EOF
  docker compose up -d
`;