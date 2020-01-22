
# Utilizando K8S
---
Este branch é relativo a entrega do exercício **DevOps\Utilizando K8S** do curso **Desenvolvimento de Aplicações Modernas e Escaláveis com Microserviços**.

## Enunciado

Pronto para mais uma fase? Vamos lá!

Utilizando os conhecimentos adquiridos até o momento, crie os arquivos declarativos do Kubernetes para que os seviços abaixam possam ser executados.

1. Servidor Web - Nginx
     1. Utilize a imagem base do Nginx Alpine
     2. Disponibilize 3 réplicas
     3. Quando alguém acessar o IP externo do LoadBalancer do serviço criado, ou em caso de utilização do Minikube usando "minikube service nome-do-servico", deve ser exibido no browser: Code.education Rocks.

2. Configuração do MySQL

      1. Faça o processo de configuração de um servidor de banco de dados MySQL
      2. Utilize secret em conjunto com as variáveis de ambiente
      3. Utilize disco persistente para gravar as informações dos dados

3. Desafio Go!

    1. Crie um aplicativo Go que disponibilize um servidor web na porta 8000 que quando acessado seja exibido em HTML (em negrito) Code.education Rocks!
       1. A exibição dessa string deve ser baseada no retorno de uma função chamada "greeting". Essa função receberá a string como parâmetro e a retornará entre as tags \<b>\</b>.
    2. Como ótimo desenvolvedor(a), você deverá criar o teste dessa função.
    3.  Ative o processo de CI no Google Cloud Build para garantir que a cada PR criada faça com que os testes sejam executados.
    4.  Gere a imagem desse aplicativo de forma otimizada e publique-a no Docker Hub
    5.  Utilizando o Kubernetes, disponibilize o serviço do tipo Load Balancer que quando acessado pelo browser acesse a aplicação criada em Go.

## Respostas: 
1. Servidor Web - Nginx
   1. Encontra-se na pasta /K8S/nginx
2. Configuração do MySQL
   1. Encontra-se na pasta /K8S/mysql
3. Desafio Go!
   1. [x]Encontra-se em Desafio_GO/main.go
   2. [x]Encontra-se em Desafio_GO/main_test.go
   3. [ ]Encontra-se ativo neste branch
   4. [ ]Encontra-se disponível no endereço https://hub.docker.com/repository/docker/casenvi/webserver_golang ou docker push casenvi/webserver_golang:tagname
   5. [ ]Encontra-se disponível no endereço 
