#!/bin/bash

export RPC_URL=${RPC_URL}
export CHAIN_ID=${CHAIN_ID}
export PROJECT_FOLDER=${PROJECT_FOLDER}
export VERSION=${VERSION}
export REPO=${REPO}
export GENESIS_FILE=${GENESIS_FILE}
export ADDRBOOK=${ADDRBOOK}
export DENOM=${DENOM}
export MIN_GAS_PRICES=${MIN_GAS_PRICES}
export MONIKER=${MONIKER}
export DAEMON_NAME=${DAEMON_NAME}
export DAEMON_HOME=${DAEMON_HOME}
export PEERS=${PEERS}
export SEEDS=${SEEDS}
export SNAPSHOT=${SNAPSHOT}

git clone ${REPO} ${PROJECT_FOLDER}
cd ${PROJECT_FOLDER}
git checkout ${VERSION}
make install

${DAEMON_NAME} config chain-id ${CHAIN_ID}
${DAEMON_NAME} config keyring-backend test
${DAEMON_NAME} config node tcp://localhost:26657
${DAEMON_NAME} init ${MONIKER} --chain-id ${CHAIN_ID}

curl -Ls ${GENESIS_FILE} -o ${DAEMON_HOME}/config/genesis.json
curl -Ls ${ADDRBOOK} -o ${DAEMON_HOME}/config/addrbook.json

sed -i -e "s|^persistent_peers *=.*|persistent_peers = \"$PEERS\"|" ${DAEMON_HOME}/config/config.toml
sed -i -e "s|^seeds *=.*|seeds = \"$SEEDS\"|" ${DAEMON_HOME}/config/config.toml
sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"${MIN_GAS_PRICES}${DENOM}\"/" ${DAEMON_HOME}/config/app.toml

cp ${DAEMON_HOME}/data/priv_validator_state.json ${DAEMON_HOME}/priv_validator_state.json.backup
rm -rf ${DAEMON_HOME}/data/*
mv ${DAEMON_HOME}/priv_validator_state.json.backup ${DAEMON_HOME}/data/priv_validator_state.json
curl -L ${SNAPSHOT} | tar -I lz4 -xf - -C ${DAEMON_HOME}

mkdir -p ${DAEMON_HOME}/cosmovisor/genesis/bin
cp ${GOPATH}/bin/${DAEMON_NAME} ${DAEMON_HOME}/cosmovisor/genesis/bin

exec cosmovisor run start