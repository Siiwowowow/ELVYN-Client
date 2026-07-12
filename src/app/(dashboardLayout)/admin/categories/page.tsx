/* eslint-disable react-hooks/immutability */
"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  X, 
  Tag, 
  AlertCircle,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService
} from "@/services/product.services";

interface Category {
  id: string;
  name: string;
  img: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Drawer / Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form inputs
  const [formName, setFormName] = useState("");
  const [formImage, setFormImage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const res = await getAllCategoriesService();
    if (res.success && res.data) {
      setCategories(res.data);
    } else {
      toast.error(res.message || "Failed to fetch categories list");
    }
    setIsLoading(false);
  };

  const handleEditClick = (category: Category) => {
    setEditingId(category.id);
    setFormName(category.name);
    setFormImage(category.img || "");
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      toast.error("File is too large! Maximum limit is 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormImage(base64String);
      toast.success("Icon processed successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormImage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      toast.warning("Please enter a category name.");
      return;
    }

    const payload = {
      name: formName.trim(),
      img: formImage || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png"
    };

    setIsSubmitting(true);
    let res;
    if (editingId) {
      res = await updateCategoryService(editingId, payload);
    } else {
      res = await createCategoryService(payload);
    }
    setIsSubmitting(false);

    if (res.success) {
      toast.success(editingId ? "Category updated successfully!" : "Category created successfully!");
      setIsModalOpen(false);
      setFormName("");
      setFormImage("");
      setEditingId(null);
      fetchCategories();
    } else {
      toast.error(res.message || "Failed to save category details");
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category? All products mapped under it might be affected.")) {
      const res = await deleteCategoryService(id);
      if (res.success) {
        toast.success("Category deleted successfully!");
        fetchCategories();
      } else {
        toast.error(res.message || "Failed to delete category");
      }
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full animate-fade-in flex-1">
      {/* Header toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Tag className="text-emerald-600" size={24} />
            <span>Product Categories Control</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create, update, and manage product collection mappings across the store catalog.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setFormName("");
            setFormImage("");
            setIsModalOpen(true);
          }}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus size={15} className="mr-1.5" />
          Add Category
        </button>
      </div>

      {/* Stats row widget */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm max-w-sm">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Categories</div>
        <div className="text-2xl font-bold text-slate-800 mt-2">{categories.length} Collections</div>
      </div>

      {/* Search Filter input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Main Categories lists card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          {isLoading && categories.length === 0 ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
              <p className="text-sm">Fetching catalog collections...</p>
            </div>
          ) : filteredCategories.length > 0 ? (
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Collection Details</th>
                  <th className="px-6 py-4">Database reference ID</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredCategories.map((cat) => {
                  const displayImage = cat.img || "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage.png";

                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name + Icon details */}
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0 shadow-sm">
                          <img
                            src={displayImage}
                            alt={cat.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-slate-900">{cat.name}</span>
                      </td>

                      {/* Reference ID */}
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        {cat.id}
                      </td>

                      {/* CRUD action triggers */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(cat)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 border border-slate-200 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(cat.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Category"
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
              <p className="text-sm">No collections matched filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Category drawer sheet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-md font-bold text-slate-800">
                  {editingId ? "Update Collection" : "Add New Collection"}
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Collection labels group items dynamically inside catalogs.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Category Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shoes, Accessories"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Upload Section */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700">Collection Thumbnail Icon</label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center relative shrink-0">
                      {formImage ? (
                        <>
                          <img src={formImage} alt="Thumbnail preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-0.5 right-0.5 p-0.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors cursor-pointer"
                          >
                            <X size={8} />
                          </button>
                        </>
                      ) : (
                        <ImageIcon className="text-slate-400" size={20} />
                      )}
                    </div>

                    <label className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-4 text-xs font-semibold hover:bg-slate-50 cursor-pointer transition-colors">
                      Choose Icon Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Drawer footer buttons */}
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
                    <span>Save Collection</span>
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
