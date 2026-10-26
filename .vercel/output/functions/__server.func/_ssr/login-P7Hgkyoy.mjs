import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-IWHfIGH2.mjs";
import { o as useCurrentUserState, t as Shell } from "./shell-D8MIj47c.mjs";
import { t as GROK_PROVIDERS } from "./providers-B-AR6wJz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-P7Hgkyoy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md border border-line bg-card p-5 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-wide",
				children: mode === "up" ? "Регистрация" : "Вход"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Кабинет хранит заявки. Каталог открыт и без аккаунта."
			}),
			isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-40 animate-pulse bg-paper" }),
			!isPending && user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm",
				children: [
					"Вы уже вошли",
					user.displayName ? `, ${user.displayName}` : "",
					". ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account",
						className: "text-blue",
						children: "Открыть кабинет"
					})
				]
			}),
			!isPending && !user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 grid gap-3",
					onSubmit: (event) => {
						event.preventDefault();
						setPending(true);
						setError("");
						(mode === "up" ? authClient.signUp.email({
							email,
							password,
							name,
							callbackURL: "/account"
						}) : authClient.signIn.email({
							email,
							password,
							callbackURL: "/account"
						})).then((result) => {
							if (result.error) {
								setError(result.error.message || "Не получилось");
								setPending(false);
								return;
							}
							window.location.href = "/account";
						}).catch((reason) => {
							setError(reason instanceof Error ? reason.message : "Не получилось");
							setPending(false);
						});
					},
					children: [
						mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (event) => setName(event.target.value),
							required: true,
							placeholder: "Имя",
							className: "h-11 border border-line bg-paper px-3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: email,
							onChange: (event) => setEmail(event.target.value),
							required: true,
							placeholder: "Почта",
							className: "h-11 border border-line bg-paper px-3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: password,
							onChange: (event) => setPassword(event.target.value),
							required: true,
							minLength: 8,
							placeholder: "Пароль, от 8 символов",
							className: "h-11 border border-line bg-paper px-3"
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-red",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: pending,
							className: "h-12 bg-ink font-semibold text-paper disabled:opacity-60",
							children: pending ? "Секунду…" : mode === "up" ? "Создать аккаунт" : "Войти"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-3 text-sm text-blue",
					onClick: () => setMode(mode === "up" ? "in" : "up"),
					children: mode === "up" ? "Уже есть аккаунт" : "Регистрация по почте"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-2",
					children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => signIn(provider.providerId, { callbackURL: "/account" }),
						className: "h-11 border border-line bg-paper text-sm font-medium",
						children: ["Войти через ", provider.label]
					}, provider.providerId))
				})
			] })
		]
	}) });
}
//#endregion
export { LoginPage as component };
