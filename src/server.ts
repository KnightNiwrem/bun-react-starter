import index from "./index.html";

const DEFAULT_PORT = "3000";

type StaticRoute = "/*";

type StaticServeOptions = Bun.Serve.Options<undefined, StaticRoute> & {
  routes: Bun.Serve.Routes<undefined, StaticRoute>;
  development: Bun.Serve.Development;
  port: string | number;
};

type CreateServeOptionsInput = {
  development?: boolean;
  port?: string | number;
};

function resolvePort(port: string | number | undefined): string | number {
  return port === undefined || port === "" ? DEFAULT_PORT : port;
}

export function createServeOptions({
  development = process.env.NODE_ENV !== "production",
  port = process.env.PORT,
}: CreateServeOptionsInput = {}): StaticServeOptions {
  return {
    port: resolvePort(port),
    routes: {
      "/*": index,
    },
    development: development
      ? {
          hmr: true,
          console: true,
        }
      : false,
  };
}
