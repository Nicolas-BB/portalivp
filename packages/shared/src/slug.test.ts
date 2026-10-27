import { describe, expect, it } from "vitest";
import { toSlug } from "./slug.js";

describe("toSlug", () => {
  it("troca os espaços por hífen e usa minúsculas", () => {
    expect(toSlug("Pet Shop")).toBe("pet-shop");
  });

  it("tira os acentos e o cedilha", () => {
    expect(toSlug("Alimentação")).toBe("alimentacao");
    expect(toSlug("Saúde")).toBe("saude");
    expect(toSlug("Serviços")).toBe("servicos");
  });

  it("troca símbolos por um hífen só, sem hífen nas pontas", () => {
    expect(toSlug("  Moda & Estilo!  ")).toBe("moda-estilo");
  });
});
