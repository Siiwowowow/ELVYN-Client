/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import AppField from "../shared/form/AppField";
import { useForm } from "@tanstack/react-form";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerAction } from "@/app/(authRouteGroup)/(auth)/register/_action";
import { registerZodSchema } from "@/zod/auth.validation";
import { Camera, X, Eye, EyeOff, User, Mail, Lock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialLogin from "../shared/socialLogin/socialLogin";
import Link from "next/link";

const RegisterForm = () => {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      setIsLoading(true);

      if (!value.name || !value.email || !value.password) {
        setServerError("Name, email and password are required");
        setIsLoading(false);
        return;
      }

      if (value.password.length < 6) {
        setServerError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("email", value.email);
        formData.append("password", value.password);
        formData.append("role", "CUSTOMER");

        if (imageFile) {
          formData.append("profilePhoto", imageFile);
        }

        if (value.phoneNumber) {
          formData.append("phoneNumber", value.phoneNumber);
        }

        const result = (await registerAction(formData)) as any;

        if (!result.success) {
          setServerError(result.message);
          toast.error(result.message);
          setIsLoading(false);
          return;
        }

        toast.success("Registration successful! Redirecting to login...");
        router.push("/login");
      } catch (err: any) {
        setServerError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen bg-white">
      {/* Left Side - Full Screen Cover Image */}
      <div className="w-1/2 hidden md:block relative h-full bg-gray-50">
        <img
          className="h-full w-full object-cover"
          src="/img/login_cover.png"
          alt="Shopping cover"
        />
      </div>

      <div className="w-full md:w-1/2 h-full flex flex-col items-center p-8 sm:p-16 overflow-y-auto custom-scrollbar bg-white">
        <div className="w-full max-w-[400px] my-auto flex flex-col gap-5">
          {/* Top Brand Logo Only */}
          <div className="flex justify-center mb-2">
            <Link href="/" className="inline-block">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm transition-all hover:scale-[1.02]">
                <img
                  src="/img/logo.svg"
                  alt="logo"
                  className="h-9 w-9 object-contain"
                />
              </div>
            </Link>
          </div>

          <div className="text-center">
            <h2 className="text-3xl text-gray-900 font-bold tracking-tight">
              Create Account
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Join BetterAuth and manage your secure account
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col gap-5 w-full"
          >

          {/* Avatar Upload Section - Centered with better spacing */}
          <div className="flex justify-center my-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative w-20 h-20 rounded-full border-2 border-dashed transition-all duration-200 flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 cursor-pointer"
                style={{ borderColor: "var(--first-color)" }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="flex flex-col items-center gap-0.5"
                    style={{ color: "var(--first-color)" }}
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-[9px] font-medium">Upload photo</span>
                  </div>
                )}
              </button>
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-md z-10 cursor-pointer"
                >
                  <X size={10} />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <form.Field
            name="name"
            validators={{ onChange: registerZodSchema.shape.name }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Full Name"
                type="text"
                placeholder="Full Name"
                hideLabel={true}
                prepend={<User className="w-4 h-4 text-gray-400" />}
                required
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{ onChange: registerZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email Address"
                type="email"
                placeholder="Email Address"
                hideLabel={true}
                prepend={<Mail className="w-4 h-4 text-gray-400" />}
                required
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: registerZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="cursor-pointer"
                hideLabel={true}
                prepend={<Lock className="w-4 h-4 text-gray-400" />}
                append={
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-transparent text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                }
                required
              />
            )}
          </form.Field>

          <form.Field name="phoneNumber">
            {(field) => (
              <AppField
                field={field}
                label="Phone Number"
                placeholder="Phone Number"
                hideLabel={true}
                prepend={<Phone className="w-4 h-4 text-gray-400" />}
              />
            )}
          </form.Field>

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-xs text-center">{serverError}</p>
            </div>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isLoading}
                pendingLabel="Creating account..."
                disabled={!canSubmit}
                className="w-full h-12 rounded-xl text-white transition-all bg-(--first-color) border border-[var(--first-color)] hover:bg-transparent hover:text-[var(--first-color)] font-semibold shadow-md active:scale-[0.98]"
              >
                Create Account
              </AppSubmitButton>
            )}
          </form.Subscribe>
          <SocialLogin />
        </form>

          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold hover:underline text-[var(--first-color)]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
