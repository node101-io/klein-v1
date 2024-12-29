ARG GO_VERSION
FROM golang:$GO_VERSION

ARG REPO
ARG PROJECT_FOLDER
ARG VERSION
ARG DAEMON_NAME
ARG CHAIN_ID
ARG MONIKER
ARG GENESIS_FILE
ARG DAEMON_HOME
ARG ADDRBOOK
ARG PEERS
ARG SEEDS
ARG MIN_GAS_PRICE
ARG AVERAGE_GAS_PRICE
ARG DENOM
ARG SNAPSHOT

WORKDIR /root

RUN apt update && \
    apt install -y curl jq git build-essential tar wget clang pkg-config libssl-dev bsdmainutils make ncdu gcc chrony liblz4-tool htop net-tools lsof aria2 && \
    rm -rf /var/lib/apt/lists/*

ENV REPO=${REPO}
ENV PROJECT_FOLDER=${PROJECT_FOLDER}
ENV VERSION=${VERSION}
ENV DAEMON_NAME=${DAEMON_NAME}
ENV LAVA_BINARY=${DAEMON_NAME}
ENV CHAIN_ID=${CHAIN_ID}
ENV MONIKER=${MONIKER}
ENV GENESIS_FILE=${GENESIS_FILE}
ENV DAEMON_HOME=${DAEMON_HOME}
ENV ADDRBOOK=${ADDRBOOK}
ENV PEERS=${PEERS}
ENV SEEDS=${SEEDS}
ENV MIN_GAS_PRICE=${MIN_GAS_PRICE}
ENV AVERAGE_GAS_PRICE=${AVERAGE_GAS_PRICE}
ENV DENOM=${DENOM}
ENV SNAPSHOT=${SNAPSHOT}
ENV DAEMON_ALLOW_DOWNLOAD_BINARIES='true'
ENV COSMOVISOR_CUSTOM_PREUPGRADE='pre-upgrade.sh'

RUN echo "export REPO=${REPO}" >> $HOME/.bash_profile && \
    echo "export PROJECT_FOLDER=${PROJECT_FOLDER}" >> $HOME/.bash_profile && \
    echo "export VERSION=${VERSION}" >> $HOME/.bash_profile && \
    echo "export DAEMON_NAME=${DAEMON_NAME}" >> $HOME/.bash_profile && \
    echo "export LAVA_BINARY=${LAVA_BINARY}" >> $HOME/.bash_profile && \
    echo "export DAEMON_ALLOW_DOWNLOAD_BINARIES=${DAEMON_ALLOW_DOWNLOAD_BINARIES}" >> $HOME/.bash_profile && \
    echo "export CHAIN_ID=${CHAIN_ID}" >> $HOME/.bash_profile && \
    echo "export MONIKER=${MONIKER}" >> $HOME/.bash_profile && \
    echo "export GENESIS_FILE=${GENESIS_FILE}" >> $HOME/.bash_profile && \
    echo "export DAEMON_HOME=${DAEMON_HOME}" >> $HOME/.bash_profile && \
    echo "export ADDRBOOK=${ADDRBOOK}" >> $HOME/.bash_profile && \
    echo "export PEERS=${PEERS}" >> $HOME/.bash_profile && \
    echo "export SEEDS=${SEEDS}" >> $HOME/.bash_profile && \
    echo "export MIN_GAS_PRICE=${MIN_GAS_PRICE}" >> $HOME/.bash_profile && \
    echo "export AVERAGE_GAS_PRICE=${AVERAGE_GAS_PRICE}" >> $HOME/.bash_profile && \
    echo "export DENOM=${DENOM}" >> $HOME/.bash_profile

RUN git clone ${REPO} ${PROJECT_FOLDER}

WORKDIR /root/${PROJECT_FOLDER}

RUN git checkout ${VERSION}
RUN make install

WORKDIR /root

RUN ${DAEMON_NAME} config chain-id ${CHAIN_ID}
RUN ${DAEMON_NAME} config keyring-backend test
RUN ${DAEMON_NAME} config node tcp://localhost:26657
RUN ${DAEMON_NAME} init ${MONIKER} --chain-id ${CHAIN_ID}

RUN sed -i -e "s|^persistent_peers *=.*|persistent_peers = \"${PEERS}\"|" ${DAEMON_HOME}/config/config.toml && \
    sed -i -e "s|^seeds *=.*|seeds = \"${SEEDS}\"|" ${DAEMON_HOME}/config/config.toml && \
    sed -i -e "/\[rpc\]/,/^\[/ s|^laddr *=.*|laddr = \"tcp://0.0.0.0:26657\"|" ${DAEMON_HOME}/config/config.toml && \
    sed -i -e "s|^indexer *=.*|indexer = \"kv\"|" ${DAEMON_HOME}/config/config.toml && \
    sed -i -e "s|^minimum-gas-prices *=.*|minimum-gas-prices = \"${MIN_GAS_PRICE}${DENOM}\"|" ${DAEMON_HOME}/config/app.toml

RUN curl -Ls ${GENESIS_FILE} -o ${DAEMON_HOME}/config/genesis.json
RUN curl -Ls ${ADDRBOOK} -o ${DAEMON_HOME}/config/addrbook.json

RUN go install cosmossdk.io/tools/cosmovisor/cmd/cosmovisor@v1.5.0

RUN mkdir -p ${DAEMON_HOME}/cosmovisor/genesis/bin && \
    cp ${GOPATH}/bin/${DAEMON_NAME} ${DAEMON_HOME}/cosmovisor/genesis/bin && \
    touch ${DAEMON_HOME}/cosmovisor/pre-upgrade.sh

RUN cp ${DAEMON_HOME}/data/priv_validator_state.json ${DAEMON_HOME}/priv_validator_state.json.backup && \
    rm -rf ${DAEMON_HOME}/data/* && \
    mv ${DAEMON_HOME}/priv_validator_state.json.backup ${DAEMON_HOME}/data/priv_validator_state.json && \
    curl ${SNAPSHOT} | lz4 -dc - | tar -xf - -C ${DAEMON_HOME}

EXPOSE 26656 26657 1317 9090

CMD [ "cosmovisor", "run", "start" ]