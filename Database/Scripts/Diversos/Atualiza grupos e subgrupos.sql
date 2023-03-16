
--update ProdutosExcel set SUB_GRUPO = 'BIBOX DOUBLE SPRING ROSA' WHERE SUB_GRUPO = 'DOUBLE SPRING ROSA'
--alter table ProdutosExcel add SUBG varchar(50) collate SQL_Latin1_General_CP850_CI_AI
--update ProdutosExcel set SUBG = SUB_GRUPO

---------
--select * from produtos where ATIVO = 'S' and ALTERNATI NOT IN(select ALTERNATI from SONOENTREGAS..ProdutosExcel)
--SELECT * FROM GRUPOS
--update grupos set codigo = 6 where codigo = 16
--select * from SUB_GRUPOS where nome like 'IMPERIAL UN%'
--update SUB_GRUPOS set CODGRU = 6 where nome like 'PAR%'

---------------------------------

--update produtos set SUBG = c.CODIGO, GRUPO = c.CODGRU 
from PRODUTOS a
inner join SONOENTREGAS..ProdutosExcel b on a.ALTERNATI = b.ALTERNATI
inner join SUB_GRUPOS c on b.SUBG = c.NOME
where a.ATIVO = 'S'
order by c.CODIGO
