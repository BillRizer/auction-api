
# Auction API
API para leilão de produtos raros

![image](https://user-images.githubusercontent.com/5104527/209767168-651184c8-8639-4db8-bfac-f0a64921cb56.png)
![image](https://user-images.githubusercontent.com/5104527/209913368-630369e2-85ee-4a51-af77-98c4fe2c5664.png)
**Note:**
- A tabela **Bid** e **Sale** não possui as FKs de **User** e **Product** para simplificar o teste.
Para que um **Bid** seja criado, é verificado se o **User** e **Product** existe, para o **Sale** também, por isso não quebraria a lógica aplicada por um relacionamento na database, e conforme efetuado apenas "SoftDelete" não ficariam registros órfãos.
- o campo **Role** não foi implementado.

**LIMIT_AUCTION_TIME** = Define quanto tempo dura os rounds de cada leilão

**AUCTIONEER_FREQUENCY_INTERVAL_MS** = frequencia que o modulo que verifica o vencedor atua.

# Modules:

**Auth**:

*overview*
> módulo para autenticação JWT e login

*tech*
> Apenas um módulo comum do NestJs

<br/>

**User**

*overview*
> módulo para CRUD de usuarios

*tech*
> Apenas um módulo comum do NestJs

<br/>

**product**

*overview*
> módulo para CRUD de produtos e de um usuario

*tech*
> Apenas um módulo comum do NestJs

<br/>

**bid**

*overview*
>  módulo para Criar e listar lances relativos a um produto

*tech*
> Apenas um módulo comum do NestJs

<br/>

**auctioneer**

*overview*

> modulo que verifica leiloes finalizados e define o vencedor.
> Ao acabar o tempo o modulo "Auctioneer" verifica o ganhador com o maior lance no tempo limite, que tenha crédito suficiente, caso contrario o próximo da lista sera o ganhador, caso nenhum possua crédito ou o produto não tenha lances, será retornado ao estado de um produto não vendido. 

*tech*

> Este modulo possui características diferentes de um módulo normal do NestJs, pois ele entra em loop para verificar os leiloes que estão acontecendo.
Decidi utilizar o padrão criacional "Singleton", embora viole o princípio de responsabilidade única, permite que mantenha apenas uma instância da classe em todo código, mesmo que chame este modulo em outro lugar, sera mantida a instância, isto previne que o modulo Auctioneer seja criado em outros lugares e assim gerando problemas de concorrência, uma vez que este modulo trabalha em loop.

**Note:**
 Uma solução mais rápida e com suporte do framework seria criar uma ["Task Schedule"](https://docs.nestjs.com/techniques/task-scheduling) + Redis. A cada produto que for definido como "disponível para leilão" ele agenda a execução do processo que verifica o vencedor. Fiz da forma menos automatizada para demostrar minha capacidade de solucionar problemas.

----
<br>

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
    [] Apos o usuário vencer um leilao deve receber um email
    [] Testar performance 
    [] Melhorar deploy
    [] Refatorar mult-stage building
    [] Criar automaticamente a database auction_e2e para Dev

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
*before tests, create database auction_e2e for integrations tests*
**tests:**
```
#e2e test
yarn test:e2e:watch

#integrations test
yarn test:int:watch

#unity test
yarn test:watch
``` 

**production:**
```
#Como utilizo multi-stage-building, é necessario executar o deploy em dev e quando os containers iniciarem, cancelar a execucao, como exemplo abaixo:

./deploy --dev

#Quando iniciar a api, pressione CTRl+C para encerrar a execucão dos containers

./deploy --prod
#A base url é http://localhost:3000/api/v1
```
