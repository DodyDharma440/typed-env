## Generate your .env file to type declarations

Command

```bash
npx env-types <env-file> <file-name>
```

arg `file-name` is optional

Example command

```
npx env-types .env.local my-env
```

this command will generate file from `.env.local` to `my-env.d.ts` in main directory

Example `.env` file :

```
DB_NAME=test
DB_URL=test
```

Example content of `env.d.ts`

```tsx
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_NAME: string;
      DB_URL: string;
    }
  }
}
```

if env suggestion doesn’t appear, try add this in array of `include` property in `tsconfig.json`

```tsx
"/**/*.d.ts";
```
