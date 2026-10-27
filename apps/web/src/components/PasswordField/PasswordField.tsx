import { useId, useState, type InputHTMLAttributes } from "react";
import { TextField } from "../TextField/TextField.tsx";
import styles from "./PasswordField.module.css";

type PasswordFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: string;
  error?: string;
};

// Campo de senha com a caixa "Mostrar senha" embaixo (decisão TL9-A).
export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const checkboxId = useId();

  return (
    <div className={styles.wrapper}>
      <TextField type={visible ? "text" : "password"} {...props} />
      <label className={styles.toggle} htmlFor={checkboxId}>
        <input
          id={checkboxId}
          type="checkbox"
          checked={visible}
          onChange={(event) => setVisible(event.target.checked)}
        />
        Mostrar senha
      </label>
    </div>
  );
}
