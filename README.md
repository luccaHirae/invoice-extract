# Invoice Extract

## Configuração e Instalação

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.
2. Clone este repositório em sua máquina local.
3. Navegue até o diretório do projeto.
4. Instale as dependências do projeto executando o comando:
   ```bash
   npm install
   ```

## Configuração do Ambiente

1. Crie um arquivo `.env` na raiz do projeto, caso ainda não exista.
2. Configure a variável `NEXT_PUBLIC_API_URL` no arquivo `.env` com a URL da API. Exemplo:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

## Executando a Aplicação

### Ambiente de Desenvolvimento

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
```

O servidor estará disponível em [http://localhost:3000](http://localhost:3000).

### Build para Produção

Para criar uma build de produção, execute:

```bash
npm run build
```

Para iniciar a aplicação em produção, execute:

```bash
npm start
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção.
- `npm start`: Inicia a aplicação em modo de produção.
- `npm run lint`: Executa o linter para verificar problemas no código.

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [Recharts](https://recharts.org/)
