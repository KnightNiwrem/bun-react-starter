import { expect, test } from "bun:test";
import { createServeOptions } from "./server";

function withPort<T>(port: string | undefined, callback: () => T): T {
  const originalPort = process.env.PORT;

  if (port === undefined) {
    delete process.env.PORT;
  } else {
    process.env.PORT = port;
  }

  try {
    return callback();
  } finally {
    if (originalPort === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = originalPort;
    }
  }
}

test("serves the React app through a single static fallback route", () => {
  const options = createServeOptions({ development: false });

  expect(Object.keys(options.routes)).toEqual(["/*"]);
  expect("fetch" in options).toBe(false);
  expect(options.development).toBe(false);
});

test("enables Bun development helpers for local source serving", () => {
  const options = createServeOptions({ development: true });

  expect(options.development).toEqual({
    hmr: true,
    console: true,
  });
});

test("uses PORT for local source serving", () => {
  withPort("4321", () => {
    expect(createServeOptions().port).toBe("4321");
  });
});

test("defaults local source serving to port 3000", () => {
  withPort(undefined, () => {
    expect(createServeOptions().port).toBe("3000");
  });
});
