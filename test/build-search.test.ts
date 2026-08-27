import { test } from "node:test";
import assert from "node:assert/strict";

type Operation = {
  op: {
    operationId: string;
  };
};

type OrderedOperations = (spec: object) => Operation[];

test("orderedOperations honors x-nav-order before preserving source order", async () => {
  const modulePath = "../scripts/build-search.mjs";
  const { orderedOperations } = await import(modulePath) as unknown as {
    orderedOperations: OrderedOperations;
  };
  const operations = orderedOperations({
    paths: {
      "/accounts": {
        get: { operationId: "listAccounts", tags: ["accounts"] },
        post: { operationId: "createAccount", tags: ["accounts"], "x-nav-order": 1 },
      },
      "/accounts/{id}": {
        delete: { operationId: "deleteAccount", tags: ["accounts"], "x-nav-order": 2 },
      },
    },
  });

  assert.deepEqual(
    operations.map(({ op }) => op.operationId),
    ["createAccount", "deleteAccount", "listAccounts"],
  );
});
