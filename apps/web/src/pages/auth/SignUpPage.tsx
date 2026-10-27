import { PASSWORD_MIN_LENGTH } from "@portalivp/shared";
import { useRef } from "react";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { Button } from "../../components/Button/Button.tsx";
import { PasswordField } from "../../components/PasswordField/PasswordField.tsx";
import { TextField } from "../../components/TextField/TextField.tsx";
import { SITE_NAME } from "../../site.ts";
import type { AuthActionResult } from "./actions.ts";
import styles from "./AuthCard.module.css";
import { AuthCard } from "./AuthCard.tsx";
import { useFocusFirstError } from "./useFocusFirstError.ts";

// Tela de cadastrar (/cadastrar), a partir do cadastrar.html do protótipo.
// O envio vai para a signUpAction (actions.ts). A caixa de aceite dos Termos
// entra quando os textos ficarem prontos (decisão TL8-A, PI-33).
export function SignUpPage() {
  const result = useActionData<AuthActionResult>();
  const navigation = useNavigation();
  const sending = navigation.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);
  useFocusFirstError(formRef, result);

  return (
    <AuthCard
      title="Crie sua conta"
      subtitle={`Faça parte do ${SITE_NAME} e descubra tudo o que a sua cidade tem a oferecer.`}
    >
      <Form method="post" noValidate ref={formRef} className={styles.form}>
        <TextField
          label="Nome completo"
          name="name"
          autoComplete="name"
          placeholder="Seu nome completo"
          error={result?.fieldErrors?.name}
        />
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
          autoComplete="new-password"
          placeholder={`Mínimo de ${PASSWORD_MIN_LENGTH} caracteres`}
          error={result?.fieldErrors?.password}
        />

        {result?.formError && (
          <p className={styles.formError} role="alert">
            {result.formError}
          </p>
        )}

        <Button type="submit" className={styles.submit} disabled={sending}>
          {sending ? "Criando sua conta..." : "Criar minha conta"}
        </Button>
      </Form>

      <p className={styles.switch}>
        Já tem uma conta?{" "}
        <Link to="/entrar" className={styles.link}>
          Entrar
        </Link>
      </p>
    </AuthCard>
  );
}
