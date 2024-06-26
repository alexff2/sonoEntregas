/*
BEGIN TRAN
insert into NFITENS
(
NNF, PRODUTO, QUANTIDADE, UNITARIO, VTOTAL, EMBALAGEM, VTOTALIQ,
P_IPI, P_ICM, P_DESCONTO, VL_DESCONTO, INDPER, INDVAL, ITEM, DATA,
CUSTOVENDA, PRECOVENDA, CODLOJA,
MARGEMLUCRO, MARGEMORCIL, ALTMARGPROD, VALOR_IPI, MU_UNIDADE,
MU_ITEM, MU_QTE_MENORUN, QUANTIDADE_PROCESSADA,
CODIGO_FIGURAPISCOFINS_ALQ, DESC_SUFRAMA, FORMAR_PCO_DESC_SUFRA,
CONTROLENF_VENDA,ITEM_NF_VENDA,ORIGEMNF_ITEM 
)
values
(
 'N100004994', 108.0, 1.0, 9.0, 9.0, 1.0,
 9.0, 0.0, 12.0, 0.0, 0.0, 0.0, 0.0, 1.0,
 '20240522 00:00:00.000', 0.0, 0.0, 1.0, 0.0, 0.0, 'N',
 0.0, 'UN', -1.0, 1.0, 0.0,
 38.0, 0.0, 'N',
 0.0,0,NULL 
)


insert into NFITENS_TRIBUTOS
  (
   NUMERO_NF, CODLOJA, ITEM, CODIGOPRODUTO, DESCRICAO, QUANTIDADE, UNITARIO_BRUTO,
   TOTAL_BRUTO, PERC_DESCONTO, VALOR_DESCONTO, TOTAL_LIQUIDO, UNIDADE,
   CST_ORIGEM, CST_ICMS, CFOP, MODBC, VL_BC_ICMS, PERC_RED_BC, PERC_ICMS,
   VL_ICMS, VL_BC_ICMS_ST, PERC_MVAST, PERC_REDBCST, PERC_ICMS_ST, VL_ICMS_ST,
   MODBCST, CST_IPI, PERC_IPI, VL_BC_IPI, VALOR_IPI, CST_PIS, VL_BC_PIS,
   PERC_PIS, VL_PIS, CST_COFINS, VL_BC_COFINS, PERC_COFINS, VL_COFINS,
   VALOR_BC_I_IMPORTACAO, VALOR_DESPADU_IMPORTACAO, VALOR_I_IMPORTACAO,
   VALOR_IOF_IMPORTACAO, VALORFRETE, VALORSEGUROS, VALOROUTRADESP,
   PART_BC_ICMS_VIPI, PART_BC_ICMS_VFRETE, PART_BC_ICMS_VSEG, PART_BC_ICMS_VOUTRO,
   ESCRITURAR_FRETE, CODIGO_FIGURAPISCOFINS_ALQ,
   PART_BC_PFINS_VIPI, PART_BC_PFINS_VFRETE, PART_BC_PFINS_VSEG,
   PART_BC_PFINS_VOUTRO, PART_BC_PFINS_ICMS_ST, VALOR_BASE_PFINS_CREDITO,
   PART_BC_ICMSST_VIPI,PART_BC_ICMSST_VFRETE,PART_BC_ICMSST_VSEG,PART_BC_ICMSST_VOUTRO,
   AJUSTE_ICMS, AJUSTE_ICMS_ST, PART_BC_IPI_VFRETE, VALORFRETE_NOTA,VALORFRETE_FORA,
   PFCP,VFCP,PFCPST,VFCPST, VICMS_DESONERADO, VBASE_DESONERADO, CALC_DESONERACAO, IGNORAR_CST_PIS_FG,BC_IPI_VALOR_BRUTO, PER_ICMS_ORIGINAL
   
)
values
  ('N100004994', 1.0, 1.0, 108.0, 'TRAVESSEIRO SOFTFLEX xxx', 1.0, 9.0,
   9.0, 0.0, 0.0, 9.0, 'UN',
   0.0, 0.0, '2.102', '3', 0.0, 0.0, 12.0,
   0.0, 0.0, 0.0, 0.0, 0.0,
   0.0, '3', 0.0, 0.0, 0.0, 0.0,
   1.0, 0.0, 0.0, 0.0, 1.0, 0.0,
   0.0, 0.0, 0.0, 0.0,
   0.0, 0.0, 0.0, 0.0,
   0.0,
   'N', 'N', 'N', 'N',
   'S', 38.0,
   'N', 'N', 'N',
   'N', 'N', 0.0,
   'N', 'N', 'N', 'N',
   0.0,
   0.0, 'N', 0.0,0.0,
   0.0,0.0,0.0,0.0, 0.0, 9.0, 'N', '', 'S',0.0
   
  )

-------Pode ter 
ROLLBACK TRAN
--------

INSERT INTO LOGS(CODIGO, TABELA, DATA, TIPO, HORA, USUARIO, MICRO, RESULTADO, CODLOJA, DETALHES) VALUES(
'121213',
'NFISCAL',
'5/22/2024',
'INCLUSAO',
'14:23:09',
'WWA',
'684C8545-SYSCD',
'22/05/2024 - Forn: 1- Vlr: 9  N║ Controle: N100004997-OK',
1,
'')

insert into NFISCAL
  (NF, EMISSAO, PROCESS, CODFOR, PEDIDO, VALOR, DESCONT, TOTNF, ICMS,
   IPI, FRETE, FRETE_P, CODUSUARIO, CFOP, SAIDA, CODTRANSP, CODPLANO, CODLOJA,
   OBS, EST_DEP_LOJA, COD_NF_SERIES, ENTRADASIMP, DATA_LANCAMENTO, HORA_LANCAMENTO,
   DATA_CHEGADA, BC_ICMS_SUBS, VALOR_ICMS_SUBS, DESPESAS_ACESSORIOS, DESPESAS_IMPOSTOS,
   IND_FRT, VEIC_ID, QTD_VOL, PESO_BRT, PESO_LIQ, UF_VEIC_ID, VL_SEG,
   VOL_ESPE, VOL_MARCA, VOL_NUMEROS, COD_MOD_DOC_FISCAL, SERIE,
   VL_BC_ICMS, VL_PIS, VL_COFINS, VL_PIS_ST, VL_COFINS_ST,
   VL_IMPOSTO_IMP, VL_RETPIS, VL_RETCOFINS, COD_PLANO_CONTAS, NUM_DOC,
   DIVERG_VALOR, PARTICIPA_PRECO, PARTICIPA_ESTOQUE, PARTICIPA_EFD, IND_EMIT,
   PERC_DESP_PCO_VENDA, PERC_DESP_PCO_PROMO, PERC_DESP_PCO_COMPO,
   PERC_DESP_PCO_ATACA, PERC_DESP_PCO_ATAC2, PERC_DESP_PCO_ATAC3,
   PERC_DESP_PCO_ATAC4, PERC_MARG_PCO_VENDA, PERC_MARG_PCO_PROMO,
   PERC_MARG_PCO_COMPO, PERC_MARG_PCO_ATACA, PERC_MARG_PCO_ATAC2,
   PERC_MARG_PCO_ATAC3, PERC_MARG_PCO_ATAC4, PARTICIPA_EFD_PISCOFINS, DESC_SUFRAMA,
   FRETE_ESCRITURAR, TIPO_NF, NF_PRODUTOR, FRETE_NAOESCRITURAR, VFCP,VFCPST,VICMS_DESONERADO,ICMS_DESONERADO_PARTICIPA_NOTA,CODTIPOOPERACAO)
values
  ('N100004997', '20240522 00:00:00.000', 'F', 1.0, NULL, 9.0, 0.0, 9.0,
   0.0, 0.0, 0.0, 0.0, 1.0, '1.101', '20240522 00:00:00.000',
   1.0, 1.0, 1.0, NULL, NULL, 3.0,
   'N', '20240522 00:00:00.000', '14:23:09', '20240522 00:00:00.000',
   0.0, 0.0, 0.0, 0.0,
   2.0, NULL, 0.0, 0.0, 0.0, NULL, 0.0,
   NULL, NULL, NULL, 'A-', '',
   0.0, 0.0, 0.0, 0.0, 0.0,
   0.0, 0.0, 0.0, -1.0, '121213',
   'Nao', 'S', 'S', 'S', '1',
   0.0, 0.0, 0.0,
   0.0, 0.0, 0.0,
   0.0, 0.0, 0.0,
   0.0, 0.0, 0.0,
   0.0, 0.0, 'S', 0.0,
   0.0, 'C', NULL, NULL, 0.0, 0.0, 0.0,'N', NULL)

   insert into NFE_NFCOMPRA
  (CODLOJA, NUMERONF, NUMERONF_INT, CODIGOFORNECEDOR, CODIGOSTATUS, DESCRICAOSTATUS, 
   CANCELADA, MODELO, SERIE, CHAVENFE, XMLNFE, DATAENVIO, DATACAD, HORACAD, 
   USUARIOCAD, DATAALT, HORAALT, USUARIOALT)
values
  (1.0, 'N100004997', 100004997.0, 1.0, 5.0, 
   'Autorizado o uso da NF-e', 'N', 'A-', '', '', '', NULL, 
   '20240522 00:00:00.000', '14:22:24', 'WWA', NULL, NULL, NULL)

COMMIT TRAN
*/