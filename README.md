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

### Implementando recurso de vídeo e relacionamentos
Nesta fase, você deverá:
1. Implementar o CRUD de vídeo com o seguintes dados:
   1. id
   2. title
   3. description
   4. year_launched
   5. opened
   6. rating
   7. duration
2. Além disto, implemente os relacionamentos do vídeo com categorias e gêneros. Os dois relacionamentos são many-to-many
3. Implemente os testes:
   1. Unitário e integração do model Video.
   2. No teste unitário do model Video, você deve seguir a mesma linha do curso, verificando fillable, casts e etc.
   3. Integração do VideoController.
   4. Crie os testes do CRUD
   5. Verifique nos testes de criação e atualização se categorias e gêneros estão relacionados com o video.
   6. Lembre-se dos testes de validação
4. Todo gênero será relacionado com categorias também, então crie um relacionamento many-to-many entre eles, isto servirá mais tarde para verificar quais gêneros uma categoria tem, ou vice-versa. 
5. O relacionamento de gêneros e categorias se dará através do CRUD de gêneros, logo na criação e atualização devemos ser obrigados a passar uma lista de categorias relacionadas (se espelhe no exemplo que foi feito no CRUD de vídeo).
6. Implemente os testes de integração em GenreControllerTest para avaliar se as categorias estão sendo relacionadas corretamente (lembre-se de acrescentar a asserção de validação de categories_id).
7. Como gêneros e categorias estão relacionados, no momento de atribui-los aos videos elas também deverão estar relacionados. Exemplo:
   * Categorias X, Y e Z
   * Gêneros A, B e C
   * Gênero A é relacionado com Categoria X
   * Gênero B é relacionado com Categoria Y
   * Gênero C é relacionado com Categoria Z

   * No momento de criar ou atualizar o vídeo, não podemos validar o envio de categories_id ou genres_id que não estejam relacionados, então, está errado se enviarmos na requisição:

     * genres_id => A (não relacionado) categories_id => Y

     * genres_id => B (não relacionado) categories_id => X

     * genres_id => A, B (como existe B no envio, tem que ter alguma categoria relacionada com ele no envio) categories_id => X

   * Está correto enviar:

     * genres_id => A categories_id => X

     * genres_id => B categories_id => Y

     * genres_id => A, B categories_id => X, Y 

   * Ao passar um gênero ou um categoria no envio na requisição, este deve estar relacionado com pelo menos um do outro lado, senão é inválido.

   * Portanto, o desafio é criar uma regra de validação personalizada que será usada no VideoController para validar isto. Consulte a documentação do Laravel: https://laravel.com/docs/6.x/validation#custom-validation-rules para verificar como criar uma regra de validação personalizada.

### Primeiro Upload de arquivo
Nesta fase você deve criar o campo para upload do vídeo na tabela vídeos:

1. video_file, string e nullable

2. Validação
   * Os uploads não serão obrigatórios ao se enviar um POST ou PUT para /videos, logo nas regras de validação não teremos a regra required
   * Devemos validar o upload de vídeo requerendo somente o tipo video/mp4 e um tamanho máximo (especifique um valor simbolico para o tamanho). Pesquise na documentação do Laravel como validar tipos de arquivo e o tamanho máximo de um arquivo.
   * Crie o teste de validação do upload de vídeo, é necessário testar a invalidação do tipo do vídeo e o tamanho máximo.

3. Upload
   * Implemente o upload do vídeo (somente com POST) como foi mostrado no capítulo e aplique um teste para verificar se o arquivo foi criado corretamente após o término do cadastro.

### Terminando uploads do model vídeo
Nesta fase, você deverá acrescentar mais campos de upload na tabela e no model Vídeo. Já temos video_file e thumb_file.

1. Agora teremos:
   * banner_file
   * trailer_file

2. Você deve criar também os testes de validação de tamanho máximo para os 4 campos. Abaixo está o tamanho máximo permitido:
   * video_file - 50GB
   * thumb_file - 5MB
   * banner_file - 10MB
   * trailer_file - 1GB

3. Agora com todos estes arquivos em mãos, consolide os testes de upload no teste de integração do model Vídeo. Precisamos saber se no próprio model Video, os uploads estão funcionando. Você pode criar 4 testes: 
   * testCreateWithBasicFields e testUpdateWithBasicFields para testar somente a criação ou atualização do vídeo sem upload 
   * testCreateWithFiles  e testUpdateWithFiles para focar somente no upload.

4. Desafio (Opcional): Na trait de uploads, crie um método que receba o nome de um arquivo e devolva o endereço correto do arquivo, ou seja, o endereço WEB de acesso ao arquivo. Este método servirá como base para gerar qualquer endereço de qualquer arquivo do vídeo.
   * Você deve criar o teste deste método e criar mutators do Eloquent para permitir que os endereços sejam acessíveis como campos, exemplo: $video->thumb_file_url ou $video->video_file_url.

### Implementando API Resource
Nesta fase, você deve implementar o recurso API Resource nos controllers e testa-los.

1. Crie os resources para: 
   1. Category [ ]
   2. CastMember [ ]
   3. Genre [ ]
      1. incluir na serialização, as categorias relacionadas.
   4. Video. [ ]
      1. incluir na serialização, as categorias e gêneros relacionados e as urls dos arquivos.

2. Aplique todos os resources nos controllers e faça os testes em todos os métodos do CRUD, exceto no destroy. Lembre-se de testar sempre a estrutura do JSON, com o método jsonStructure e também usando o método assertResource. [ ]

3. Desafio (Opcional): Agora com a mudança para o API Resource, o controller básico de CRUD foi modificado, será necessário testa-lo também. [ ]
   1. Aplique os testes em todos os métodos, exceto no destroy. Lembre-se que neste controller não temos resposta HTTP, logo em cada retorno de cada ação do controller, teremos a instância do Resource para avaliar. [ ]
   2. Somente avalie se os dados do resource são iguais ao toArray do model CategoryStub. [ ]
   
