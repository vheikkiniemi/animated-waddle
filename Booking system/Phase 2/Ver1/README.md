# Docker

**Cybersecurity and data privacy - Booking system - Phase 2**

## Client side

> [!NOTE] 
> Multi-platform support is now in the testing phase. If you use macOS try this: [Docker-compose](https://raw.githubusercontent.com/vheikkiniemi/animated-waddle/refs/heads/main/Booking%20system/Phase%202/Ver1/docker-compose-multi.yml)
> Try to build and run: `docker compose up --build -d`
> If something doesn't work, try: `docker compose logs`

### Database

1. Download the file from: [Docker-compose](https://raw.githubusercontent.com/vheikkiniemi/animated-waddle/refs/heads/main/Booking%20system/Phase%202/Ver1/docker-compose.yml)
2. Try to build and run the database: `docker compose -f 'docker-compose.yml' up -d --build 'database'`
3. Try to check the table structure: `docker exec -it cybersec-db-phase2 psql -U postgres -d postgres`
4. If something doesn't work, try: `docker compose logs`
5. If you want to delete the database `docker compose -f 'docker-compose.yml' down 'database'`

### Web

1. Download the file from (if it doesn't exists): [Docker-compose](https://raw.githubusercontent.com/vheikkiniemi/animated-waddle/refs/heads/main/Booking%20system/Phase%202/Ver1/docker-compose.yml)
2. Try to build and run the web interface: `docker compose -f 'docker-compose.yml' up -d --build 'web'`
3. If something doesn't work, try: `docker compose logs`
4. If you want to delete the web interface: `docker compose -f 'docker-compose.yml' down 'web'`

### All in

1. Download the file from (if it doesn't exists): [Docker-compose](https://raw.githubusercontent.com/vheikkiniemi/animated-waddle/refs/heads/main/Booking%20system/Phase%202/Ver1/docker-compose.yml)
2. Try to build and run: `docker compose up --build -d`
3. If something doesn't work, try: `docker compose logs`

## Dev side (teacher's notes)

### Database

- `docker compose -f 'docker-compose-dev.yml' up -d --build 'database'`
- `docker exec -it cybersec-db-phase2 psql -U postgres -d postgres`
- `docker compose -f 'docker-compose-dev.yml' down 'database' --volumes`

**Database folder**

- `docker build -t vheikkiniemi/cybersec-db-phase2:v1.0 .`
- `docker push vheikkiniemi/cybersec-db-phase2:v1.0`

> **Multi-platform**
- `docker buildx build --platform linux/amd64,linux/arm64 -t vheikkiniemi/cybersec-db-phase2:v1.1 --push .`

### Web
- `docker compose -f 'docker-compose-dev.yml' up -d --build 'web'`
- `docker compose -f 'docker-compose-dev.yml' down 'web' --volumes`

**Root folder**
- `docker build -t vheikkiniemi/cybersec-web-phase2:v1.0 .`
- `docker push vheikkiniemi/cybersec-web-phase2:v1.0`

> **Multi-platform**
- `docker buildx build --platform linux/amd64,linux/arm64 -t vheikkiniemi/cybersec-web-phase2:v1.1 --push .`

### All in
- `docker compose -p cybersec-phase2 -f 'docker-compose-dev.yml' up --build -d`
- `docker compose -f 'docker-compose-dev.yml' stop`
- `docker compose -p cybersec-phase2 -f 'docker-compose-dev.yml' down --volumes`

### Images
- `docker image ls`
- `docker rmi <image>`
- All unused: `docker image prune -a`

### Volumes
- `docker volume ls`
- `docker volume rm <volume_name>`