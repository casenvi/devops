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