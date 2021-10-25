# tsc-check

This tool executes the command `yarn tsc` and filters the result respecting the `exclude` key from the `tsconfig.json` file.

## How to use

Run the following command in your project's root folder:

```bash
npx tsc-check@latest
```

## Use case

Avoid commits with TypeScript errors by using this tool with Husky.
