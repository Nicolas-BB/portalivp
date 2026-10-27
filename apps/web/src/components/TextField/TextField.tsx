import { useId, type InputHTMLAttributes } from "react";
import styles from "./TextField.module.css";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  // Texto que aparece em cima do campo. Sempre obrigatório: é ele que o leitor
  // de tela lê para quem não enxerga.
  label: string;
  // Mensagem de erro, mostrada embaixo do campo em vermelho.
  error?: string;
};

// Campo de formulário com rótulo e mensagem de erro, como no protótipo.
export function TextField({ label, error, id, ...props }: TextFieldProps) {
  // Um id único liga o rótulo e a mensagem de erro ao campo (acessibilidade).
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
