import type { ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router";
import styles from "./Button.module.css";

// "primary": verde, para a ação principal. "secondary": branco com borda.
type Variant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

// Botão de verdade (<button>): para enviar formulários e fazer ações.
export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[styles.button, styles[variant], className].join(" ")}
      {...props}
    />
  );
}

type LinkButtonProps = LinkProps & {
  variant?: Variant;
};

// Link com cara de botão: para levar a outra página (ex.: "Cadastrar").
export function LinkButton({
  variant = "primary",
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={[styles.button, styles[variant], className].join(" ")}
      {...props}
    />
  );
}
