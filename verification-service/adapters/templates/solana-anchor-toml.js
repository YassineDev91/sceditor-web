// Reasonable-as-of-writing Anchor dependency version — may need adjusting to match
// whatever Anchor/Solana CLI toolchain version is actually installed wherever this
// service is deployed.
export const ANCHOR_TOML = `[toolchain]

[features]
seeds = false
skip-lint = false

[programs.localnet]
contract = "11111111111111111111111111111111"

[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"
`

export const PROGRAM_CARGO_TOML = `[package]
name = "contract"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "contract"

[features]
no-entrypoint = []
no-idl = []
cpi = ["no-entrypoint"]
default = []
idl-build = ["anchor-lang/idl-build"]

[dependencies]
anchor-lang = "0.30.1"
`

export const WORKSPACE_CARGO_TOML = `[workspace]
members = ["programs/*"]
resolver = "2"
`
