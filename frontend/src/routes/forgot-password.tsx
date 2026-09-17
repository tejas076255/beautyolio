import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: ForgotPasswordPage,
});

const resetPasswordFn = createServerFn({ method: "POST" })
  .validator((data: { phone: string; name: string; newPassword: string }) => data)
  .handler(async ({ data }) => {
    const { resetPasswordWithoutOtp } = await import("@/data/auth/password-reset.server");
    return resetPasswordWithoutOtp(data);
  });

const forgotPasswordSchema = z
  .object({
    phone: z
      .string()
      .min(10, "Enter a valid 10-digit phone number")
      .regex(/^[0-9+\s\-()]+$/, "Enter a valid phone number"),
    name: z.string().min(2, "Enter your registered full name"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      phone: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setFormError(null);
    try {
      const res = await resetPasswordFn({
        data: {
          phone: values.phone,
          name: values.name,
          newPassword: values.password,
        },
      });
      if (res?.success) {
        toast.success("Password updated successfully!");
        setSuccess(true);
        setTimeout(() => {
          navigate({ to: "/login" });
        }, 2000);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to reset password. Please verify your details.";
      setFormError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-sm shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your registered mobile number and name to set a new password instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Password updated successfully!
              </p>
              <p className="text-xs text-muted-foreground">
                Redirecting you to sign in…
              </p>
              <Button variant="hero" asChild className="w-full">
                <Link to="/login">Sign in now</Link>
              </Button>
            </div>
          ) : (
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registered Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="tel"
                              placeholder="e.g. 98653 21452"
                              autoComplete="tel"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Registered Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder="e.g. Priya Sharma"
                              autoComplete="name"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="At least 6 characters"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Re-enter your new password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {formError && (
                    <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
                      {formError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Updating password…" : "Reset Password"}
                  </Button>
                </form>
              </Form>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
