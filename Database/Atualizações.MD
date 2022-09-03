# Pendências Lojas
- CD
  * Criar usuários CD (ok, validar e colocar em produção!)
  * Arrumar DAV com mesma numeração
  * Criar modulo de previsão

- Lojas
  * Verificar codigos e descrição nas lojas de acordo com base de dados do CD;
  * Separar vendas iniciadas e colocar o nome ENTREGAS - Melhorar visualização
  * Colocar horario de entregas
  * Colocar loading (ok, validar e colocar em produção!)

# Atualização de banco
ALTER TABLE USERS ADD PRE_REG BIT NOT NULL DEFAULT 0
UPDATE USERS SET PRE_REG = 1
UPDATE USERS SET PASSWORD = 0 WHERE OFFICE IN ('Driver', 'Assistant')

## Pendências Futuras
* Imprimir dav pelo sistema;

## Etapas:
================================================================================

- Melhorar infra de consulta de entregas (contextDelivery para deixar sistema mais leve)
