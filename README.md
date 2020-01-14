
Rev 0.3

Parabéns! Se você chegou até aqui é porque você está de fato compreendendo os principais conceitos do Docker!

Nesse desafio você terá duas tarefas extremamente importantes:

1) Baseado em nosso projeto exemplo Laravel, utilize o sistema de templates do Dockerize para que ele ajude no processo de deixar o arquivo nginx.conf mais flexível, ou seja, tanto o host e porta da chamada do php-fpm possam ser definidos como variáveis de ambiente no docker-compose.yaml. 

O resultado final é que quando rodemos docker-compose up -d, tanto o host e a porta do nginx possam ser definidas através de variáveis de ambiente no docker-compose.yaml. 

Dica: Esse processo é bem similar ao que vimos no curso com o arquivo .env do Laravel. Colocamos as varáveis de template no arquivo .env para o dockerize e ele fez o processo de substituição. Nesse caso, faça o mesmo processo para o arquivo nginx.conf colocando as variáveis para o host e porta do php-fpm.

2) Esse desafio é muito empolgante principalmente se você nunca trabalhou com a linguagem Go!
Você terá que publicar uma imagem no docker hub. Quando executarmos:

docker run <seu-user>/codeeducation 

Temos que ter o seguinte resultado: Code.education Rocks!

Se você perceber, essa imagem apenas realiza um print da mensagem como resultado final, logo, vale a pena dar uma conferida no próprio site da Go Lang para aprender como fazer um "olá mundo".

Lembrando que a Go Lang possui imagens oficiais prontas, vale a pena consultar o Docker Hub.

3) A imagem de nosso projeto Go precisa ter menos de 2MB =)

Dica: No vídeo de introdução sobre o Docker quando falamos sobre o sistema de arquivos em camadas, apresento uma imagem "raiz", talvez seja uma boa utilizá-la.

Divirta-se
-----------------------------------------------------------------------------------------------------------------

Exercicio 1 ATUALIZAÇÃO = Rev 0.2

Agora que você já aprendeu muito sobre docker, gostaríamos que dividisse esse 
exercício em duas etapas:

1) Configurar um ambiente Laravel utilizando o docker-compose com:

Nginx
PHP-FPM
Redis
MySQL
Lembrando que o volume do código fonte deve ser compartilhado com a App.

Após realizarmos a clonagem do repositório e executarmos: docker-compose up -d,
 poderemos ver a aplicação Laravel rodando com o erro de autoload na porta: 8000,
  uma vez que o docker-compose não executou o composer install do PHP, logo, não 
  se preocupe com tal detalhe nesse momento. 

2) Após ter tido sucesso na etapa anterior, faça a configuração do framework 
Laravel seguindo as etapas (dentro do container):

execute composer install
crie o arquivo .env baseado no .env.example 
execute: php artisan key:generate 
execute: php artisan migrate
* Nesse momento, quando você acessar a aplicação no browser, finalmente, você 
deverá ver a página inicial do Laravel funcionando.

Baseado nessas últimas ações, gere o build da imagem desse container e faça a 
publicação em sua conta no Hub do Docker.

Lembre-se: Ao gerar o build da imagem, TODO o conteúdo incluindo arquivos como 
vendor, .env, etc deverão ser incluídos.

Adicione o endereço da imagem no seu dockerhub no README.md e faça o commit 
para um repositório público do Github.

Arquivos e códigos úteis para auxiliar no exercício incluindo nginx.conf e 
linha de comando para baixar o composer. Clique aqui.

Desafio Docker
---
https://hub.docker.com/repository/docker/casenvi/codeeducation