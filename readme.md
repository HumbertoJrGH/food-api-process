# Projeto Web Scrapping Alimentos

## Introdução

 Este projeto foi produzido para ...
 O maior desafio foi em entender o web scraping com node (já tive experiência com Python, mas não com o Puppeteer antes).
 Devido a experiência com bibliotecas e outros foi fácil montar a estrutura do projeto e preparar os dados para retorno.
 Fiz em dois dias a aplicação, focado em produzir o código funcional em um dia e no outro fazer melhorias nas validações e revisão geral.

## Setup

 Para rodar o projeto basta iniciar um terminal na raiz do projeto e rodar o comando `npm i` ou `yarn install` caso esteja utilizando este gerenciador de pacotes.
 Para executar após a instalação basta utilizar ```npm start``` ou ```yarn start``` e acessar as rotas disponíveis.
 Uma vez que o projeto estiver rodando basta acessar as rotas disponíveis conforme a documentação para obter os dados dos alimentos obtidos do site `openfoodfacts`.

### Rotas
* **/products** Rota que traz a lista de alimentos do openfoodfacts com seus dados em um array, aceita os parâmetros ```nova``` e ```nutrition``` para filtrar as notas dos alimentos.
* **/products/:id** Esta rota traz os detalhes do produto especificado pela variável de caminho ```:id``` que pode ser encontrada nos produtos listados da rota anterior.
