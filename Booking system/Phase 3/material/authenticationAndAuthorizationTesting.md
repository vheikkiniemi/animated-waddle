# 🔐 Security Testing Cheat Sheet (Authn & Authz)

> [!NOTE]
> The material was created using the ChatGPT and CoPilot AI applications.

## 🔵 General Terms

| **Term**         | **Description**                                           |
|------------------|-----------------------------------------------------------|
| **Resource**     | Any protected asset: page, API endpoint, file, data       |
| **Endpoint**     | URL where HTTP requests are sent (e.g., `/api/users`)     |
| **Object/Asset** | Data entity (e.g., user, reservation, document)           |
| **Session**      | A user's authenticated state (cookie/token-based)         |

---

## 🟢 Authentication (Authn)

> Verifies **who** the user is.

- Protects login, token generation, and identity mechanisms.
- Ensures only valid users can create sessions.

### Common Targets:
- `/login`
- `/register`
- `/password-reset`
- `/auth/token`

---

## 🟡 Authorization (Authz)

> Controls **what** the user can access.

- Protects access to resources and actions based on roles.
- Prevents unauthorized operations (e.g., privilege escalation).

### Typical Scenarios:
- Admin-only pages (e.g., `/admin`, `/admin/users`)
- API actions restricted to specific roles (`PUT`, `DELETE`, `POST`)
- IDOR checks (`/profile?id=5`)

---

## 🔍 Testing Goals

- Can a **Guest** access protected resources?
- Can a **User** modify or access **other users' data**?
- Can a **Reserver** escalate to Admin functionalities?
- Are **API endpoints** protected as strictly as the UI?

---

✅ Combine with tools like **wfuzz**, **httpie**, **ffuf**, and **manual testing** for complete coverage.


## 🧪 Authorization & Authentication Test Cases

### 🔐 **Authentication Tests**

| **Test Case**                                      | **Expected Outcome**                     |
|----------------------------------------------------|------------------------------------------|
| Submit valid credentials at `/login`               | Successful login, session created        |
| Submit invalid credentials                         | Reject login, show error                 |
| Bypass login page via direct `/dashboard` URL      | Redirect to login page / show 401        |
| Attempt brute-force login (e.g., wfuzz POST)       | Lockout / rate-limiting triggered        |
| Check session expiration (idle/logout)             | Session invalidated after timeout        |

---

### 🛡 **Authorization Tests**

| **Test Case**                                                    | **Expected Outcome**                               |
|------------------------------------------------------------------|----------------------------------------------------|
| Access admin-only page `/admin` as Guest                         | 401/403 Unauthorized                               |
| Access admin-only page `/admin` as Reserver                      | 401/403 Unauthorized                               |
| Access `/reservation` as Guest                                   | 401/403 Unauthorized                               |
| Access `/reservation` as Reserver                                | ✅ Allowed                                         |
| Access `/api/users/2` as User 1 (IDOR test)                      | Data not accessible / 403                          |
| Submit POST `/admin/users` to create user as non-admin           | 403 Forbidden                                      |
| Attempt horizontal escalation: cancel another user’s reservation | 403 Forbidden or “not found”                       |
| Test APIs (`PUT`, `DELETE`) with Reserver privileges             | Should be restricted where necessary               |

---

### ⚠️ **Bonus tests**

| **Scenario**                                  | **Expected Outcome**           |
|-----------------------------------------------|--------------------------------|
| Replay a CSRF-protected form without token    | 403 Forbidden                  |
| Access deprecated or hidden endpoints         | Should still be secured        |
| Fuzz hidden parameters (`role=admin`)         | Should have no unauthorized effect |

---

🎯 **Pro tip:** Repeat tests as Guest, Authenticated User, and Admin for full matrix coverage!
