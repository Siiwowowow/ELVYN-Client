/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const allCookies = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    Cookie: allCookies,
  } as Record<string, string>;

  return fetch(url, {
    ...options,
    headers,
  });
}

// Fetch Admin Dashboard Statistics
export async function getAdminDashboardStatsService() {
  try {
    const res = await fetchWithAuth(`${BASE_API_URL}/admin/dashboard-stats`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to fetch admin stats" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Fetch admin stats error:", error);
    return { success: false, message: error.message || "Failed to fetch admin stats" };
  }
}

// Get all users
export async function getAllUsersService(query?: Record<string, string>) {
  try {
    const queryParams = new URLSearchParams(query).toString();
    const url = `${BASE_API_URL}/users${queryParams ? `?${queryParams}` : ""}`;

    const res = await fetchWithAuth(url, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to fetch users" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Fetch users error:", error);
    return { success: false, message: error.message || "Failed to fetch users" };
  }
}

// Update User Role
export async function updateUserRoleService(id: string, role: string) {
  try {
    const res = await fetchWithAuth(`${BASE_API_URL}/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to update user role" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Update user role error:", error);
    return { success: false, message: error.message || "Failed to update user role" };
  }
}

// Update User Status
export async function updateUserStatusService(id: string, status: string) {
  try {
    const res = await fetchWithAuth(`${BASE_API_URL}/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to update user status" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Update user status error:", error);
    return { success: false, message: error.message || "Failed to update user status" };
  }
}

// Delete User Account
export async function deleteUserService(id: string) {
  try {
    const res = await fetchWithAuth(`${BASE_API_URL}/users/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to delete user" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Delete user error:", error);
    return { success: false, message: error.message || "Failed to delete user" };
  }
}

