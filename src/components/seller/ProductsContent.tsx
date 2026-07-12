/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
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
  Loader2
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

export default function ProductsContent() {
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

  // Fetch products whenever filters or mounting changes
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
      toast.error(res.message || "Failed to load categories from server");
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
      toast.error(res.message || "Failed to load products from server");
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
    
    // Populate form images list
    const imgs = [product.imgDefault, product.imgHover, "", ""];
    setFormImages(imgs);
    setIsModalOpen(true);
  };

  // Image upload handling (converts file to Base64 dataURL)
  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Str = reader.result as string;
        const updated = [...formImages];
        updated[index] = base64Str;
        setFormImages(updated);
      };
      reader.onerror = () => {
        toast.error("Failed to parse image file");
      };
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice === "" || formOfferPrice === "" || !formCategoryId) {
      toast.warning("Please fill out all required fields");
      return;
    }

    setIsSubmitting(true);

    const hasImages = formImages.filter(img => img !== "");
    const imgDefault = hasImages[0] || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png";
    const imgHover = hasImages[1] || imgDefault;

    const payload = {
      title: formName.trim(),
      imgDefault,
      imgHover,
      newPrice: Number(formOfferPrice),
      oldPrice: Number(formPrice),
      sizes: ["S", "M", "L", "XL"],
      colors: ["Standard"],
      description: formDescription.trim(),
      specification: formDescription.trim(),
      inStock: formInStock ? 100 : 0,
      categoryId: formCategoryId,
      isNewAdded: true
    };

    let res;
    if (editingId) {
      res = await updateProductService(editingId, payload);
    } else {
      res = await createProductService(payload);
    }

    if (res.success) {
      toast.success(editingId ? "Product updated successfully!" : "Product created successfully!");
      fetchProducts();
      setIsModalOpen(false);
      resetForm();
    } else {
      toast.error(res.message || "Failed to save product on server");
    }
    setIsSubmitting(false);
  };

  // Toggle inStock state directly from table
  const handleStockToggle = async (id: string, currentStock: number) => {
    const newStock = currentStock > 0 ? 0 : 100;
    const res = await updateProductService(id, { inStock: newStock });
    if (res.success) {
      toast.success("Stock status toggled!");
      fetchProducts();
    } else {
      toast.error(res.message || "Failed to update stock status on server");
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const res = await deleteProductService(id);
      if (res.success) {
        toast.success("Product deleted successfully!");
        fetchProducts();
      } else {
        toast.error(res.message || "Failed to delete product from server");
      }
    }
  };

  // Calculate statistics
  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.inStock > 0).length;
  const outOfStockCount = totalProducts - inStockCount;

  if (!isMounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 text-orange-600 rounded-lg">
            <Package size={22} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Products</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalProducts}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-lg">
            <Check size={22} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">In Stock</p>
            <h3 className="text-2xl font-bold text-slate-800">{inStockCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-600 rounded-lg">
            <AlertCircle size={22} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Out of Stock</p>
            <h3 className="text-2xl font-bold text-slate-800">{outOfStockCount}</h3>
          </div>
        </div>
      </div>

      {/* Main control and list section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        {/* Toolbar header */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-3 w-full md:max-w-md">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Category Dropdown Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm w-full md:w-auto cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto w-full">
          {isLoading ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-orange-500" size={32} />
              <p className="text-sm">Fetching products from server...</p>
            </div>
          ) : products.length > 0 ? (
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Product</th>
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
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="font-medium text-slate-900 line-clamp-1">
                          {product.title}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </td>

                      {/* Selling Price */}
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        ${product.newPrice}
                        {product.oldPrice > product.newPrice && (
                          <span className="text-slate-400 font-normal line-through text-xs ml-1.5">
                            ${product.oldPrice}
                          </span>
                        )}
                      </td>

                      {/* In Stock Toggle */}
                      <td className="px-6 py-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={product.inStock > 0}
                            onChange={() => handleStockToggle(product.id, product.inStock)}
                          />
                          <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-orange-500 transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center text-slate-400">
              <Package className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-sm">No products found on server matching filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              if (!isSubmitting) setIsModalOpen(false);
            }}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 transition-transform duration-300 transform">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button
                disabled={isSubmitting}
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Product Images uploads */}
              <div>
                <p className="text-sm font-semibold text-slate-700">Product Images</p>
                <p className="text-xs text-slate-400 mt-0.5 mb-2">Upload up to 4 images. Click to replace.</p>
                <div className="flex flex-wrap items-center gap-3">
                  {formImages.map((imgUrl, index) => (
                    <label 
                      key={index} 
                      htmlFor={`image${index}`}
                      className="relative block w-20 h-20 border border-dashed border-slate-300 rounded-lg overflow-hidden cursor-pointer hover:border-orange-500 transition-colors bg-slate-50 shadow-sm"
                    >
                      <input 
                        accept="image/*" 
                        type="file" 
                        id={`image${index}`} 
                        hidden 
                        disabled={isSubmitting}
                        onChange={(e) => handleImageChange(index, e)}
                      />
                      <img 
                        className="w-full h-full object-cover" 
                        src={imgUrl || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png"} 
                        alt={`Upload Slot ${index + 1}`} 
                      />
                      {imgUrl && !isSubmitting && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const updated = [...formImages];
                            updated[index] = "";
                            setFormImages(updated);
                          }}
                          className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="product-name">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="product-name"
                  type="text"
                  placeholder="e.g. Nike Pegasus 41 shoes"
                  value={formName}
                  disabled={isSubmitting}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-60"
                  required
                />
              </div>

              {/* Product Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="product-description">
                  Product Description
                </label>
                <textarea
                  id="product-description"
                  rows={4}
                  placeholder="Describe your product..."
                  value={formDescription}
                  disabled={isSubmitting}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500 transition-colors resize-none disabled:opacity-60"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="category">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  id="category"
                  value={formCategoryId}
                  disabled={isSubmitting}
                  onChange={(e) => setFormCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="product-price">
                    Original Price ($) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="product-price"
                    type="number"
                    placeholder="0"
                    min={0}
                    value={formPrice}
                    disabled={isSubmitting}
                    onChange={(e) => setFormPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-60"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="offer-price">
                    Offer Price ($) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="offer-price"
                    type="number"
                    placeholder="0"
                    min={0}
                    value={formOfferPrice}
                    disabled={isSubmitting}
                    onChange={(e) => setFormOfferPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              {/* Direct In Stock Toggle */}
              <div className="flex items-center justify-between py-2 border-t border-b border-slate-100">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Immediate Availability</p>
                  <p className="text-xs text-slate-400">Specify whether the product starts as In Stock.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formInStock}
                    disabled={isSubmitting}
                    onChange={() => setFormInStock(!formInStock)}
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-orange-500 transition-colors duration-200 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                  <span>{editingId ? "Save Changes" : "Add Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
