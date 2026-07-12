import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
} from "lucide-react";
import type { ElementType } from "react";

export interface SellerRoute {
  id: string;
  label: string;
  icon: ElementType;
  path: string;
}

/**
 * Cleaned up CRUD areas a seller needs on an e-commerce storefront.
 * Extra/redundant tabs have been removed.
 */
export const SELLER_ROUTES: SellerRoute[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/seller/dashboard" },
  { id: "products", label: "Products", icon: Package, path: "/seller/products" },
  { id: "orders", label: "Orders", icon: ShoppingCart, path: "/seller/orders" },
  { id: "settings", label: "Settings", icon: Settings, path: "/seller/settings" },
];

