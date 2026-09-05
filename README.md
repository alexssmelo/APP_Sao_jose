# Guarda São José — App completo

Agenda, canais de rádio (voz via internet), mapa de localização e botão de
emergência para a Guarda São José, com login separado de Guarda e Administrador.
Backend real no Firebase (Realtime Database + Authentication).

## Arquivos

- `index.html` — o app inteiro (interface + lógica).
- `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png` — deixam o app
  instalável na tela inicial do Android (PWA).
- `database.rules.json` — regras de segurança do Realtime Database.

## Antes de publicar: aplique as regras de segurança

1. No [console do Firebase](https://console.firebase.google.com), abra o projeto
   `guarda-sao-jose` → **Realtime Database** → aba **Regras**.
2. Apague o conteúdo atual e cole o conteúdo de `database.rules.json`.
3. Clique em **Publicar**.

Sem isso, o banco fica em "modo de teste", que permite qualquer pessoa ler e
escrever nos dados — funciona para testar, mas não é seguro para uso real.

## Como colocar no ar (hospedagem)

Este app precisa estar em um endereço `https://` para funcionar corretamente
(o navegador bloqueia alguns recursos, como localização e microfone, em
páginas abertas direto do computador). Duas opções simples e gratuitas:

**Opção A — GitHub Pages**
1. Crie um repositório no GitHub e envie todos os arquivos desta pasta (sem
   subpastas).
2. Em Settings → Pages, ative o GitHub Pages na branch principal.
3. Acesse o link gerado (algo como `https://seunome.github.io/repositorio/`).

**Opção B — Firebase Hosting** (já que você já tem o projeto Firebase)
1. Instale o Firebase CLI: `npm install -g firebase-tools`
2. Rode `firebase login`, depois `firebase init hosting` dentro desta pasta
   (escolha o projeto `guarda-sao-jose`, pasta pública = pasta atual).
3. Rode `firebase deploy`.

## Contas de administrador

Ao criar uma conta, existe a opção "Sou administrador", que pede um código.
O código padrão está definido dentro do `index.html`, na constante:

```js
const ADMIN_CODE = "SAOJOSE-ADMIN-2026";
```

**Troque esse valor** para algo só seu antes de publicar, e compartilhe esse
código apenas com quem realmente for administrador (quem sabe o código
consegue criar uma conta de administrador).

## O que cada papel pode fazer

- **Guarda**: vê seus compromissos individuais e a escala geral, marca como
  concluído, usa rádio/mapa/emergência.
- **Administrador**: tudo isso, mais criar, editar e excluir compromissos
  (atribuindo a um guarda específico ou à escala geral) e criar novos canais
  de rádio.

## Notificações push (mesmo com o app fechado)

Isso exige upgrade do projeto para o plano **Blaze** (pede cartão de crédito
cadastrado, mas o uso normal desse app fica sempre dentro da faixa gratuita
generosa do Blaze — Cloud Functions dá 2 milhões de execuções grátis por mês).

1. No [console do Firebase](https://console.firebase.google.com), clique em
   "Fazer upgrade" (perto de "Plano Spark") e mude para o plano Blaze.
2. Vá em Configurações do projeto (ícone de engrenagem) → aba
   **Cloud Messaging** → seção "Web Push certificates" → clique em
   "Generate key pair". Copie a chave gerada.
3. Abra `index.html`, procure `const VAPID_KEY = "COLE_AQUI_A_CHAVE_VAPID";`
   e cole a chave no lugar.
4. Instale o Node.js (se não tiver) e depois o Firebase CLI:
   ```
   npm install -g firebase-tools
   firebase login
   ```
5. Pelo terminal, entre nesta pasta do projeto e rode:
   ```
   firebase deploy --only functions
   ```
   Isso publica as duas funções (`notifyNewCompromisso` e
   `notifyEmergency`) que disparam a notificação sempre que um compromisso
   novo é cadastrado ou uma emergência é acionada.
6. Suba o `index.html` e o `sw.js` atualizados para o GitHub Pages (eles
   agora pedem permissão de notificação e registram o token do aparelho).
7. Peça para cada guarda abrir o app pelo menos uma vez e aceitar a
   permissão de notificação — sem isso, o aparelho dele não recebe nada.

**Opcional, recomendado:** configure um alerta de orçamento gratuito em
Google Cloud Console → Faturamento → Orçamentos e alertas, por exemplo
"avisar por e-mail se ultrapassar R$ 5", para nunca ser surpreendido.

## Limitações conhecidas (para próximas melhorias)

- O rádio conecta os aparelhos diretamente entre si (sem servidor de mídia).
  Funciona bem até ~15-20 pessoas no mesmo canal ao mesmo tempo; para escalas
  muito grandes, distribua em mais canais.
- O botão de emergência mostra a emergência mais recente; se houver várias
  emergências simultâneas, apenas a mais nova aparece em destaque.
- Regras de segurança cobrem o essencial; se quiser reforçar ainda mais
  (por exemplo, impedir que um guarda altere o título de um compromisso ao
  marcar como concluído), dá para refinar as regras no
  `database.rules.json`.
