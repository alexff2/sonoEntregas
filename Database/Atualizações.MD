# Pendências Lojas
* Verificar codigos e descrição nas lojas de acordo com base de dados do CD;
* Verificar as Bibox
* Separar vendas iniciadas e colocar o nome ENTREGAS
* Estudar e ajustar 6 vendas em lançamento e colocar datas na tabela Delivery
* Verificar dados sequintes: sale:15204	loja:4	prod:1862	
* Ajustar View Deliverys

# Atualizar banco
--ALTER TABLE SALES ADD SCHEDULED BIT NOT NULL DEFAULT 0
--ALTER TABLE LOJAS ADD DESC_ABREV VARCHAR(10) NOT NULL DEFAULT 'DEF'
UPDATE LOJAS SET DESC_ABREV = 'JP 1' WHERE CODLOJA = 2
UPDATE LOJAS SET DESC_ABREV = 'JP 2' WHERE CODLOJA = 3
UPDATE LOJAS SET DESC_ABREV = 'R. ANIL' WHERE CODLOJA = 4
UPDATE LOJAS SET DESC_ABREV = 'S. ILHA' WHERE CODLOJA = 5
UPDATE LOJAS SET DESC_ABREV = 'COHAB' WHERE CODLOJA = 6
UPDATE LOJAS SET DESC_ABREV = 'P. NORTE' WHERE CODLOJA = 7
CREATE VIEW D_DELIV_ROUTES

# Pendências
* Possibilidade de alterar a quantidade enviada do produto para entrega;
* Vendas a receber;
* Ajustr modal Alert colocando children de conexao com servidor padrão;

## Pendências Futuras
* Imprimir dav pelo sistema;
* Mudar cor de acordo com vencimento do prazo de entrega;

## Etapas:
================================================================================

- Melhorar infra de consulta de entregas (contextDelivery para deixar sistema mais leve)