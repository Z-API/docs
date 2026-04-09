# Z-API Docs

Documentacao oficial da Z-API, construida com [Mintlify](https://mintlify.com).

## Pre-requisitos

- **Node.js**: v20+ (testado com v20.20.2)
- **npm**: v10+ (testado com v10.8.2)
- **Mintlify CLI**: v4.2+ (testado com v4.2.463)

## Instalacao

```bash
# Instalar o Mintlify CLI globalmente
npm i -g mintlify
```

## Rodando localmente

```bash
# Na raiz do projeto (onde esta o docs.json)
mintlify dev
```

Acesse `http://localhost:3000` no navegador.

> Se o preview nao estiver funcionando, rode `mintlify update` para atualizar a CLI.

## Deploy

O deploy e automatico. Ao fazer push na branch `main`, o GitHub App do Mintlify detecta as mudancas e publica automaticamente. O app esta configurado no [dashboard do Mintlify](https://dashboard.mintlify.com).

## Estrutura do projeto

```
z-api-docs-oficial/
├── docs.json                # Configuracao principal (tema, cores, navegacao, API)
├── gptmaker.js              # Widget de chatbot GPT Maker (balao flutuante)
├── favicon.png              # Favicon do site
├── images/                  # Imagens usadas nas paginas
├── snippets/                # Componentes reutilizaveis (MDX)
│   ├── pt/                  # Snippets em portugues
│   │   ├── params/          # ParamFields (instance-id, token, phone)
│   │   └── response/        # ResponseFields (message-response)
│   └── en/                  # Snippets em ingles (mesma estrutura)
├── en/                      # Paginas em ingles (espelha a estrutura PT)
│   ├── instance/
│   ├── message/
│   ├── ...
├── instance/                # Endpoints de instancia (PT)
├── message/                 # Endpoints de mensagens (PT)
├── mobile/                  # Endpoints mobile (PT)
├── contacts/                # Endpoints de contatos (PT)
├── chats/                   # Endpoints de chats (PT)
├── calls/                   # Endpoints de chamadas (PT)
├── group/                   # Endpoints de grupos (PT)
├── communities/             # Endpoints de comunidades (PT)
├── newsletter/              # Endpoints de newsletter (PT)
├── status/                  # Endpoints de status (PT)
├── queue/                   # Endpoints de fila de mensagens (PT)
├── business/                # Endpoints WhatsApp Business (PT)
├── webhooks/                # Endpoints de webhooks (PT)
├── partner/                 # Endpoints de parceiros (PT)
├── integrators/             # Endpoints de integradores (PT)
├── metaai/                  # Endpoints Meta AI (PT)
├── broadcast/               # Lista de transmissao (PT)
├── privacy/                 # Endpoints de privacidade (PT)
├── quickstart/              # Pagina inicial / quickstart
├── security/                # Paginas de seguranca
├── tips/                    # Dicas e boas praticas
├── api-reference/           # Introducao da API Reference
└── blog/                    # Blog
```

## Idiomas

O projeto e **bilíngue** (portugues e ingles):

- **Portugues (pt-BR)**: idioma padrao, arquivos na raiz (ex: `message/send-text.mdx`)
- **Ingles (en)**: arquivos dentro de `en/` (ex: `en/message/send-text.mdx`)

**Regra importante**: toda nova pagina deve ser criada em **ambos os idiomas**.

## Configuracao da API (`docs.json`)

### Server base

```json
"api": {
  "mdx": {
    "server": "https://api.z-api.io",
    "auth": {
      "method": "key",
      "name": "Client-Token"
    }
  }
}
```

O server base e `https://api.z-api.io`. Os path parameters `instanceId` e `token` ficam **no frontmatter de cada pagina**:

```yaml
api: "POST /instances/{instanceId}/token/{token}/send-text"
```

Isso e necessario para que o playground ("Experimentar") do Mintlify substitua corretamente as variaveis na URL. Se colocar no server base, o Mintlify nao substitui.

### Autenticacao

O `Client-Token` esta configurado **globalmente** no `docs.json`. **Nao adicione** `<ParamField header="Client-Token">` nas paginas — isso causa duplicacao no playground.

## Como criar uma nova pagina de endpoint

1. Crie o arquivo `.mdx` na pasta da secao (ex: `message/novo-endpoint.mdx`)
2. Crie a versao em ingles em `en/` (ex: `en/message/novo-endpoint.mdx`)
3. Use o path completo no frontmatter:

```yaml
---
title: "Titulo da pagina"
api: "POST /instances/{instanceId}/token/{token}/novo-endpoint"
description: "Descricao do endpoint"
---
```

4. Importe os snippets de `instanceId` e `token`:

```mdx
import InstanceId from '/snippets/pt/params/instance-id.mdx'
import Token from '/snippets/pt/params/token.mdx'
```

5. Use os componentes na secao de atributos:

```mdx
## Atributos

### Obrigatorios

<InstanceId />
<Token />
```

6. Adicione a pagina no `docs.json` na navegacao (tanto PT quanto EN)

### Excecao: endpoints de Partner/Integrators

Os endpoints de **partner** e **integrators** usam paths diferentes e **nao** levam o prefixo `/instances/{instanceId}/token/{token}/`. Exemplo:

```yaml
api: "POST /instances/integrator/on-demand"
api: "GET /instances"
```

## Snippets reutilizaveis

Os snippets ficam em `snippets/{idioma}/`:

| Snippet | Caminho | Uso |
|---------|---------|-----|
| Instance ID | `snippets/pt/params/instance-id.mdx` | `<InstanceId />` |
| Token | `snippets/pt/params/token.mdx` | `<Token />` |
| Phone | `snippets/pt/params/phone.mdx` | `<Phone />` |
| Message Response | `snippets/pt/response/message-response.mdx` | `<MessageResponse />` |

Para ingles, troque `pt` por `en` no import.

## Widget GPT Maker

O chatbot da GPT Maker esta integrado via `gptmaker.js` na raiz do projeto. O Mintlify carrega automaticamente qualquer arquivo `.js` do diretorio.

Para trocar o widget, edite o ID no arquivo `gptmaker.js`:

```js
script.src = 'https://app.gptmaker.ai/widget/{SEU_ID}/float.js';
```

## Cores e tema

Definidas no `docs.json`:

| Cor | Hex | Uso |
|-----|-----|-----|
| Primary | `#00B140` | Cor principal (botoes, links) |
| Light | `#00D455` | Variante clara |
| Dark | `#007A2C` | Variante escura |
| Background dark | `#14161f` | Fundo do dark mode |

## Links uteis

- [Documentacao do Mintlify](https://mintlify.com/docs)
- [Dashboard Mintlify](https://dashboard.mintlify.com)
- [Repositorio](https://github.com/Z-API/docs)
- [Collection Postman](https://www.postman.com/docs-z-api/z-api-s-public-workspace/collection/gwri249/z-api-collection)
