import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";

import babel from "rollup-plugin-babel";
import glob from "rollup-plugin-glob";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";

import config from "sapper/config/rollup.js";
import markdown from "@jackfranklin/rollup-plugin-markdown";
import sveltePreprocess from "svelte-preprocess";
import rtl from "postcss-rtl";
import pkg from "./package.json";

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
  (warning.code === "MISSING_EXPORT" &&
    /'preload'/.test(warning.message)) ||
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning);

const preprocess = sveltePreprocess({
  scss: {
    includePaths: ["src"],
  },
  postcss: {
    plugins: [rtl, require("autoprefixer")],
  },
});

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      markdown(),
      glob(),
      json(),
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
        preprocess,
      }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),

      legacy &&
        babel({
          extensions: [".js", ".mjs", ".html", ".svelte"],
          runtimeHelpers: true,
          exclude: ["node_modules/@babel/**"],
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "> 0.25%, not dead",
              },
            ],
          ],
          plugins: [
            "@babel/plugin-syntax-dynamic-import",
            [
              "@babel/plugin-transform-runtime",
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
    ],

    // suppress warnings
    // https://github.com/sveltejs/svelte-loader/issues/67#issuecomment-600311996
    // https://github.com/rollup/rollup/issues/1518#issuecomment-321875784
    onwarn: (warning, handler) => {
      if (
        warning == "(svelte plugin) Unused CSS selector" ||
        warning.code === "THIS_IS_UNDEFINED"
      )
        return;
      handler(warning);
    },
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      markdown(),
      glob(),
      json(),
      replace({
        "process.browser": false,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      svelte({
        generate: "ssr",
        dev,
        preprocess,
      }),
      resolve({
        dedupe: ["svelte"],
      }),
      commonjs(),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require("module").builtinModules ||
        Object.keys(process.binding("natives"))
    ),

    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      commonjs(),
      !dev && terser(),
    ],

    onwarn,
  },
};
