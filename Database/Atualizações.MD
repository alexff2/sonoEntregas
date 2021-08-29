# Pendências

* Bloquear envio de produtos sem código para entrega;
* Verificar codigos e descrição nas lojas de acordo com base de dados do CD;
* Colocar observação no local da data de entrega e calcular data de entrega colocando 10 dias de prazo;
* Criar relatório de vendas enviadas do dia;
* Possibilidade de alterar a quantidade enviada do produto para entrega;
* Vendas a receber;
* Não permitir enviar venda com data de entrega inferior a 10 dias corridos.

## Pendências Futuras
* Imprimir dav pelo sistema;
* Mudar cor de acordo com vencimento do prazo de entrega;

## Etapas:

* Scripts de Autalização do banco *
update SALES set STATUS = 'Aberta' where STATUS = 'Aberto'
update SALES set STATUS = 'Fechada' where STATUS = 'Finalizada'

use SONOENTREGAS
ALTER TABLE dbo.SALES_PROD ADD STATUS VARCHAR(15) NOT NULL DEFAULT 'Enviado'

UPDATE SALES_PROD SET STATUS = 'Finalizada'
FROM SALES A
INNER JOIN SALES_PROD B ON A.ID_SALES = B.ID_SALES
where a.STATUS = 'Fechada'

INSERT DELIVERYS_PROD
select A.ID_DELIVERY, A.ID_SALE, A.CODLOJA, B.QUANTIDADE, B.COD_ORIGINAL, C.D_ENTREGA2, C.D_ENTREGA2, C.D_ENTREGA2, 1
from DELIVERYS_SALES A 
INNER JOIN SALES_PROD B ON A.ID_SALE = B.ID_SALES AND A.CODLOJA = B.CODLOJA
INNER JOIN SALES C ON A.ID_SALE = C.ID_SALES AND A.CODLOJA = B.CODLOJA

Alterar ViewDevSales
Criar ViweDeliProd

================================================================================

# Procedimentos de atualização do banco de dados em produção #

- Ajustar tabela SALES e outras para que nao haja duplicidade;
- Corrigir chave da tabela sales_prod, alterar codproduto para cod_original
- Melhorar infra de consulta de entregas (contextDelivery para deixar sistema mais leve)