# Kubernetes e hpa
1. Nessa fase, você deverá implementar exatamente o mesmo algorítimo que foi implementado em PHP (no php-apache-hpa / looping somando a raiz quadrada), porém na linguagem Go Lang. Não esqueça de seguir os passos abaixo: 
    1. Nome do deployment, service e nome da imagem deverá se chamar: go-hpa
    2. Desenvolva os testes
    3. Implemente o processo de CI
    4. Faça o push da imagem no Docker Hub (seu-user/go-hpa)
    5. Faça o deploy da imagem no K8S (criando os arquivos de deployment e services)
    6. Cada réplica deverá consumir no mínimo 50m e no máximo 100m.
 2. Implemente o "hpa" para que esse deployment tenha as seguintes características:
    1. O processo de escala inicia quando a CPU passar de 15%
    2. Quantidade mínima de pods: 1
    3. Quantidade máxima de pods: 6
 3. Crie um POD e faça requisições através de um looping infinito e verifique se o autoscaler está funcionando corretamente.

## Formato de Entrega:

Crie um repositório no github contendo tanto o projeto em Go (com pelo menos uma PR verificada através do processo de CI), bem como os arquivos yamls necessários para executar todo o processo.