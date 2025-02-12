# Docker


docker compose -f 'docker-compose.yml' up -d --build 'database'
docker exec -it cybersec-db-phase1-ver1 psql -U postgres -d postgres
docker compose -f 'docker-compose.yml' down 'database'

docker compose -f 'docker-compose.yml' up -d --build 'web'
docker compose -f 'docker-compose.yml' down 'web'

docker-compose up --build -d
 docker-compose down


docker build -t vheikkiniemi/cybersec-db-phase1-ver1 .
docker push vheikkiniemi/cybersec-db-phase1-ver1

docker build -f Dockerfile.database -t vheikkiniemi/cybersec-db-phase1-ver1 .
docker build -f Dockerfile-web -t vheikkiniemi/cybersec-web-phase1-ver1 .

docker build -t vheikkiniemi/cybersec-phase1-ver1 .
docker push vheikkiniemi/cybersec-phase1-ver1

## Client side

1. Load 
docker compose up --build -d

docker compose logs

# Booking system - Phase 1

docker compose -f 'docker-compose.yml' up -d --build 'database'
docker stop cybersec-db-phase1-ver1
docker compose -f 'docker-compose.yml' down 'database'

docker compose -f 'docker-compose.yml' up -d --build 'web'
docker stop cybersec-web-phase1-ver1
docker compose -f 'docker-compose.yml' down 'web'





docker-compose up --build

docker-compose build --no-cache --pull

docker build --no-cache .

docker compose up --build --no-cache -d

docker compose stop
docker compose down

docker build -t vheikkiniemi/cybersec-phase1-ver1 .
docker push vheikkiniemi/cybersec-phase1-ver1

docker tag local-image:tagname new-repo:tagname
docker push new-repo:tagname

docker build -t web:cybersec-phase1-ver1 .
docker run -p 127.0.0.1:8000:8000 web:cybersec-phase1-ver1
docker tag web vheikkiniemi/web
docker push vheikkiniemi/web

docker build -t database:cybersec-phase1-ver1 .
docker run -p 127.0.0.1:5432:5432 database:cybersec-phase1-ver1
docker tag database vheikkiniemi/database
docker push vheikkiniemi/database