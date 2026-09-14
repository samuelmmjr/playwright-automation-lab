# Playwright Automation Lab

[![Playwright Tests](https://github.com/samuelmmjr/playwright-automation-lab/actions/workflows/playwright.yml/badge.svg)](https://github.com/samuelmmjr/playwright-automation-lab/actions/workflows/playwright.yml)

Laboratório de automação de testes desenvolvido com **Playwright + TypeScript**, com foco em práticas de Quality Engineering aplicadas a cenários de API e UI.

O projeto utiliza o **DemoQA** como aplicação sob teste e explora organização de suíte, automação cross-browser, integração contínua, sincronização baseada em estado e diagnóstico de falhas com os recursos nativos do Playwright.

---

## Objetivo

O objetivo deste projeto é praticar e demonstrar a construção de uma suíte de automação com Playwright de forma estruturada e próxima de situações encontradas em projetos reais.

O laboratório explora:

- testes de API e UI;
- TypeScript;
- Page Object Model;
- dados de teste dinâmicos;
- assertions orientadas ao comportamento;
- sincronização baseada em estado;
- execução cross-browser;
- traces, screenshots e vídeos;
- HTML Report;
- integração contínua com GitHub Actions;
- tratamento de interferências externas ao cenário automatizado.

---

## Cobertura

### API — Book Store

Fluxo completo utilizando a API do DemoQA:

1. cria um usuário;
2. gera um token de autenticação;
3. consulta o catálogo de livros;
4. seleciona ISBNs dinamicamente;
5. adiciona livros à coleção;
6. valida os livros associados ao usuário;
7. remove o usuário.

O cenário é autocontido e cria seus próprios dados durante a execução.

---

### UI — Browser Windows

Valida a abertura de uma nova aba e o conteúdo apresentado na página de destino.

Principais conceitos:

- múltiplas páginas;
- eventos de popup;
- sincronização entre evento e ação;
- validação da nova página.

---

### UI — Practice Form

Preenche e envia o formulário do DemoQA, validando posteriormente os dados apresentados no modal de confirmação.

O cenário trabalha com:

- campos de texto;
- radio buttons;
- date picker;
- autocomplete;
- checkboxes;
- componentes React Select;
- modal de confirmação.

---

### UI — Progress Bar

Valida o comportamento da barra de progresso:

1. inicia o progresso;
2. interrompe antes de 25%;
3. valida o valor interrompido;
4. retoma o progresso;
5. aguarda a conclusão em 100%;
6. executa o reset;
7. valida o retorno para 0%.

A sincronização é baseada no estado observável da aplicação.

---

### UI — Sortable

Valida a ordem inicial dos elementos apresentados no componente:

```text
One
Two
Three
Four
Five
Six
```

O cenário atual verifica a ordem padrão. Drag and drop não faz parte da cobertura implementada.

---

### UI — Web Tables

Executa um fluxo CRUD sobre a tabela:

1. cria um registro;
2. localiza o registro pelo e-mail;
3. valida os dados cadastrados;
4. edita o departamento;
5. valida a alteração;
6. exclui o registro;
7. confirma sua remoção.

O e-mail gerado dinamicamente é utilizado como identificador do registro, evitando dependência da posição das linhas na tabela.

---

## Arquitetura

```text
playwright-automation-lab/
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── tests/
│   ├── api/
│   │   └── book-store.spec.ts
│   │
│   └── ui/
│       ├── browser-windows.spec.ts
│       ├── practice-form.spec.ts
│       ├── progress-bar.spec.ts
│       ├── sortable.spec.ts
│       └── web-tables.spec.ts
│
├── pages/
│   ├── browser-windows.page.ts
│   ├── practice-form.page.ts
│   ├── progress-bar.page.ts
│   ├── sortable.page.ts
│   └── web-tables.page.ts
│
├── fixtures/
├── utils/
│   └── api-types.ts
│
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

A estrutura mantém os testes de API e UI separados e concentra abstrações de interface na camada `pages`.

---

## Decisões de engenharia

### TypeScript

O projeto utiliza TypeScript para melhorar a previsibilidade e manutenção da automação.

As principais respostas utilizadas no cenário de API possuem interfaces específicas, permitindo trabalhar com contratos tipados durante os testes.

---

### Page Object Model

Os cenários de UI utilizam Page Objects para encapsular comportamentos e interações das páginas.

O objetivo é separar responsabilidades sem criar abstrações desnecessárias para cada elemento da interface.

---

### Dados dinâmicos

Dados que precisam ser únicos são criados durante a própria execução.

Exemplo:

```ts
email: `samuel.${Date.now()}@mail.com`;
```

Isso reduz colisões entre execuções e dependência de registros previamente existentes.

---

### Sincronização baseada em estado

A suíte prioriza condições observáveis da aplicação em vez de tempos arbitrários.

São utilizados recursos nativos do Playwright, como:

```ts
expect(locator).toBeVisible();
expect(locator).toHaveAttribute();
expect.poll();
waitForEvent();
```

Essa abordagem reduz dependência de waits fixos e torna os testes menos sensíveis a variações normais de tempo de execução.

---

### Cross-browser

A suíte é executada nos três engines suportados pelo Playwright:

- Chromium;
- Firefox;
- WebKit.

Isso permite identificar diferenças de comportamento e renderização entre browsers.

A execução completa atualmente corresponde a:

```text
6 cenários × 3 browsers = 18 testes
```

---

### Aplicação externa

O DemoQA é uma aplicação pública e externa ao projeto. Isso significa que disponibilidade, publicidade, alterações de layout e outros componentes fora do controle da suíte podem afetar a execução.

No cenário de Web Tables, elementos publicitários podem interferir nas interações dependendo do ambiente de renderização.

A automação neutraliza especificamente essa interferência sem utilizar `force: true`, mantendo as ações e validações relacionadas à funcionalidade sob teste.

Esse tratamento fica restrito ao comportamento externo que interfere no cenário.

---

## Evidências e diagnóstico

O Playwright está configurado para fornecer evidências que auxiliam na investigação de falhas.

### HTML Report

Após a execução:

```bash
npx playwright show-report
```

O relatório apresenta os testes executados e seus respectivos resultados.

### Trace

Os traces permitem investigar ações, locators e o estado da aplicação durante uma execução.

Exemplo:

```bash
npx playwright show-trace caminho/para/trace.zip
```

### Screenshots e vídeos

Screenshots e vídeos também podem ser preservados conforme a configuração definida no `playwright.config.ts`, auxiliando principalmente na análise de falhas reproduzidas apenas em determinados browsers ou ambientes.

---

## Integração contínua

O projeto possui pipeline utilizando **GitHub Actions**.

A cada execução configurada no workflow, o ambiente de CI realiza o processo de instalação e validação da suíte:

```text
Checkout
    ↓
Setup Node.js
    ↓
npm ci
    ↓
Instalação dos browsers
    ↓
Validação TypeScript
    ↓
Execução dos testes
    ↓
Playwright Report
```

A suíte completa é validada em:

```text
Chromium
Firefox
WebKit
```

Isso permite validar o projeto em um ambiente independente da máquina utilizada durante o desenvolvimento.

---

## Executando o projeto

### Pré-requisitos

- Node.js
- npm

Clone o repositório:

```bash
git clone https://github.com/samuelmmjr/playwright-automation-lab.git
```

Acesse o diretório:

```bash
cd playwright-automation-lab
```

Instale as dependências:

```bash
npm ci
```

Instale os browsers utilizados pelo Playwright:

```bash
npx playwright install
```

---

## Executando os testes

### Suíte completa

```bash
npx playwright test
```

### Chromium

```bash
npx playwright test --project=chromium
```

### Firefox

```bash
npx playwright test --project=firefox
```

### WebKit

```bash
npx playwright test --project=webkit
```

### Testes de API

```bash
npx playwright test tests/api
```

### Testes de UI

```bash
npx playwright test tests/ui
```

### Cenário específico

```bash
npx playwright test tests/ui/web-tables.spec.ts
```

### Execução visual

```bash
npx playwright test --headed
```

### Playwright UI Mode

```bash
npx playwright test --ui
```

---

## Validação TypeScript

Para executar somente a validação estática:

```bash
npx tsc --noEmit
```

---

## Stack

- Playwright
- TypeScript
- Node.js
- Git
- GitHub
- GitHub Actions
- DemoQA

---

## Práticas exploradas

- API Testing
- End-to-End Testing
- Cross-browser Testing
- Page Object Model
- dados de teste dinâmicos
- assertions orientadas ao comportamento
- sincronização baseada em estado
- isolamento de cenários
- Trace Viewer
- screenshots e vídeos
- HTML Report
- Continuous Integration
- análise de diferenças entre execução local e CI

---

## Próximas evoluções

Possíveis evoluções serão priorizadas quando adicionarem novos conceitos ao laboratório, em vez de apenas aumentar a quantidade de testes.

Entre elas:

- cenários negativos de API;
- fixtures customizadas;
- autenticação e estados reutilizáveis;
- cenários combinando API e UI;
- estratégias adicionais de isolamento;
- paralelismo;
- drag and drop real no Sortable.

---

## Autor

**Samuel Melo**  
Quality Engineer

[LinkedIn](https://www.linkedin.com/in/samuelmelojr/)  
[GitHub](https://github.com/samuelmmjr)
