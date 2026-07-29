FROM rust:1.79-bookworm

# Node.js + bun (for Express + solc)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g bun

# cargo-contract (ink!)
RUN cargo install cargo-contract --locked

# Solana CLI + Anchor (via avm) — versions may need adjustment to match your
# target toolchain; not build/run-tested in this environment (no Docker
# daemon available), verify manually once deployed.
RUN sh -c "$(curl -sSfL https://release.solana.com/stable/install)" \
    && cargo install --git https://github.com/coral-xyz/anchor avm --locked --force \
    && ~/.cargo/bin/avm install latest \
    && ~/.cargo/bin/avm use latest

ENV PATH="/root/.local/share/solana/install/active_release/bin:/root/.cargo/bin:${PATH}"

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --production
COPY verification-service ./verification-service

ENV PORT=4100
EXPOSE 4100
CMD ["bun", "verification-service/index.js"]
