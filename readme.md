# Projeto Web Scrapping Alimentos

## Introdução

 Este projeto foi produzido para um processo seletivo onde o desafio foi criar uma API em node que faça web scrapping em um site que enumera produtos alimentícios e suas notas em diferentes padrões de avaliação de qualidade dos alimentos (Open Food Facts).
 O maior desafio foi em entender o web scraping com node (já tive experiência com Python, mas não com o Puppeteer antes) e executar na prática o processo utilizando o navegador virtual.
 
 Devido a experiência com bibliotecas e gerenciamento de pacotes foi fácil montar a estrutura do projeto e preparar os dados para retorno realizando o web scraping. Uma dificuldade maior foi em entender como funciona o swagger visto que existem versões diferentes da API e a documentação para Node não é clara em como se detalhar as rotas já existentes para que o script possa buildar a documentação corretamente.
 Fiz em dois dias a aplicação, focado em produzir o código funcional em um dia e no outro fazer melhorias nas validações e revisão geral. No fim estudei o swagger e fiz a devida implementação para finalizar o processo e realizei os últimos testes.

 Outro desafio foi que após os primeiros testes com a biblioteca puppeteer eu gostaria de ter estruturado o código orientado à objetos para melhorar a organização e robustecer a API, mas pelo tempo curto fiquei limitado para fazer esta transcrição, optei por inicialmente então apenas transcrever a API para typescript para melhorar a segurança do código e seu bom funcionamento.
 
 E-mail para contato `dev.humbertojr@gmail.com`

## Setup

 Para rodar o projeto basta iniciar um terminal na raiz do projeto e rodar o comando `npm i` ou `yarn install` caso esteja utilizando este gerenciador de pacotes.

 Para executar após a instalação basta utilizar ```npm start``` ou ```yarn start``` e acessar as rotas disponíveis.

 Uma vez que o projeto estiver rodando basta acessar as rotas disponíveis conforme a documentação para obter os dados dos alimentos obtidos do site `openfoodfacts`.
 
 Caso seja feita alguma alteração no código em typescript é necessário executar o comando ````npx tsc``` para transpilar o código para .js.

### Rotas
* **/products** Rota que traz a lista de alimentos do openfoodfacts com seus dados em um array, aceita os parâmetros ```nova``` e ```nutrition``` para filtrar as notas dos alimentos.
* **/products/:id** Esta rota traz os detalhes do produto especificado pela variável de caminho ```:id``` que pode ser encontrada nos produtos listados da rota anterior.
* **/docs** Rota da documentação pelo swagger onde é possível testar as rotas.
