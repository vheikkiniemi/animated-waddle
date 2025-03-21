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
# docker buildx build --platform linux/amd64,linux/arm64 -t vheikkiniemi/cybersec-db-phase4:v1.0 --push .