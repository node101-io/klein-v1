module.exports = _ => `
  cd klein-node &&
  docker compose logs $(docker service list --quiet --filter "name=klein-node") --tail 10 --follow
`;