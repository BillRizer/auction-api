
# Auction API
API para leilão de produtos raros


**LIMIT_AUCTION_TIME** = Define quanto tempo dura os rounds de cada leilão
**AUCTIONEER_FREQUENCY_INTERVAL_MS** = frequencia que o modulo que verifica o vencedor atua.

# modulos:
**auth**: autenticação JWT e login

**user**: crud para usuarios

**product**: crud para gerenciar produtos de um usuario

**bid**: cria e lista lances relativos a um produto

**auctioneer**: modulo que verifica leiloes finalizados e define o vencedor.
    Ao acabar o tempo o modulo "Auctioneer" verifica o ganhador com o maior lance no tempo limite, que tenha crédito suficiente, caso contrario o próximo da lista sera o ganhador, caso nenhum possua crédito ou o produto não tenha lances, será retornado ao estado de um produto nao vendido. 

TODO
    [] apos o usuario vencer um leilao deve receber um email
    [] é necessario uma tabela para salvar os vencedores e produtos
    [] testar performance 

# Stack

- NestJS
- TypeOrm
- Jest
- Postgres
- Swagger
- Docker
- Husky
- Eslint
- Conventional commits
- logs


**development:**
```
./deploy --dev
```
**tests:**
```
#integrations test
yarn test:int:watch

#unity test
yarn test:watch
``` 

**production:**
```
./deploy --prod
```