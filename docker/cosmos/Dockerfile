ARG GO_VERSION
FROM golang:$GO_VERSION

ARG RPC_URL
ARG CHAIN_ID
ARG PROJECT_FOLDER
ARG VERSION
ARG REPO
ARG GENESIS_FILE
ARG ADDRBOOK
ARG DENOM
ARG MIN_GAS_PRICES
ARG MONIKER
ARG DAEMON_NAME
ARG DAEMON_HOME
ARG PEERS
ARG SEEDS

WORKDIR /root

RUN apt-get update && \
    apt-get install -y curl jq git build-essential tar wget clang pkg-config libssl-dev bsdmainutils make ncdu gcc chrony liblz4-tool htop net-tools lsof aria2 && \
    rm -rf /var/lib/apt/lists/*

ENV RPC_URL=${RPC_URL}
ENV CHAIN_ID=${CHAIN_ID}
ENV PROJECT_FOLDER=${PROJECT_FOLDER}
ENV VERSION=${VERSION}
ENV REPO=${REPO}
ENV GENESIS_FILE=${GENESIS_FILE}
ENV ADDRBOOK=${ADDRBOOK}
ENV DENOM=${DENOM}
ENV MIN_GAS_PRICES=${MIN_GAS_PRICES}
ENV MONIKER=${MONIKER}
ENV DAEMON_NAME=${DAEMON_NAME}
ENV DAEMON_HOME=${DAEMON_HOME}
ENV PEERS=${PEERS}
ENV SEEDS=${SEEDS}

RUN echo "export CHAIN_ID=${CHAIN_ID}" >> $HOME/.bash_profile && \
    echo "export PROJECT_FOLDER=${PROJECT_FOLDER}" >> $HOME/.bash_profile && \
    echo "export VERSION=${VERSION}" >> $HOME/.bash_profile && \
    echo "export REPO=${REPO}" >> $HOME/.bash_profile && \
    echo "export GENESIS_FILE=${GENESIS_FILE}" >> $HOME/.bash_profile && \
    echo "export ADDRBOOK=${ADDRBOOK}" >> $HOME/.bash_profile && \
    echo "export DENOM=${DENOM}" >> $HOME/.bash_profile && \
    echo "export MIN_GAS_PRICES=${MIN_GAS_PRICES}" >> $HOME/.bash_profile && \
    echo "export MONIKER=${MONIKER}" >> $HOME/.bash_profile && \
    echo "export DAEMON_NAME=${DAEMON_NAME}" >> $HOME/.bash_profile && \
    echo "export DAEMON_HOME=${DAEMON_HOME}" >> $HOME/.bash_profile && \
    echo "export PEERS=${PEERS}" >> $HOME/.bash_profile && \
    echo "export SEEDS=${SEEDS}" >> $HOME/.bash_profile

RUN git clone ${REPO} ${PROJECT_FOLDER}

WORKDIR /root/${PROJECT_FOLDER}

RUN git checkout ${VERSION}
RUN make install

WORKDIR /root

RUN ${DAEMON_NAME} config chain-id ${CHAIN_ID}
RUN ${DAEMON_NAME} config keyring-backend test
RUN ${DAEMON_NAME} config node tcp://localhost:26657
RUN ${DAEMON_NAME} init ${MONIKER} --chain-id ${CHAIN_ID}

RUN curl -Ls ${GENESIS_FILE} -o ${DAEMON_HOME}/config/genesis.json
RUN curl -Ls ${ADDRBOOK} -o ${DAEMON_HOME}/config/addrbook.json

RUN sed -i -e "s|^persistent_peers *=.*|persistent_peers = \"$PEERS\"|" ${DAEMON_HOME}/config/config.toml && \
    sed -i -e "s|^seeds *=.*|seeds = \"$SEEDS\"|" ${DAEMON_HOME}/config/config.toml && \
    sed -i -e "s/^minimum-gas-prices *=.*/minimum-gas-prices = \"${MIN_GAS_PRICES}${DENOM}\"/" ${DAEMON_HOME}/config/app.toml

RUN go install cosmossdk.io/tools/cosmovisor/cmd/cosmovisor@v1.4.0

RUN mkdir -p ${DAEMON_HOME}/cosmovisor/genesis/bin
RUN cp ${GOPATH}/bin/${DAEMON_NAME} ${DAEMON_HOME}/cosmovisor/genesis/bin

EXPOSE 26656 26657 1317

CMD [ "cosmovisor", "run", "start" ]