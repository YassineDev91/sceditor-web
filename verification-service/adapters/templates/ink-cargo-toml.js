// Reasonable-as-of-writing ink! dependency version — may need adjusting to match
// whatever ink!/cargo-contract toolchain version is actually installed wherever
// this service is deployed.
export const CARGO_TOML = `[package]
name = "contract"
version = "0.1.0"
edition = "2021"

[dependencies]
ink = { version = "5", default-features = false }

[lib]
path = "lib.rs"

[features]
default = ["std"]
std = ["ink/std"]
ink-as-dependency = []
`
