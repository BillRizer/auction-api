FROM postgres:12-alpine

COPY pre-load.sql /docker-entrypoint-initdb.d/
COPY ./seeds /seeds
COPY ./import-seed.sh /
RUN chmod +x import-seed.sh
RUN /import-seed.sh
