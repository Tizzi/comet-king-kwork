import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <Shell>
      <div className="mx-auto max-w-md border border-line bg-card p-5 sm:p-8">
        <h1 className="font-display text-4xl tracking-wide">{mode === "up" ? "Регистрация" : "Вход"}</h1>
        <p className="mt-2 text-sm text-muted">Кабинет хранит заявки. Каталог открыт и без аккаунта.</p>
        {isPending && <div className="mt-6 h-40 animate-pulse bg-paper" />}
        {!isPending && user && (
          <p className="mt-6 text-sm">
            Вы уже вошли{user.displayName ? `, ${user.displayName}` : ""}. <Link to="/account" className="text-blue">Открыть кабинет</Link>
          </p>
        )}
        {!isPending && !user && (
          <>
            <form
              className="mt-6 grid gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                setPending(true);
                setError("");
                const run = mode === "up"
                  ? authClient.signUp.email({ email, password, name, callbackURL: "/account" })
                  : authClient.signIn.email({ email, password, callbackURL: "/account" });
                void run
                  .then((result) => {
                    if (result.error) {
                      setError(result.error.message || "Не получилось");
                      setPending(false);
                      return;
                    }
                    window.location.href = "/account";
                  })
                  .catch((reason: unknown) => {
                    setError(reason instanceof Error ? reason.message : "Не получилось");
                    setPending(false);
                  });
              }}
            >
              {mode === "up" && (
                <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Имя" className="h-11 border border-line bg-paper px-3" />
              )}
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="Почта" className="h-11 border border-line bg-paper px-3" />
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} placeholder="Пароль, от 8 символов" className="h-11 border border-line bg-paper px-3" />
              {error && <p className="text-sm text-red">{error}</p>}
              <button type="submit" disabled={pending} className="h-12 bg-ink font-semibold text-paper disabled:opacity-60">
                {pending ? "Секунду…" : mode === "up" ? "Создать аккаунт" : "Войти"}
              </button>
            </form>
            <button type="button" className="mt-3 text-sm text-blue" onClick={() => setMode(mode === "up" ? "in" : "up")}>
              {mode === "up" ? "Уже есть аккаунт" : "Регистрация по почте"}
            </button>
            <div className="mt-6 grid gap-2">
              {GROK_PROVIDERS.map((provider) => (
                <button
                  key={provider.providerId}
                  type="button"
                  onClick={() => signIn(provider.providerId, { callbackURL: "/account" })}
                  className="h-11 border border-line bg-paper text-sm font-medium"
                >
                  Войти через {provider.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
