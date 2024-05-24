# BrasilPrev Backend


## 💻 O Desafio
O desafio é que o entrevistado implemente uma API aonde seja possível cadastrar clientes, cadastro de produtos, contratação de
planos, realizar um aporte extra no plano e depois resgatar, seguindo as regras do produto.

- Para o cliente contratar um plano, é necessário que esteja dentro do período de venda e acima do aporte mínimo do produto.
- Para realizar o resgate, é necessário que o cliente atenda as regras de resgate definidas no produto.
- Um plano sem saldo estará automaticamente cancelado, não podendo mais haver nenhuma operação no mesmo.
- Para realizar um aporte extra, é necessário que o cliente atenda as regras definidas no produto.

## ▶️ Iniciar o projeto
Para iniciar o projeto poderá ser feito de 3 maneiras.

### 1. Localmente
Para essa execução, instale a última versão LTS do Node em sua máquina, e siga as instruções abaixo.

1. Crie um arquivo `.env` baseado no arquivo `.env.example`.
2. Caso necessário preencha as variáveis de ambiente necessárias para aplicação funcionar. (para este teste a conexão com o banco de dados já está com as informações)
3. Instale as dependências da aplicação através do comando `npm install`.
4. Gere a tipagem do prisma localmente com o comando `npx prisma generate`.
6. Neste momento você poderá executar a aplicação com o comando `npm run start:dev` caso queira executar em desenvolvimento.
7. (BUILD) Caso queira executar a aplicação já "buildada", primeiro execute `npm run build` e após `npm run start`

### 2. Docker
Para essa execução, garanta que tenha o Docker instalado em sua maquina (testado na versão 26.1.1, build 4cf5afa)

1. Crie um arquivo `.env` baseado no arquivo `.env.example`.
2. Caso necessário preencha as variáveis de ambiente necessárias para aplicação funcionar. (para este teste a conexão com o banco de dados já está com as informações)
3. Faça o build da imagem docker através do comando `docker build -t brasilprev_api .`
4. Agora execute o projeto através do comando `docker run -d -p 3333:3000 brasilprev_api`

### 3. Docker Compose
Para essa execução, garanta que tenha o Docker instalado em sua maquina (testado na versão 26.1.1, build 4cf5afa) e Docker Compose (testado na versão v2.27.0-desktop.2)

1. Crie um arquivo `.env` baseado no arquivo `.env.example`.
2. Caso necessário preencha as variáveis de ambiente necessárias para aplicação funcionar. (para este teste a conexão com o banco de dados já está com as informações)
3. Execute o comando `docker-compose up -d`

## 🧱 Estrutura do Projeto
O projeto foi desenvolvido utilizando o NestJS, decidi separar os arquivos por responsabilidades pois em casos de grandes aplicações esse método ajuda na escalabilidade e manutenibilidade da aplicação, foi utilizado alguns conceitos da Clean Architecture, como segregação de camadas. Também foi adotado alguns design patterns como Factories, Skeleton, Repository Pattern e Either Pattern.


## ✨ Pontos de melhoria
- Armazenar os aportes e saques em tabelas especificas para ter um histórico.
- Sistema de autenticação e autorização.
- Emissão de eventos para possíveis funcionalidade assíncronas (envio de email, requisição de saque para o setor financeiro)
- Monitoramento (logs de requisições)

## ⭐️ Funcionalidades
- Testes unitários
- Documentação de API Rest
- Arquitetura limpa (Clean Architecture) e princípios SOLID