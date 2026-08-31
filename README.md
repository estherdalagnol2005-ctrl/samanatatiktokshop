# Sunlix

Landing page oficial da Sunlix para TikTok Shop.

## Estrutura atual

- `recovery/index.html`: documento canônico da página atual.
- `public/`: somente estilos, scripts e mídia usados pela página atual.
- `app/route.ts`: entrega o HTML com cache desativado.
- `app/api/exit-offer/`: endpoints do modal de oferta.

## Desenvolvimento

```bash
npm ci
npm run dev
```

## Produção

```bash
npm run build
npm start
```

Hospedagem: Vercel.
