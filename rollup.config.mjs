import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import scss from "rollup-plugin-scss"
import json from "@rollup/plugin-json";
import alias from '@rollup/plugin-alias';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { dts } from "rollup-plugin-dts";
import image from '@rollup/plugin-image';
import path from "path";
import postcss from 'rollup-plugin-postcss'
import rollupJson from 'rollup-plugin-json'
import autoprefixer from 'autoprefixer'

import packageJson from "./package.json" assert { type: "json" };;

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    external: ['react', 'react-dom','react/jsx-runtime'],
    plugins: [
      resolve({browser: true}),
      commonjs(),
      image(),
      nodePolyfills(),
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({
        extensions: ['.scss'],
        modules: {
          generateScopedName: `[name]__[local]__[hash:base64:5]`,
        },
        autoModules: false,
      }),
      // scss({ fileName: 'bundle.css' ,outputStyle: 'compressed',autoModules: true,}),
      rollupJson(),
      json(),
      alias({
        'react': path.resolve(path.dirname('')+ './node_modules/react'),
        'react-dom': path.resolve(path.dirname('')+ './node_modules/react-dom')
      }),
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];