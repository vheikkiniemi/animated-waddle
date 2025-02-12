# Docker

## Client side

### Database

1. Download the file from: [Docker-compose](https://raw.githubusercontent.com/vheikkiniemi/animated-waddle/refs/heads/main/Booking%20system/Phase%201/docker-compose.yml)
2. Try to build and run the database: `docker compose -f 'docker-compose.yml' up -d --build 'database'`
3. Try to check the table structure: `docker exec -it cybersec-db-phase1-ver1 psql -U postgres -d postgres`
4. If something doesn't work, try: `docker compose logs`
5. If you want to delete the database `docker compose -f 'docker-compose.yml' down 'database'`

### Web

1. Download the file from (if it doesn't exists): [Docker-compose](https://raw.githubusercontent.com/vheikkiniemi/animated-waddle/refs/heads/main/Booking%20system/Phase%201/docker-compose.yml)
2. Try to build and run the web interface: `docker compose -f 'docker-compose.yml' up -d --build 'web'`
3. If something doesn't work, try: `docker compose logs`
4. If you want to delete the web interface: `docker compose -f 'docker-compose.yml' down 'web'`

### All in

1. Download the file from (if it doesn't exists): [Docker-compose](https://raw.githubusercontent.com/vheikkiniemi/animated-waddle/refs/heads/main/Booking%20system/Phase%201/docker-compose.yml)
2. Try to build and run: `docker compose up --build -d`
3. If something doesn't work, try: `docker compose logs`

## Dev side (teacher's notes)

### Database

- `docker compose -f 'docker-compose-dev.yml' up -d --build 'database'`
- `docker exec -it cybersec-db-phase1-ver1 psql -U postgres -d postgres`
- `docker compose -f 'docker-compose-dev.yml' down 'database'`

**Database folder**
- `docker build -t vheikkiniemi/cybersec-db-phase1-ver1 .`
- `docker push vheikkiniemi/cybersec-db-phase1-ver1`

### Web
- `docker compose -f 'docker-compose-dev.yml' up -d --build 'web'`
- `docker compose -f 'docker-compose-dev.yml' down 'web'`

**Root folder**
- `docker build -t vheikkiniemi/cybersec-web-phase1-ver1 .`
- `docker push vheikkiniemi/cybersec-web-phase1-ver1`

### All in
- `docker compose -f 'docker-compose-dev.yml' up --build -d`
- `docker compose -f 'docker-compose-dev.yml' stop`
- `docker compose -f 'docker-compose-dev.yml' down`

### Images
- `docker image ls`
- `docker rmi <image>`

### Volumes
- `docker volume ls`
- `docker volume rm <volume_name>`