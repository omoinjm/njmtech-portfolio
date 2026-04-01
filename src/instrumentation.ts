import dns from "dns";

export async function register() {
  // Force IPv4-first DNS resolution to avoid ETIMEDOUT on networks where
  // IPv6 is unreachable (Node.js tries IPv6 before falling back to IPv4).
  dns.setDefaultResultOrder("ipv4first");
}
