# 🔐 The Booking system - Phase 4

> [!NOTE]
> The material was created with the help of ChatGPT and Copilot.

## Initial scenario

> [!NOTE]  
> As a reminder

**You are a novice penetration tester at a company. Your company should implement the following application (specs):**  

1. The system is accessed via a web browser.  
2. Users can register and, after registration, log in to the system.  
3. A registered and logged-in user acts as either a resource reserver or an administrator.  
4. The administrator can add, remove, and modify resources and reservations.  
5. The administrator can delete the reserver.  
6. A reserver can book a resource if they are over 15 years old.  
7. Resources can be booked on an hourly basis.  
8. The booking system displays booked resources without requiring login, but does not show the reserver's identity  
9. The client, your company, requires that the system complies with GDPR regulations.  
10. The system provider has stated that the software is developed following the Privacy by Design (PbD) principle.  

**In the previous phase, the theme was authorization. In this phase, we focus on GDPR compliance.**

# 🧩 Steps for this assignment

**1. Check out the background material**  
- [Basics of the GDPR (in English)](./material/GDPR_in_brief.md)  
- [GDPR:n perusteet (in Finnish)](./material/GDPR_lyhyesti.md)

**2. Make sure you have the latest version from the application**
- Check:  [The application to docker - Client side](#the-application-to-docker---client-side)

**3. Create a new page on Github (markdown) and add the table found in the link below to the page**  
- [GDPR Checklist](./material/GDPR_Checklist.md)

**4. Go through the checklist you made in the previous step**

**5. Check the app's privacy policy**
- You can find it under the name Privacy Policy or at the link `/privacypolicy`
- If the privacy policy page is blank:
  - Create a new page on Github (markdown) ➡️ Name privacypolicy.md
  - Create content for the privacy policy (you can use AI tools, but make sure the content is appropriate)

**6. Check the app's terms of servie**
- You can find it under the name Terms os Service or at the link `/terms`
- If the terms of service page is blank:
  - Create a new page on Github (markdown) ➡️ Name termsofservice.md
  - Create content for the Terms of Service (you can use AI tools, but make sure the content is appropriate)

**7. Check the app's cookie policy**
- You can find it under the name Cookie Policy or at the link `/cookiepolicy`
- If the Cookie Policy page is blank:
  - Create a new page on Github (markdown) ➡️ Name cookiepolicy.md
  - Create content for the Cookie Policy (you can use AI tools, but make sure the content is appropriate)
  - [Check this too (cookieyes.com)](https://www.cookieyes.com/blog/session-cookies/)

---

# 🔨 Application deployment

## ⛓️ The application to docker - Client side

**1. Download the file from (if it doesn't exists): [Docker-compose](https://raw.githubusercontent.com/vheikkiniemi/animated-waddle/refs/heads/main/Booking%20system/Phase%204/docker-compose.yml)**  
**2. Try to build and run: `docker compose up --build -d`**  
**3. If something doesn't work, try: `docker compose logs`**  
**4. If you want to stop all, try: `docker compose stop`**  
**5. If you want to delete all, try: `docker compose down --volumes`**

---

## 🛡️ The application to docker - Dev side (teacher's notes)

### ⚒️ Database

**Building a local container**
```bash
docker compose -f 'docker-compose-dev.yml' up -d --build 'database'
```

**Taking a database connection**
```bash
docker exec -it cybersec-db-phase4 psql -U postgres -d postgres
```

**Deleting a local container**
```bash
docker compose -f 'docker-compose-dev.yml' down 'database' --volumes
```

**Database folder ➡️ Building and pushing a multi-arch container**
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t vheikkiniemi/cybersec-db-phase4:v1.0 --push .
```

### 🪜 Web
**Building a local container**
```bash
docker compose -f 'docker-compose-dev.yml' up -d --build 'web'
```

**Deleting a local container**
```bash
docker compose -f 'docker-compose-dev.yml' down 'web' --volumes
```

**Index `/` folder ➡️ Building and pushing a multi-arch container**
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t vheikkiniemi/cybersec-web-phase4:v1.0 --push .
```


### 🧲 All in
**Building a local container**
```bash
docker compose -p cybersec-phase4 -f 'docker-compose-dev.yml' up --build -d
```

**Stopping a local container**
```bash
docker compose -f 'docker-compose-dev.yml' stop
```

**Deleting a local container**
```bash
docker compose -p cybersec-phase4 -f 'docker-compose-dev.yml' down --volumes
```

### 🛠️ Images
**Showing local images**
```bash
docker image ls
```

**Deleting a local image**
```bash
docker rmi <image>
```

**Deleting all unused images**
```bash
docker image prune -a
```

### 🔧 Volumes
**Showing local volumes**
```bash
docker volume ls
```

**Deleting a local volume**
```bash
docker volume rm <volume_name>
```