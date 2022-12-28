
# Auction API
API para leilão de produtos raros

![image](https://user-images.githubusercontent.com/5104527/209767168-651184c8-8639-4db8-bfac-f0a64921cb56.png)
![image](https://user-images.githubusercontent.com/5104527/209767277-b0a6c5b7-45de-4c86-b350-43eb6e59759e.png)


**LIMIT_AUCTION_TIME** = Define quanto tempo dura os rounds de cada leilão

**AUCTIONEER_FREQUENCY_INTERVAL_MS** = frequencia que o modulo que verifica o vencedor atua.

# modulos:
**auth**: autenticação JWT e login

**user**: crud para usuarios

**product**: crud para gerenciar produtos de um usuario

**bid**: cria e lista lances relativos a um produto

**auctioneer**: modulo que verifica leiloes finalizados e define o vencedor.
    Ao acabar o tempo o modulo "Auctioneer" verifica o ganhador com o maior lance no tempo limite, que tenha crédito suficiente, caso contrario o próximo da lista sera o ganhador, caso nenhum possua crédito ou o produto não tenha lances, será retornado ao estado de um produto nao vendido. 

# Swagger
http://localhost:3000/api/v1
![image](https://user-images.githubusercontent.com/5104527/209767491-19fc4b00-cdf5-45e3-9a77-0561d3fae897.png)

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
