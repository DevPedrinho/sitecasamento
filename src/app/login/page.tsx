"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Tab = "login" | "signup" | "admin";

const loginSchema = z.object({
  code: z.string().min(3, "Informe o código do convite"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

const signupSchema = z
  .object({
    code: z.string().min(3, "Informe o código do convite"),
    displayName: z.string().min(2, "Informe seu nome"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmPassword: z.string().min(6, "Mínimo de 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const adminSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

function LoginTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithInviteCode, signupWithInviteCode, loginAdmin } = useAuth();
  const [tab, setTab] = useState<Tab>(searchParams.get("admin") ? "admin" : "login");
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });
  const adminForm = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
  });

  async function handleLogin(data: z.infer<typeof loginSchema>) {
    setServerError("");
    setSubmitting(true);
    try {
      await loginWithInviteCode(data.code, data.password);
      router.push("/");
    } catch (err) {
      setServerError(readableAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignup(data: z.infer<typeof signupSchema>) {
    setServerError("");
    setSubmitting(true);
    try {
      await signupWithInviteCode(data.code, data.password, data.displayName);
      router.push("/");
    } catch (err) {
      setServerError(readableAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAdminLogin(data: z.infer<typeof adminSchema>) {
    setServerError("");
    setSubmitting(true);
    try {
      await loginAdmin(data.email, data.password);
      router.push("/admin");
    } catch (err) {
      setServerError(readableAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-16 sm:px-6">
      <header className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-terracotta">Área do convidado</p>
        <h1 className="mt-2 font-serif text-3xl text-ink">Entrar</h1>
      </header>

      <div className="flex rounded-full border border-ink/10 bg-white p-1 text-sm">
        <TabButton active={tab === "login"} onClick={() => setTab("login")}>
          Já tenho conta
        </TabButton>
        <TabButton active={tab === "signup"} onClick={() => setTab("signup")}>
          Primeiro acesso
        </TabButton>
        <TabButton active={tab === "admin"} onClick={() => setTab("admin")}>
          Admin
        </TabButton>
      </div>

      <Card className="p-6">
        {tab === "login" && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="flex flex-col gap-4">
            <Input
              label="Código do convite"
              placeholder="ex.: FAMILIASILVA-4F2A"
              error={loginForm.formState.errors.code?.message}
              {...loginForm.register("code")}
            />
            <Input
              label="Senha"
              type="password"
              error={loginForm.formState.errors.password?.message}
              {...loginForm.register("password")}
            />
            {serverError && <p className="text-sm text-red-700">{serverError}</p>}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        )}

        {tab === "signup" && (
          <form onSubmit={signupForm.handleSubmit(handleSignup)} className="flex flex-col gap-4">
            <p className="text-sm text-ink-soft">
              Use o código de convite que você recebeu para criar seu login.
            </p>
            <Input
              label="Código do convite"
              placeholder="ex.: FAMILIASILVA-4F2A"
              error={signupForm.formState.errors.code?.message}
              {...signupForm.register("code")}
            />
            <Input
              label="Seu nome"
              error={signupForm.formState.errors.displayName?.message}
              {...signupForm.register("displayName")}
            />
            <Input
              label="Crie uma senha"
              type="password"
              error={signupForm.formState.errors.password?.message}
              {...signupForm.register("password")}
            />
            <Input
              label="Confirme a senha"
              type="password"
              error={signupForm.formState.errors.confirmPassword?.message}
              {...signupForm.register("confirmPassword")}
            />
            {serverError && <p className="text-sm text-red-700">{serverError}</p>}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
        )}

        {tab === "admin" && (
          <form onSubmit={adminForm.handleSubmit(handleAdminLogin)} className="flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              error={adminForm.formState.errors.email?.message}
              {...adminForm.register("email")}
            />
            <Input
              label="Senha"
              type="password"
              error={adminForm.formState.errors.password?.message}
              {...adminForm.register("password")}
            />
            {serverError && <p className="text-sm text-red-700">{serverError}</p>}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Entrando..." : "Entrar como admin"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-full px-3 py-2 font-medium transition-colors",
        active ? "bg-sage text-white" : "text-ink-soft hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}

function readableAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  const message = err instanceof Error ? err.message : "";
  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "Código/e-mail ou senha incorretos.";
  }
  if (code === "auth/email-already-in-use") {
    return "Este convite já possui uma conta. Use a aba \"Já tenho conta\".";
  }
  return message || "Ocorreu um erro. Tente novamente.";
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginTabs />
    </Suspense>
  );
}
