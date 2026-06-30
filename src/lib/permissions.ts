/** Client-safe admin check — no server imports */
export function isAdminRole(role?: string | null): boolean {
  return role === "ADMIN";
}

export function isAdminEmail(email?: string | null): boolean {
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return email ? adminEmails.includes(email.toLowerCase()) : false;
}
