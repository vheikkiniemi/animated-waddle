# GDPR Compliance Checklist – Web-based Booking System

| **Result** | **Personal data mapping and minimization** |
| :--------: | :--- |
| ✅/❌/⚠️ | Have all personal data collected and processed in the system been identified? (e.g., name, email, age, username) |
| ✅/❌/⚠️ | Have you ensured that only necessary personal data is collected (data minimization)? |
| ✅/❌/⚠️ | Is user age recorded to verify that the booker is over 15 years old? |

---

| **Result** | **User registration and management** |
| :--------: | :--- |
| ✅/❌/⚠️ | Does the registration form (page) include GDPR-compliant consent for processing personal data (e.g., acceptance of the privacy policy)?|
| ✅/❌/⚠️ | Can users view, edit, and delete their own personal data via their account? |
| ✅/❌/⚠️ | Is there a mechanism for the administrator to delete a reserver in accordance with the "right to be forgotten"? |
| ✅/❌/⚠️ | Is underage registration (under 15 years) and booking functionality restricted? |

---

| **Result** | **Booking visibility** |
| :----: | :--- |
| ✅/❌/⚠️ | Are bookings visible to non-logged-in users only at the resource level (without any personal data)? |
| ✅/❌/⚠️ | Is it ensured that names, emails, or other personal data of bookers are not exposed publicly or to unauthorized users? |

--- 

| **Result** | **Access control and authorization** |
| :----: | :--- |
| ✅/❌/⚠️ | Have you ensured that only administrators can add, modify, and delete resources and bookings? |
| ✅/❌/⚠️ | Is the system using role-based access control (e.g., reserver vs. administrator)? |
| ✅/❌/⚠️ | Are administrator privileges limited to ensure GDPR compliance (e.g., administrators cannot use data for unauthorized purposes)? |

---

| **Result** | **Privacy by Design Principles** |
| :----: | :--- |
| ✅/❌/⚠️ | Has Privacy by Default been implemented (e.g., collecting the minimum data by default)? |
| ✅/❌/⚠️ | Are logs implemented without unnecessarily storing personal data? |
| ✅/❌/⚠️ | Are forms and system components designed with data protection in mind (e.g., secured login, minimal fields)? |

---

| **Result** | **Data security** |
| :----: | :--- |
| ✅/❌/⚠️ | Are CSRF, XSS, and SQL injection protections implemented? |
| ✅/❌/⚠️ | Are passwords securely hashed using a strong algorithm (e.g., bcrypt, Argon2)? |
| ✅/❌/⚠️ | Are data backup and recovery processes GDPR-compliant? |
| ✅/❌/⚠️ | Is personal data stored in data centers located within the EU? |

---

| **Result** | **Data anonymization and pseudonymization** |
| :----: | :--- |
| ✅/❌/⚠️ | Is personal data anonymized where possible? |
| ✅/❌/⚠️ | Are pseudonymization techniques used to protect data while maintaining its utility? |

---

| **Result** | **Data subject rights** |
| :----: | :--- |
| ✅/❌/⚠️ | Can users download or request all personal data related to them (data access request)? |
| ✅/❌/⚠️ | Is there an interface or process for users to request the deletion of their personal data? |
| ✅/❌/⚠️ | Can users withdraw their consent for data processing? |

---

| **Result** | **Documentation and communication** |
| :----: | :--- |
| ✅/❌/⚠️ | Is there a privacy policy available to users during registration and easily accessible? |
| ✅/❌/⚠️ | Are administrators and developers provided with documented data protection practices and processing activities? |
| ✅/❌/⚠️ | Is there a documented data breach response process (e.g., how to notify authorities and users of a breach)? |

---

**Symbols used:**  
✅ Pass (a note can be added)  
❌ Fail (a note can be added)  
⚠️ Attention (a note can be added)