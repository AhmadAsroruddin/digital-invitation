interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // tambahkan variabel lain di sini
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
