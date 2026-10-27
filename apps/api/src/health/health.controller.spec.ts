import { Test } from "@nestjs/testing";
import { DATABASE } from "../database/database.module.js";
import { HealthController } from "./health.controller.js";

describe("HealthController", () => {
  // Um banco "de mentira": só o método execute, que o controller usa.
  const db = { execute: vi.fn() };
  let controller: HealthController;

  beforeEach(async () => {
    db.execute.mockReset();
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: DATABASE, useValue: db }],
    }).compile();

    controller = moduleRef.get(HealthController);
  });

  it("responde ok quando o banco responde", async () => {
    db.execute.mockResolvedValue({ rows: [] });

    await expect(controller.check()).resolves.toEqual({ status: "ok" });
  });

  it("falha quando o banco não responde", async () => {
    db.execute.mockRejectedValue(new Error("banco fora do ar"));

    await expect(controller.check()).rejects.toThrow("banco fora do ar");
  });
});
