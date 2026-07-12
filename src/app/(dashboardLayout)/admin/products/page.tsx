/* eslint-disable react-hooks/immutability */
"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  X, 
  Check, 
  Package, 
  AlertCircle,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllCategoriesService,
  getAllProductsService,
  createProductService,
  updateProductService,
  deleteProductService
} from "@/services/product.services";

interface Category {
  id: string;
  name: string;
  img: string;
}

interface Product {
  id: string;
  title: string;
  imgDefault: string;
  imgHover: string;
  badge?: string;
  badgeClass?: string;
  rating: number;
  newPrice: number;
  oldPrice: number;
  sizes: string[];
  colors: string[];
  description?: string;
  specification?: string;
  inStock: number;
  isFeatured: boolean;
  isPopular: boolean;
  isNewAdded: boolean;
  categoryId: string;
  category?: Category;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formPrice, setFormPrice] = useState<number | "">("");
  const [formOfferPrice, setFormOfferPrice] = useState<number | "">("");
  const [formInStock, setFormInStock] = useState(true);
  const [formImages, setFormImages] = useState<string[]>([
    "", "", "", ""
  ]);

  // Load Categories & Products on Mount
  useEffect(() => {
    setIsMounted(true);
    fetchCategories();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    if (isMounted) {
      fetchProducts();
    }
  }, [searchTerm, categoryFilter, isMounted]);

  // Fetch Categories from Server
  const fetchCategories = async () => {
    const res = await getAllCategoriesService();
    if (res.success && res.data) {
      setCategories(res.data);
      if (res.data.length > 0) {
        setFormCategoryId(res.data[0].id);
      }
    } else {
      toast.error(res.message || "Failed to load categories");
    }
  };

  // Fetch Products from Server
  const fetchProducts = async () => {
    setIsLoading(true);
    const query: Record<string, string> = {};
    if (searchTerm.trim()) {
      query.searchTerm = searchTerm.trim();
    }
    if (categoryFilter) {
      query.category = categoryFilter;
    }

    const res = await getAllProductsService(query);
    if (res.success && res.data) {
      setProducts(res.data);
    } else {
      toast.error(res.message || "Failed to load products");
    }
    setIsLoading(false);
  };

  // Reset form helper
  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    if (categories.length > 0) {
      setFormCategoryId(categories[0].id);
    } else {
      setFormCategoryId("");
    }
    setFormPrice("");
    setFormOfferPrice("");
    setFormInStock(true);
    setFormImages(["", "", "", ""]);
    setEditingId(null);
  };

  // Open modal for editing
  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setFormName(product.title);
    setFormDescription(product.description || "");
    setFormCategoryId(product.categoryId);
    setFormPrice(product.oldPrice);
    setFormOfferPrice(product.newPrice);
    setFormInStock(product.inStock > 0);
    
    const initialImages = [
      product.imgDefault || "",
      product.imgHover || "",
      "",
      ""
    ];
    setFormImages(initialImages);
    setIsModalOpen(true);
  };

  // Handle file picker convert to Base64
  const handleImageFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File is too large! Maximum limit is 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const updated = [...formImages];
      updated[index] = base64String;
      setFormImages(updated);
      toast.success(`Image ${index + 1} processed!`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...formImages];
    updated[index] = "";
    setFormImages(updated);
  };

  // Create or Update submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      toast.warning("Please enter a product name.");
      return;
    }
    if (!formCategoryId) {
      toast.warning("Please select a category.");
      return;
    }
    if (formPrice === "" || Number(formPrice) <= 0) {
      toast.warning("Please enter a valid price.");
      return;
    }

    const defaultImg = formImages[0] || formImages.find(img => img !== "") || "";
    const hoverImg = formImages[1] || defaultImg;

    if (!defaultImg) {
      toast.warning("Please upload or provide at least one product image.");
      return;
    }

    const payload = {
      title: formName,
      description: formDescription || null,
      categoryId: formCategoryId,
      oldPrice: Number(formPrice),
      newPrice: formOfferPrice !== "" ? Number(formOfferPrice) : Number(formPrice),
      inStock: formInStock ? 100 : 0,
      imgDefault: defaultImg,
      imgHover: hoverImg,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White"],
      specification: formDescription || "Standard specification Details",
      isFeatured: false,
      isPopular: false,
      isNewAdded: true
    };

    setIsSubmitting(true);
    let result;

    if (editingId) {
      result = await updateProductService(editingId, payload);
    } else {
      result = await createProductService(payload);
    }

    setIsSubmitting(false);

    if (result.success) {
      toast.success(editingId ? "Product updated successfully!" : "Product created successfully!");
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } else {
      toast.error(result.message || "Failed to save product details");
    }
  };

  // Delete product handler
  const handleDeleteClick = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const res = await deleteProductService(productId);
      if (res.success) {
        toast.success("Product deleted successfully!");
        fetchProducts();
      } else {
        toast.error(res.message || "Failed to delete product");
      }
    }
  };

  // Toggle inStock directly in table
  const handleStockToggle = async (product: Product) => {
    const updatedStock = product.inStock > 0 ? 0 : 100;
    
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: updatedStock } : p));
    
    const res = await updateProductService(product.id, {
      title: product.title,
      categoryId: product.categoryId,
      oldPrice: product.oldPrice,
      newPrice: product.newPrice,
      imgDefault: product.imgDefault,
      imgHover: product.imgHover,
      inStock: updatedStock
    });

    if (!res.success) {
      toast.error("Failed to update stock toggle status");
      fetchProducts(); // revert
    } else {
      toast.success(`Product stock updated to: ${updatedStock > 0 ? 'In Stock' : 'Out of Stock'}`);
    }
  };

  // Stats Counters
  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.inStock > 0).length;
  const outOfStockCount = totalProducts - inStockCount;

  return (
    <div className="space-y-6 w-full animate-fade-in flex-1">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Package className="text-emerald-600" size={24} />
            <span>Product Inventory Management</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Global catalog control. Review listings, update parameters, toggle availability, and remove catalog items.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus size={15} className="mr-1.5" />
          Add Product
        </button>
      </div>

      {/* Summary dashboard widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Catalog Listings</div>
          <div className="text-2xl font-bold text-slate-800 mt-2">{totalProducts} Items</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Stock</div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{inStockCount} Items</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Out of Stock</div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{outOfStockCount} Items</div>
        </div>
      </div>

      {/* Control and search filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            type="text"
            placeholder="Search products in catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main product management list table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          {isLoading && products.length === 0 ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
              <p className="text-sm">Fetching catalog lists...</p>
            </div>
          ) : products.length > 0 ? (
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Selling Price</th>
                  <th className="px-6 py-4 text-center">In Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {products.map((product) => {
                  const displayImage = product.imgDefault || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png";

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Image + Title */}
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0 shadow-sm">
                          <img
                            src={displayImage}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate max-w-[200px]" title={product.title}>
                            {product.title}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 mt-1 truncate max-w-[120px]">
                            {product.id}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-slate-800 font-medium">
                        {product.category?.name || "Uncategorized"}
                      </td>

                      {/* Selling Price */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-semibold">${product.newPrice.toFixed(2)}</span>
                          {product.oldPrice > product.newPrice && (
                            <span className="text-[10px] text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </td>

                      {/* In Stock toggle */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleStockToggle(product)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                            product.inStock > 0
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                          }`}
                          title="Click to toggle availability"
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${product.inStock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{product.inStock > 0 ? "In Stock" : "Out of Stock"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 border border-slate-200 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit details"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-sm">No listings found matching criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Slide-over drawer modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-md font-bold text-slate-800">
                  {editingId ? "Modify Product Details" : "Add Catalog Listing"}
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Ensure all parameters match standard formatting rules.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pegs Running Shoes"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    placeholder="Provide overview details..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors resize-none h-20"
                  />
                </div>

                {/* Category & Stock Toggle Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Category</label>
                    <select
                      value={formCategoryId}
                      onChange={(e) => setFormCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Stock Availability</label>
                    <button
                      type="button"
                      onClick={() => setFormInStock(prev => !prev)}
                      className={`h-9 w-full rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        formInStock
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-250"
                      }`}
                    >
                      <Check size={14} className={formInStock ? "opacity-100" : "opacity-0"} />
                      <span>{formInStock ? "Available (In Stock)" : "Out of Stock"}</span>
                    </button>
                  </div>
                </div>

                {/* Pricing Fields Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Original Price ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="0.00"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Offer Price ($)</label>
                    <input
                      type="number"
                      placeholder="Optional discount price"
                      value={formOfferPrice}
                      onChange={(e) => setFormOfferPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Images grid picker */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700">Product Media uploads (Max 4 slots)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {formImages.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center flex-col">
                        {img ? (
                          <>
                            <img src={img} alt="Product file picker preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(i)}
                              className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                          </>
                        ) : (
                          <label className="flex flex-col items-center justify-center gap-1 cursor-pointer w-full h-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50/20 transition-all">
                            <ImageIcon size={16} />
                            <span className="text-[9px] font-semibold">Image {i + 1}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageFileChange(i, e)}
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Footer Action triggers */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 hover:bg-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Listing</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
