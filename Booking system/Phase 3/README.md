

# The Booking system - Phase 3

## Initial scenario

> [!NOTE]  
> As a reminder

**You are a novice penetration tester at a company. Your company has commissioned the following software:**  

✅ The system is accessed via a web browser.  
✅ Users can register and, after registration, log in to the system.  
✅ A registered and logged-in user acts as either a resource reserver or an administrator.  
✅ The administrator can add, remove, and modify resources and reservations.  
✅ The administrator can delete the reserver.  
✅ A reserver can book a resource if they are over 15 years old.  
✅ Resources can be booked on an hourly basis.  
✅ The booking system displays booked resources without requiring login, but does not show the reserver's identity  
✅ The client, your company, requires that the system complies with GDPR regulations.  
✅ The system provider has stated that the software is developed following the Privacy by Design (PbD) principle.  

## Testing authorizaion

**In the previous phase, the theme was authentication. In this phase, we focus on authorization, which is what typically happens after authentication.**

## Pages
1. http://localhost:8000/register
2. http://localhost:8000/login
3. http://localhost:8000/logout
4. http://localhost:8000/resources
5. http://localhost:8000/reservation
6. http://localhost:8000/resourcesList


| **Page / Feature** | **Guest** | **Reserver** | **Administrator** |
|:----|:----:|:----:|:----:|
| `/` (index)                | | | |
| └─ View resource form      | ❌ | ✅ | ✅ |
| └─ Create new resource     | ❌ | ❌ | ✅ |
| └─ Edit existing resource  | ❌ | ❌ | ✅ |
| └─ Delete resource         | ❌ | ❌ | ✅ |



✅ Pass
❌ Fail
⚠️ Attention

## Client side

### Database

1. Download the file from: [Docker-compose](https://raw.githubusercontent.com/vheikkiniemi/animated-waddle/refs/heads/main/Booking%20system/Phase%203/docker-compose.yml)
2. Try to build and run the database: `docker compose -f 'docker-compose.yml' up -d --build 'database'`
3. Try to check the table structure: `docker exec -it cybersec-db-phase3 psql -U postgres -d postgres`
4. If something doesn't work, try: `docker compose logs`
5. If you want to delete the database `docker compose -f 'docker-compose.yml' down 'database' --volumes`

### Web

1. Download the file from (if it doesn't exists): [Docker-compose](https://raw.githubusercontent.com/vheikkiniemi/animated-waddle/refs/heads/main/Booking%20system/Phase%203/docker-compose.yml)
2. Try to build and run the web interface: `docker compose -f 'docker-compose.yml' up -d --build 'web'`
3. If something doesn't work, try: `docker compose logs`
4. If you want to delete the web interface: `docker compose -f 'docker-compose.yml' down 'web' --volumes`

### All in

1. Download the file from (if it doesn't exists): [Docker-compose](https://raw.githubusercontent.com/vheikkiniemi/animated-waddle/refs/heads/main/Booking%20system/Phase%203/docker-compose.yml)
2. Try to build and run: `docker compose up --build -d`
3. If something doesn't work, try: `docker compose logs`
4. If you want to stop all, try: `docker compose stop`
5. If you want to delete all, try: `docker compose down --volumes`

## Dev side (teacher's notes)

### Database

- `docker compose -f 'docker-compose-dev.yml' up -d --build 'database'`
- `docker exec -it cybersec-db-phase3 psql -U postgres -d postgres`
- `docker compose -f 'docker-compose-dev.yml' down 'database' --volumes`

**Database folder**

- `docker build -t vheikkiniemi/cybersec-db-phase3:v1.0 .`
- `docker push vheikkiniemi/cybersec-db-phase3:v1.0`

> **Multi-platform**
- `docker buildx build --platform linux/amd64,linux/arm64 -t vheikkiniemi/cybersec-db-phase3:v1.0 --push .`

### Web
- `docker compose -f 'docker-compose-dev.yml' up -d --build 'web'`
- `docker compose -f 'docker-compose-dev.yml' down 'web' --volumes`

**Root folder**
- `docker build -t vheikkiniemi/cybersec-web-phase3:v1.0 .`
- `docker push vheikkiniemi/cybersec-web-phase3:v1.0`

> **Multi-platform**
- `docker buildx build --platform linux/amd64,linux/arm64 -t vheikkiniemi/cybersec-web-phase3:v1.0 --push .`

### All in
- `docker compose -p cybersec-phase3 -f 'docker-compose-dev.yml' up --build -d`
- `docker compose -f 'docker-compose-dev.yml' stop`
- `docker compose -p cybersec-phase3 -f 'docker-compose-dev.yml' down --volumes`

### Images
- `docker image ls`
- `docker rmi <image>`
- All unused: `docker image prune -a`

### Volumes
- `docker volume ls`
- `docker volume rm <volume_name>`