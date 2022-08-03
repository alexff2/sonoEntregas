# Pendências Lojas
* Verificar codigos e descrição nas lojas de acordo com base de dados do CD;
* Separar vendas iniciadas e colocar o nome ENTREGAS
* Colocar horario de entregas
* Verificar validação de produto cadastrado no CD e nas Lojas

# Atualização de banco
* Rodar auteração na ViewDelivProd2, depois na ViewDelivProdMaint (Verificar)
* Rodar auteração na Sales_prod, VIEW_NVENDI2, NVENDI2
 - ALTER TABLE NVENDI2 ADD GIFT BIT DEFAULT 0
 - UPDATE NVENDI2 SET GIFT = 0

ALTER VIEW [dbo].[VIEW_NVENDI2]
AS
SELECT A.NUMVENDA, A.CODPRODUTO, B.ALTERNATI, A.DESCRICAO, A.QUANTIDADE, A.UNITARIO1, A.NPDESC, A.STATUS, A.GIFT,
A.NVTOTAL 
FROM NVENDI2 A
INNER JOIN PRODUTOS B ON A.CODPRODUTO = B.CODIGO

# Pendências
* Vendas a receber;

## Pendências Futuras
* Imprimir dav pelo sistema;

## Etapas:
================================================================================

- Melhorar infra de consulta de entregas (contextDelivery para deixar sistema mais leve)
