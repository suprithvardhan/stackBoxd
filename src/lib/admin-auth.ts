"use client";

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  
  const authenticated = localStorage.getItem("admin_authenticated");
  const expiry = localStorage.getItem("admin_session_expiry");
  
  if (!authenticated || !expiry) return false;
  
  // Check if session expired
  if (Date.now() > parseInt(expiry)) {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_session_expiry");
    return false;
  }
  
  return authenticated === "true";
}

export function logoutAdmin(): void {
  localStorage.removeItem("admin_authenticated");
  localStorage.removeItem("admin_session_expiry");
}
