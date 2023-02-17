\echo 'Delete and recreate tripcards db?'
\prompt 'Return for yes or control-C to cancel > ' follows


DROP DATABASE tripcards;
CREATE DATABASE tripcards;
\connect tripcards

\i tripcards-schema.sql
\i tripcards-seed.sql

\echo 'Delete and recreate tripcards_test db?'
\prompt 'Return for yes or control-C to cancel > ' follows


DROP DATABASE tripcards_test;
CREATE DATABASE tripcards_test;
\connect tripcards_test

\i tripcards-schema.sql