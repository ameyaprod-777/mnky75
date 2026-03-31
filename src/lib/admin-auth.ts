export type AdminUser = {
  id: string;
  pwd: string;
};

const ADMIN_USERS_ENV = "ADMIN_USERS";

export function buildSessionSeed(id: string, pwd: string): string {
  return `${id}:${pwd}`;
}

function parseAdminUsers(raw: string): AdminUser[] {
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [id, ...pwdParts] = entry.split(":");
      const pwd = pwdParts.join(":");
      return {
        id: id?.trim() ?? "",
        pwd: pwd.trim(),
      };
    })
    .filter((user) => user.id.length > 0 && user.pwd.length > 0);
}

export function getAdminUsersFromEnv(): AdminUser[] {
  const raw = process.env[ADMIN_USERS_ENV] ?? "";
  return parseAdminUsers(raw);
}

export function isValidAdminCredentials(id: string, pwd: string): boolean {
  const users = getAdminUsersFromEnv();
  return users.some((u) => u.id === id && u.pwd === pwd);
}

