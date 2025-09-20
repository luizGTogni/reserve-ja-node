export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: "GUEST" | "HOST" | "ADMIN";
  created_at: Date;
  updated_at: Date;
}
