# Revisão técnica — Sunlix

## Implementado

- Title, description, canonical, pt-BR, robots, Open Graph e Twitter Card no HTML inicial.
- Compartilhamento: JPEG 1200 × 630 com a marca existente; favicon SVG/ICO e Apple Touch Icon 180 × 180.
- JSON-LD Organization, Person, WebSite e WebPage, só com informações existentes. Sem endereço/telefone/horários/FAQ presumidos e sem avaliações inventadas.
- sitemap.xml com a única página pública; robots.txt permite página e recursos, restringe API e painel; llms.txt documenta o conteúdo público. llms.txt não garante indexação nem uso por modelos.
- Preview recebe noindex e nenhum ID de analytics. /leads e /api têm noindex/no-store; painel continua autenticado. robots.txt não é controle de acesso.
- Todo o conteúdo textual das seções e rodapé está no HTML antes de JS. Carrosséis/menu/animações mantêm os scripts existentes.
- CSS consolidado com ordem preservada e JS minificado, URLs com hash e cache immutable. HTML pré-renderizado na publicação. Dados pessoais nunca recebem cache público.
- Fontes WOFF2 com glifos preservados; foto principal priorizada; dimensões intrínsecas; imagens secundárias lazy; vídeos de depoimentos preload none com poster do próprio vídeo; galeria pausa vídeos fora de tela.
- Uma instância de GSAP/ScrollTrigger; atualização da timeline por evento, sem loop permanente; hero legível em falha de JS/CDN. Correção anterior do footer preservada.
- CTAs mantêm o mesmo produto Kiwify; retirado fbclid/UTMs fixos de visita antiga. Somente UTMs válidos da visita atual são propagados. Nunca inserir nomes/e-mails/telefones em UTMs.
- CSV protegido contra fórmulas; payload JSON inválido tratado; timeout de armazenamento; oferta não salva lead sem cupom ou checkout com desconto configurado.

## Ações da proprietária

1. Na Vercel, adicionar `GOOGLE_ANALYTICS_ID` (Measurement ID do fluxo Web, G-...) e `MICROSOFT_CLARITY_ID` (Project ID). Refazer o deploy após alterações.
2. Definir política de privacidade e solução de consentimento (CMP). Integrar a escolha a `window.sunlixSetAnalyticsConsent(true/false)` conforme comentário em `public/analytics.js`. A CMP deve reaplicar escolhas salvas ao evento `sunlix:analytics-ready` e salvar revogação antes do callback. Sem consentimento os scripts não carregam. O checkbox de novidades do formulário NÃO é consentimento para analytics. Global Privacy Control impede ativação.
3. No GA4, desativar medição automática de interações com formulários se estiver habilitada. Validar Realtime/DebugView; `generate_lead` dispara após confirmação do backend, `click_checkout` mede saída para checkout (não uma compra). Marcar `generate_lead` como evento principal se adequado. Receita/compras exigem integração com o checkout, não foram presumidas.
4. No Clarity, manter mascaramento estrito, conferir que campos/cupom não são gravados e validar consentimento antes de tráfego real. Formulário marcado com data-clarity-mask. Código não envia contatos, nomes ou cupom aos eventos.
5. Search Console: verificar propriedade por DNS ou preencher `GOOGLE_SITE_VERIFICATION` com o content da meta tag oficial; enviar `/sitemap.xml` e inspecionar `/`. Nenhuma conta/propriedade foi criada ou vinculada. Publicar não garante quando o Google indexará.
6. Domínio atual: https://samanatatiktokshop.vercel.app. Só mudar `SITE_URL` quando domínio próprio estiver conectado. Definir redirecionamento do domínio anterior na hospedagem e atualizar Search Console/GA4.
7. Confirmar `COUPON_CODE` e/ou `DISCOUNT_CHECKOUT_URL` da Kiwify e demais variáveis do backend em `.env.example`. Não compartilhar senha/chaves no chat. Teste real de cadastro, acesso privado, exportação e uso do desconto deve ser feito pela proprietária com seus dados autorizados; nenhum lead de teste foi gravado em produção durante a revisão.

## Manutenção e validação

- Imagens informativas têm texto alternativo; ornamentos e fundos duplicados continuam decorativos (`alt=""` / `aria-hidden`). Os cinco vídeos têm título e descrição acessível, sem mudar as legendas visíveis. Os botões da galeria também referenciam a descrição de cada mídia. Descrições de cenas não são transcrições nem legendas sincronizadas: não foram inventadas falas ou datas de publicação para Schema de vídeo.
- Manter `alt` descritivo nas novas imagens e `title`/descrição nos novos vídeos da galeria. Testes cobrem mídias no HTML inicial e a criação dos 15 itens do carrossel; descrições ajudam a interpretar o conteúdo, mas não garantem posicionamento ou indexação.
- Base anterior: commit d6450c5f9592ffd4ece40a78764c36d12d89e5d2; recursos originais mantidos para recuperação. Não editar os bundles gerados.
- `npm run build` gera HTML e assets; testes verificam IDs/âncoras/recursos, metadados/Schema/HTTP, ícones/fontes, consentimento e respostas a payloads inválidos. Não dependem de dados de clientes.
- Compilação local verificada com webpack (`next build --webpack`) porque o sandbox usa node_modules por symlink; a Vercel mantém seu build normal com Turbopack.
- Reduções de arquivo não são pontuação Lighthouse. Medir Core Web Vitals em tráfego real; conferir no mobile e Safari reais antes de campanhas de volume.
- Nenhuma mudança de design, textos da oferta, preços ou identidade visual foi planejada. Compressão e agrupamento preservam fontes, cascata, mídia original e animações.
