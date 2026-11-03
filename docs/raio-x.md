# Revisão do relatório Raio-X

Data: 3 de novembro de 2026. Escopo: portfólio pessoal de Eduardo Pires Bianchi, sem loja ou contratação nesta página. Alterações locais; publicação não realizada nesta etapa.

| Item | Alteração e verificação | Dependência externa |
| --- | --- | --- |
| 1 — Pixel | ID confirmado `1321323833385070`, arquivo compartilhado pelas seis páginas. Um PageView por documento e Contact nos links do WhatsApp, após aceitar. Biblioteca async após load. Verificados fila, cliques, duplicação, revogação e exclusão de localhost/prévias com eventos simulados. | Publicar e confirmar recebimento em Testar eventos/Pixel Helper. |
| 2 — LCP | Hero JPEG de 143.829 bytes substituído por WebP desktop (64.376 bytes) e móvel (20.278 bytes, 800 × 450). Mesmo enquadramento, preloads com prioridade alta e media queries correspondentes. Imagens e referências conferidas. | Novo PageSpeed Insights após deploy; o resultado abaixo de 2,5 s ainda não foi medido. |
| 3 — Renderização | Raleway WOFF2 local, pesos variáveis 400–700, swap e licença oficial. CSS inicial no HTML; folha completa via preload e fallback noscript. Sintaxe CSS, geração idempotente e carregamento da folha completa conferidos. Tema claro/escuro, inglês/português e viewport de 390 px conferidos no navegador. | Medição pública após deploy; regenerar CSS inicial ao alterar style.css. |
| 4 — Compartilhamento | Capa existente exposta em /og.jpg: JPEG 1200 × 630 e 71.942 bytes. Open Graph nas seis páginas, URLs absolutas e títulos das demonstrações preservados. Imagem e páginas conferidas localmente. | Depurador da Meta/WhatsApp após deploy; caches externos não foram limpos. |
| 5 — Privacidade | /privacidade/ e links nos rodapés. Responsável confirmado como pessoa física; e-mail existente. Prazo de até 12 meses para contatos encerrados aprovado pelo responsável. Aceitar, recusar e reabrir a escolha conferidos no navegador. Meta só inicia após aceitação; recusar mantém navegação/contato. | Revisar e apagar mensagens nas próprias contas, conforme a política. |
| 6 — Imagens | Entre Cenas móvel: 222.037 → 42.386 bytes. Price Cards móvel: 96.315 → 17.262 bytes. WebP qualidade 80, mesmas dimensões 390 × 844, referências atualizadas e PNGs sem uso removidos. Imagens lazy com decoding async. | Confirmar economia no relatório público após deploy. |
| 7 — Sitemap | XML com seis páginas públicas locais e URLs canônicas, incluindo os termos. robots.txt já existia e continua indicando o sitemap. XML, existência das páginas, canonicals e ausência de fragmentos/duplicatas validados. | Enviar /sitemap.xml ao Search Console após publicar. |
| 8 — Dados estruturados | Person + WebSite + ProfilePage interligados, com nome, cidade, e-mail, telefone e perfis que aparecem no site. Sem avaliações, empresa ou endereço inventados. JSON e referências validados localmente. | Rich Results Test/inspeção de URL após deploy; nenhum resultado enriquecido é garantido. |
| 9 — Google Analytics | ID confirmado `G-M36GTQ5ZQ3`. Consentimento prévio e carregamento async após load. Um page_view por documento na integração, configuração sem pageview automático e generate_lead para WhatsApp. Sem Sinais do Google/personalização de anúncios. Revogação bloqueia a medição. `node tools/check_tracking.cjs` verifica os eventos sem rede real. Escolha de consentimento versionada novamente para incluir o Google. | Confirmar recebimento no Tempo real após deploy e aceitação. Marcar generate_lead como evento principal no painel se for usado como conversão. Conferir a medição otimizada e as opções de histórico no fluxo. |
| 10 — Termos | /termos/ criado para o escopo confirmado pelo responsável: portfólio e demonstrações gratuitos, sem contratação direta. Links nos seis rodapés e sitemap atualizado. Sem inventar preço, prazo comercial, reembolso ou foro. | Revisar condições comerciais antes de habilitar contratação futura. |
| 11 — Identificação | Nome completo, Dourados/MS e e-mail profissional clicável nos seis rodapés. Responsável confirmado como pessoa física. Nenhum CPF/CNPJ foi informado ou publicado. | Ao mudar para oferta/contratação, revisar a identificação e as exigências próprias desse novo contexto. Não constitui certificação geral de conformidade jurídica. |

## Verificação final local

- As seis URLs do sitemap responderam HTTP 200. Foram conferidos os recursos locais, os endereços canônicos, Open Graph, links de privacidade/termos e carregamento único do arquivo de Analytics em cada HTML.
- `node tools/check_tracking.cjs`, verificações de sintaxe dos scripts e `git diff --check` passaram. Os testes de eventos são isolados, sem tráfego real para Google ou Meta.
- No navegador, foram conferidos os termos em tema claro a 390 px, a ausência de transbordamento horizontal nessa tela, o aviso em inglês, aceitar/recusar, persistência após recarregar e reabertura da escolha. Não houve erros de JavaScript capturados.
- Nenhuma publicação ou confirmação de recebimento nos painéis externos foi executada. LCP público, Rich Results Test, WhatsApp/Meta Debugger e Search Console continuam como verificações após deploy.

## Referências

- [Google: otimização de LCP](https://web.dev/articles/optimize-lcp)
- [Google: dados estruturados de perfil](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [ANPD: perguntas frequentes e retenção](https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes)
- [ANPD: guia de cookies](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais)
- [Google: modo de consentimento](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic)
- [Google: medição de pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [Google: eventos recomendados, incluindo generate_lead](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead)
- [Câmara: Decreto 7.962/2013 e seu escopo de contratação no comércio eletrônico](https://www2.camara.leg.br/legin/fed/decret/2013/decreto-7962-15-marco-2013-775557-publicacaooriginal-139266-pe.html)
- As fontes e a licença Raleway foram obtidas do Google Fonts e do repositório oficial google/fonts. A documentação da Meta retornou limitação de acesso (HTTP 429); o recebimento dos eventos deve ser conferido no painel da conta após a publicação.
