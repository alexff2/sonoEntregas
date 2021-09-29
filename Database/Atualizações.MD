# Pendências

* Verificar codigos e descrição nas lojas de acordo com base de dados do CD;
* Colocar observação no local da data de entrega;
* Possibilidade de alterar a quantidade enviada do produto para entrega;
* Vendas a receber;

## Pendências Futuras
* Imprimir dav pelo sistema;
* Mudar cor de acordo com vencimento do prazo de entrega;

## Etapas:
ALTER TABLE SALES ADD OBS2 VARCHAR(250) NULL
ALTER TABLE SALES ADD HAVE_OBS2 BIT NULL
================================================================================

- Melhorar infra de consulta de entregas (contextDelivery para deixar sistema mais leve)