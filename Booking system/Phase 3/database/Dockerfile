# Use the official PostgreSQL image as the base
FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=Secret1234!
ENV POSTGRES_DB=postgres

# Copy initialization scripts into the container
COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432

# Building and pushing example
# docker build -t vheikkiniemi/cybersec-db-phase1-ver2 .
# docker push vheikkiniemi/cybersec-db-phase1-ver2