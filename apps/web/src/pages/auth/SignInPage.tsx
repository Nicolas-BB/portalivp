import { useRef } from "react";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { Button } from "../../components/Button/Button.tsx";
import { PasswordField } from "../../components/PasswordField/PasswordField.tsx";
import { TextField } from "../../components/TextField/TextField.tsx";
import type { AuthActionResult } from "./actions.ts";
import styles from "./AuthCard.module.css";
import { AuthCard } from "./AuthCard.tsx";
import { useFocusFirstError } from "./useFocusFirstError.ts";

// Tela de entrar (/entrar), a partir do entrar.html do protótipo.
// O envio vai para a signInAction (actions.ts).
export function SignInPage() {
  const result = useActionData<AuthActionResult>();
  const navigation = useNavigation();
  const sending = navigation.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, result);

  return (
    <AuthCard
      title="Bem-vindo de volta!"
      subtitle="Entre na sua conta para continuar."
    >
      {/* noValidate: os erros vêm das nossas regras (Zod), em português,
          e não dos balões do navegador. */}
      <Form method="post" noValidate ref={formRef} className={styles.form}>
        <TextField
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          error={result?.fieldErrors?.email}
        />
        <PasswordField
          label="Senha"
          name="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          error={result?.fieldErrors?.password}
        />

        {result?.formError && (
          <p className={styles.formError} role="alert">
            {result.formError}
          </p>
        )}

        <Button type="submit" className={styles.submit} disabled={sending}>
          {sending ? "Entrando..." : "Entrar"}
        </Button>
      </Form>

      <p className={styles.switch}>
        Ainda não tem uma conta?{" "}
        <Link to="/cadastrar" className={styles.link}>
          Cadastre-se
        </Link>
      </p>
    </AuthCard>
  );
}
