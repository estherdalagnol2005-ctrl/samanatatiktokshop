# Sunlix

Landing page oficial da Sunlix para TikTok Shop.

## Estrutura atual

- `recovery/index.html`: base HTML preservada da página atual.
- `public/`: fontes de estilos, scripts e mídias; arquivos históricos permanecem sem carregamento.
- `scripts/prepare-site.mjs`: pré-renderiza os templates existentes e gera CSS/JS minificados com hash. Executado automaticamente antes de dev/build.
- `recovery/generated.html` e `public/static/`: gerados, não editar nem versionar.
- `app/route.ts`: entrega a página estática completa, com SEO no HTML inicial.
- `app/site-config.ts`: SEO, JSON-LD e IDs públicos validados.
- `app/robots.txt/`, `app/sitemap.xml/`, `app/llms.txt/`: indexação.
- `app/api/exit-offer/`: endpoints do modal de oferta.
- `app/leads/`: painel privado e exportação CSV.

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

## Verificação e configurações pendentes

```bash
npm test
npm run build
npm run test:http
```

Consulte `docs/TECHNICAL_HANDOFF.md` e `.env.example`. Não inserir segredos em código público.
