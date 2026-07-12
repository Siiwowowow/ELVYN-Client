/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { loginAction } from "@/app/(authRouteGroup)/(auth)/login/_action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AppField from "../shared/form/AppField";
import AppSubmitButton from "../shared/form/AppSubmitButton";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import SocialLogin from "../shared/socialLogin/socialLogin";
import { UserRole } from "@/lib/authUtils";

interface LoginFormProps {
  redirectPath?: string;
  defaultEmail?: string;
}

const LoginForm = ({ redirectPath, defaultEmail = "" }: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      email: defaultEmail,
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;

        if (!result.success) {
          setServerError(result.message || "Login failed");
          return;
        }

        toast.success("Login successful!");
        setUser(result.user);
        router.refresh();

        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        } else {
          const userRole = result.user?.role as UserRole;
          const roleBasedRedirect = getRoleBasedRedirect(userRole);
          router.push(roleBasedRedirect);
        }
      } catch (error: any) {
        console.log(`Login failed: ${error.message}`);
        setServerError(`Login failed: ${error.message}`);
      }
    },
  });

  const getRoleBasedRedirect = (role: UserRole): string => {
    switch (role) {
      case "SUPER_ADMIN":
      case "ADMIN":
        return "/admin/dashboard";
      case "SELLER":
        return "/seller/dashboard";
      case "CUSTOMER":
        return "/dashboard";
      default:
        return "/";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen bg-white">
      {/* Left Side - Full Screen Cover Image (No overlays or text) */}
      <div className="w-1/2 hidden md:block relative h-full bg-gray-50">
        <img
          className="h-full w-full object-cover"
          src="/img/login_cover.png"
          alt="Shopping cover"
        />
      </div>

      <div className="w-full md:w-1/2 h-full flex flex-col items-center p-8 sm:p-16 overflow-y-auto custom-scrollbar bg-white">
        <div className="w-full max-w-[400px] my-auto flex flex-col gap-5">
          {/* Top Brand Logo Only (No text logo!) */}
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
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to continue your secure shopping journey.
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

          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Email address"
                hideLabel={true}
                prepend={<Mail className="w-4 h-4 text-gray-400" />}
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: loginZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="cursor-pointer"
                hideLabel={true}
                prepend={<Lock className="w-4 h-4 text-gray-400" />}
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent h-8 w-8 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          <div className="w-full flex items-center justify-between text-gray-500/80">
            <div className="flex items-center gap-2">
              <input
                className="h-4 w-4 rounded border-gray-300 text-[var(--first-color)] focus:ring-[var(--first-color)] cursor-pointer"
                type="checkbox"
                id="remember"
              />
              <label
                className="text-sm text-gray-600 cursor-pointer select-none font-medium"
                htmlFor="remember"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-semibold hover:underline text-rose-500"
            >
              Forgot password?
            </Link>
          </div>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Logging In..."
                disabled={!canSubmit}
                className="w-full h-12 rounded-xl text-white transition-all bg-[var(--first-color)] border border-[var(--first-color)] hover:bg-transparent hover:text-[var(--first-color)] font-semibold shadow-md active:scale-[0.98]"
              >
                Sign in
              </AppSubmitButton>
            )}
          </form.Subscribe>
          <SocialLogin />
        </form>

          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold hover:underline text-[var(--first-color)]"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
