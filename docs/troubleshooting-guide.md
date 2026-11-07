# Troubleshooting & Diagnostic Guide — sistemaBoletinEstudiantiLAgosto

Standard operational recovery procedures for `sistemaBoletinEstudiantiLAgosto`:

- **Build / Cache Mismatch**: Clean build artifacts (`dist/`, `build/`, `.cache/`) and re-run compilation.
- **Dependency Drift**: Verify lockfile consistency and reinstall clean dependency trees.
- **Port / Resource Contention**: Inspect active process bindings and assign alternative execution ports.
