# RBX Calcula PRO v2.7.4 — Publicação no GitHub Pages

Este pacote está pronto para publicação como site estático/PWA no GitHub Pages.

## Importante

Envie os arquivos extraídos para a raiz do repositório. Não envie o ZIP fechado para dentro do repositório.

A raiz do repositório deve conter:

- index.html
- styles.css
- app.js
- manifest.webmanifest
- service-worker.js
- assets/
- .nojekyll

## Passo a passo pelo navegador

1. Acesse GitHub.com e crie um novo repositório.
2. Nome recomendado: rbx-calcula
3. Deixe como Public se estiver usando GitHub Free.
4. Extraia este ZIP no seu computador.
5. Envie todos os arquivos extraídos para a raiz do repositório.
6. Vá em Settings > Pages.
7. Em Build and deployment:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /root
8. Clique em Save.
9. Aguarde alguns minutos e clique em Visit site.

URL esperada:
https://SEU_USUARIO.github.io/rbx-calcula/

## Atualizações futuras

Sempre que eu gerar uma nova versão:
1. Baixe o novo ZIP.
2. Extraia.
3. Substitua os arquivos antigos no repositório.
4. Faça commit.
5. O GitHub Pages republica automaticamente.

## PWA

O GitHub Pages usa HTTPS, então o navegador poderá reconhecer o projeto como PWA instalável.
