# The Booking system - Phase 3

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

**In the previous phase, the theme was authentication. In this phase, we focus on authorization, which is what typically happens after authentication.**

# Web Page Structures and Functionalities for Authorization Testing

## 🧩 1. Web Page Structure

A web application is typically divided into **URLs** (routes) and **HTTP methods** that define how users interact with the application.

### Common structure:
- **Public pages** (accessible without login)
  - `/`
  - `/login`
  - `/register`
- **Protected pages** (require authentication)
  - `/resources`
  - `/reservation`
  - `/profile`
- **Admin/privileged pages**
  - `/admin/users`
  - `/admin/settings`

---

## 🛠 2. Typical Functionalities to Test

| **Type**              | **Examples**                                 |
|-----------------------|----------------------------------------------|
| View content          | Dashboard, listings, read-only pages         |
| Form submissions      | Login, registration, create/edit resources   |
| Data modification     | Edit profiles, create reservations, delete   |
| Privileged actions    | User management, access control, settings    |
| API calls             | `/api/*` endpoints for frontend/backend      |

---

## 🔐 3. What to Focus on in Authorization Testing

### ✅ **Access Control Rules**
- Can **unauthenticated users** (Guests) access protected pages?
- Can **Reserver** role access Admin-only functions?
- Are **API endpoints** enforcing role-based restrictions?

### ✅ **Horizontal Privilege Escalation**
- Can user A access or modify data of user B?
  - e.g., `/api/reservations/1` or `/profile?id=5`

### ✅ **Vertical Privilege Escalation**
- Can a low-privilege user (e.g., Reserver) perform Admin actions?
  - Submit forms to `/admin` routes
  - Modify user roles via hidden parameters

---

## 🔍 4. Testing Approach

1. **Map pages & APIs**
   - Use tools like **wfuzz**, **ffuf**, or **dirb** to discover hidden paths.
   - Map both **GET** and **POST** endpoints.

2. **Test as different roles**
   - Guest (unauthenticated)
   - Authenticated user (e.g., Reserver)
   - Administrator

3. **Inspect functions on each page**
   - Buttons, forms, APIs, links
   - Backend-side restrictions (not just hidden in UI)

---

## 🎯 5. Goal of Authorization Testing

- Ensure **least privilege** principle (users can only do what they should).
- Detect **bypass vectors** (direct object references, hidden APIs).
- Confirm both **frontend** and **backend** enforce authorization properly.

---

> Tip: Combine **manual testing** and **automated fuzzing** for maximum coverage!


# Authorization testing steps for this assignment

**1. Make sure you have the latest version from the application**
- It is recommended [that Kali](https://www.kali.org/) is installed as a virtual machine.
- Check:  [The application to docker - Client side](#the-application-to-docker---client-side)

---

**2. Create a new page on Github (markdown) and add the following table to the page**

| **Page / Feature** | **Guest** | **Reserver** | **Administrator** |
|:----|:----:|:----:|:----:|
| `/` (index)                | | | |
| └─ View resource form      | ❌ | ✅ | ✅ note added |
| └─ Create new resource     | ❌ *1 | ❌ *2 | ✅ *3 |

**Symbols used:**  
✅ Pass (a note can be added)  
❌ Fail (a note can be added)  
⚠️ Attention (a note can be added)

**You can also make notes like this:**  
1. Add some note to this.
2. Add some note to this.
3. Add some note to this.

**At this point, you need a table as a template. You will add content during the test.**

---

**3. First testing technique: Browser**
- Familiarize yourself with the functionality of the version as comprehensively as possible.
  - create users with different roles
  - make reserveable resources
  - make reservations
  - ...
- **Fill in the table as the testing progresses.**

---

**4. Second testing technique: ZAP**
- Check what kind of alerts are found in the version.

> [!NOTE]  
> Do a broader test because there are now more pages. 
> Make sure all pages are tested.
> **Check lecture recording**

- **Save the ZAP report in markdown format.**
- **Fill in the table as the testing progresses.**
  - The test can find new pages, for example

---

**5. Third testing technique: wfuzz and http**
- Try to find new pages using wfuzz and http commands.
- **Fill in the table as the testing progresses.**
- You can use, for example, the following commands:

**What kind of pages can be found using common words?**
```bash
wfuzz -c -w /usr/share/wordlists/dirb/common.txt --hc 404 http://localhost:8000/FUZZ
```

**Is there an API folder and pages under it?**
```bash
wfuzz -c -w /usr/share/wordlists/dirb/common.txt --hc 404 http://localhost:8000/api/FUZZ
```

**Are there any pages in the reservations folder whose name is a number between 1-1000?**
```bash
wfuzz -c -z range,1-1000 --hc 404 http://localhost:8000/api/reservations/FUZZ
```

**When the page is found, then what the page contains?**
```bash
http http://localhost:8000/api/reservations/1  
```

---

**OPTIONAL technique: Manual code review**
- You can find the application code in this same git repo.
- Review the code.
- **Fill in the table as the testing progresses.**

---

**6. The final step of the test**  

✔️ At this point you should have a comprehensive list of available pages.  
✔️ The first column of the table should contain **all the pages** found.  
✔️ In addition, the pages should already have **functions connected to them.**  
✔️ Functions should be linked to **roles.**  
✔️ Following an iterative approach **repeat browser testing.**

**`1. Go through the application and compare the functions with the table`**  
**`2. If something needs to be changed in the table, change it.`**

🎯 **Now you should have a table that shows what resources (pages) and functions are in the application and who can use them.**  
✅ **Add to the table as a note which application specs are met (especially items 1-8).**

---

# Application deployment

## The application to docker - Client side

**1. Download the file from (if it doesn't exists): [Docker-compose](https://raw.githubusercontent.com/vheikkiniemi/animated-waddle/refs/heads/main/Booking%20system/Phase%203/docker-compose.yml)**  
**2. Try to build and run: `docker compose up --build -d`**  
**3. If something doesn't work, try: `docker compose logs`**  
**4. If you want to stop all, try: `docker compose stop`**  
**5. If you want to delete all, try: `docker compose down --volumes`**

---

## The application to docker - Dev side (teacher's notes)

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


> [!NOTE]  
> [symbols](https://github.com/ikatyang/emoji-cheat-sheet)