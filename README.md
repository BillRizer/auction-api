
# Auction API
API para leilão de produtos raros

![image](https://user-images.githubusercontent.com/5104527/209767168-651184c8-8639-4db8-bfac-f0a64921cb56.png)
![image](https://user-images.githubusercontent.com/5104527/209913368-630369e2-85ee-4a51-af77-98c4fe2c5664.png)
**obsservations:**
- A tabela **Bid** e **Sale** não possui as FKs de **User** e **Product** para simplificar o teste.
Para que um **Bid** seja criado, é verificado se o **User** e **Product** existe, para o **Sale** também, por isso não quebraria a lógica aplicada por um relacionamento na database, e conforme efetuado apenas "SoftDelete" não ficariam registros órfãos.
- o campo **Role** não foi implementado.

**LIMIT_AUCTION_TIME** = Define quanto tempo dura os rounds de cada leilão

**AUCTIONEER_FREQUENCY_INTERVAL_MS** = frequencia que o modulo que verifica o vencedor atua.

# Modules:
**auth**: autenticação JWT e login

**user**: crud para usuarios

**product**: crud para gerenciar produtos de um usuario

**bid**: cria e lista lances relativos a um produto

**auctioneer**: modulo que verifica leiloes finalizados e define o vencedor.
    Ao acabar o tempo o modulo "Auctioneer" verifica o ganhador com o maior lance no tempo limite, que tenha crédito suficiente, caso contrario o próximo da lista sera o ganhador, caso nenhum possua crédito ou o produto não tenha lances, será retornado ao estado de um produto não vendido. 

# tests
![image](https://user-images.githubusercontent.com/5104527/209913003-3c85e372-3ee8-4ac1-88ae-111d26c6dc99.png)


# Swagger
http://localhost:3000/api/v1

![image](https://user-images.githubusercontent.com/5104527/209914340-2eb8c20e-65f8-409d-a865-33499f50d8c8.png)

[ * ]  /user - CRUD de usuário

[ * ]  /product - CRUD de produto

[GET]  /product/available-for-auction - produtos que estao atualmente em leilão

[POST] /product/available-for-auction/{product-id} - colocar um produto para leilão (este produto deve ser seu)

[POST] /bid/{product-id} - efetuar um lance para qualquer produto em leilão

[GET]  /bid/{product-id} - listar todos os lances para aquele produto (desc pelo valor mais alto)

[GET]  /sale/ - listar todos os vencedores, produtos e valores.


# TODO
    [] apos o usuário vencer um leilao deve receber um email
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
