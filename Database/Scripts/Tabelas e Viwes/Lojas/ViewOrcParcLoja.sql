
CREATE VIEW [dbo].[VIEW_ORCPARCLOJA] AS
SELECT A.TITULO, A.PARCELA, A.VENCIMENTO, A.VALOR, B.NOME FORMPAGTO FROM ORCPARC A
INNER JOIN PAGTO B ON A.FORMPAGTO = B.CODIGO



