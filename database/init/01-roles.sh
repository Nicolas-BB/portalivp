#!/bin/sh
# Cria as duas roles do banco (decisão K3-A). O Postgres roda este script
# só na primeira vez que sobe, quando o volume de dados ainda está vazio.
#
# - portalivp_owner: dona do banco. Só as migrations usam (criam e alteram tabelas).
# - portalivp_app: usada pela API. Só lê e grava dados; não cria nem apaga tabelas.
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<EOSQL
  CREATE ROLE portalivp_owner LOGIN PASSWORD '$DB_OWNER_PASSWORD';
  CREATE ROLE portalivp_app LOGIN PASSWORD '$DB_APP_PASSWORD';

  -- A dona passa a ser dona do banco e do schema public.
  ALTER DATABASE $POSTGRES_DB OWNER TO portalivp_owner;
  ALTER SCHEMA public OWNER TO portalivp_owner;

  -- O app pode se conectar e usar o schema public.
  GRANT CONNECT ON DATABASE $POSTGRES_DB TO portalivp_app;
  GRANT USAGE ON SCHEMA public TO portalivp_app;

  -- Toda tabela que a dona criar (pelas migrations) já nasce liberada
  -- para o app ler e gravar dados.
  ALTER DEFAULT PRIVILEGES FOR ROLE portalivp_owner IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO portalivp_app;
  ALTER DEFAULT PRIVILEGES FOR ROLE portalivp_owner IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO portalivp_app;
EOSQL
