/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

// Helper to append cookies for authenticated server calls
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

// 1. Fetch Categories
export async function getAllCategoriesService() {
  try {
    const res = await fetch(`${BASE_API_URL}/categories`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to fetch categories" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Fetch categories error:", error);
    return { success: false, message: error.message || "Failed to fetch categories" };
  }
}

// 2. Fetch Products
export async function getAllProductsService(query?: Record<string, string>) {
  try {
    const queryParams = new URLSearchParams(query).toString();
    const url = `${BASE_API_URL}/products${queryParams ? `?${queryParams}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to fetch products" };
    }
    return { success: true, data: data.data.data, meta: data.data.meta };
  } catch (error: any) {
    console.error("Fetch products error:", error);
    return { success: false, message: error.message || "Failed to fetch products" };
  }
}

// 3. Create Product
export async function createProductService(payload: any) {
  try {
    const res = await fetchWithAuth(`${BASE_API_URL}/products`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to create product" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Create product error:", error);
    return { success: false, message: error.message || "Failed to create product" };
  }
}

// 4. Update Product
export async function updateProductService(id: string, payload: any) {
  try {
    const res = await fetchWithAuth(`${BASE_API_URL}/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to update product" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Update product error:", error);
    return { success: false, message: error.message || "Failed to update product" };
  }
}

// 5. Delete Product
export async function deleteProductService(id: string) {
  try {
    const res = await fetchWithAuth(`${BASE_API_URL}/products/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to delete product" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Delete product error:", error);
    return { success: false, message: error.message || "Failed to delete product" };
  }
}

// 6. Create Category
export async function createCategoryService(payload: any) {
  try {
    const res = await fetchWithAuth(`${BASE_API_URL}/categories`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to create category" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Create category error:", error);
    return { success: false, message: error.message || "Failed to create category" };
  }
}

// 7. Update Category
export async function updateCategoryService(id: string, payload: any) {
  try {
    const res = await fetchWithAuth(`${BASE_API_URL}/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to update category" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Update category error:", error);
    return { success: false, message: error.message || "Failed to update category" };
  }
}

// 8. Delete Category
export async function deleteCategoryService(id: string) {
  try {
    const res = await fetchWithAuth(`${BASE_API_URL}/categories/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to delete category" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Delete category error:", error);
    return { success: false, message: error.message || "Failed to delete category" };
  }
}

// 9. Fetch Single Product
export async function getProductByIdService(id: string) {
  try {
    const res = await fetch(`${BASE_API_URL}/products/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to fetch product" };
    }
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Fetch product by ID error:", error);
    return { success: false, message: error.message || "Failed to fetch product" };
  }
}


