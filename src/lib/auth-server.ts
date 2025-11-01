import { auth } from "@/lib/auth"

export function getSession() {
  return auth()
}

