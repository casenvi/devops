# Catalog

Este branch é utilizado para as entregas do projeto prático *CATÁLOGO DE VÍDEOS* do curso *Desenvolvimento de Aplicações Modernas e Escaláveis com Microserviços*. 

## Glossário / Linguagem Ubíqua

* Catalog - Catálogo de vídeos.
* Category - Categorização de um video (filme, documentário, etc).
* Genre - Gênero do vídeo (terror, comédia, etc).
* Cast members - Atores, diretores, etc.
* Featured Vídeo - Vídeo em destaque na plataforma.
* My Vídeos - Lista dos vídeos favoritos do usuário.
* Subscription - Assinatura do cliente.
* Plan - Plano que pode ser contratado.
* Client - Quem contrata o aceso a plataforma de videos.
* User - Qualquer pessoa com acesso ao sistema.

## Etapas
### Criando o recurso Category
Nesta primeira fase de projeto, crie o recurso de Category como descrito nas aulas:

* Model
* Factory e seeder
* Controller

E crie mais um recurso, que chamaremos de Gênero.
Lembrando que o Gênero no sistema significa: Terror, ação, comédia e etc. Ele será relacionado com o Vídeo mais tarde.

O Gênero deverá ter os seguintes campos: 
* nome
* is_active (Se está ativo ou não).

### Testes de integração em categorias e gêneros
Nesta fase você deverá aplicar os testes de integração nos models Category e Genre.

Implemente também o teste na exclusão dos registros e crie no teste de criação do registro, uma verificação se o UUID foi gerado corretamente (seja criativo, pense em como testar se o UUID está correto).

### Testes com HTTP

Nesta fase você deverá aplicar os testes de http nos controllers de Category e Genre.

Lembre-se de implementar o teste de exclusão que não foi mostrado nas aulas.

### Abstract CRUD e Resource CastMember
Neste fase de projeto, você deve implementar e testar:

 1. O controller abstrato de CRUD com todos os métodos
 2. O resource CastMember com os dados: 
    1. name - string, 
    2. type - smallInteger (1 - Diretor, 2 - Actor)
 3. Ao final, submeta o código ao CI e deixe o registro dele no seu repositório Git através de uma pull request.