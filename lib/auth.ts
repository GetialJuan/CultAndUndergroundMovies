import { hash, compare } from "bcrypt"

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

