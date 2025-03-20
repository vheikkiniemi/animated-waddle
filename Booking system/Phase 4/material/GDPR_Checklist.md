# GDPR Compliance Checklist – Web-based Booking System

## 1. Personal Data Mapping and Minimization
[ ] Have all personal data collected and processed in the system been identified? (e.g., name, email, age, username)  
[ ] Have you ensured that only necessary personal data is collected (data minimization)?  
[ ] Is user age recorded to verify that the booker is over 15 years old?  

## 2. User Registration and Management
[ ] Does the registration form (page) include GDPR-compliant consent for processing personal data (e.g., acceptance of the privacy policy)?  
[ ] Can users view, edit, and delete their own personal data via their account?  
[ ] Is there a mechanism for the admin to delete a booker in accordance with the "right to be forgotten"?  
[ ] Is underage registration (under 15 years) and booking functionality restricted?  

## 3. Booking Visibility
[ ] Are bookings visible to non-logged-in users only at the resource level (without any personal data)?  
[ ] Is it ensured that names, emails, or other personal data of bookers are not exposed publicly or to unauthorized users?  

## 4. Access Control and Authorization
[ ] Have you ensured that only admins can add, modify, and delete resources and bookings?  
[ ] Is the system using role-based access control (e.g., booker vs. admin)?  
[ ] Are admin privileges limited to ensure GDPR compliance (e.g., admins cannot use data for unauthorized purposes)?  

## 5. Privacy by Design Principles
- [ ] Has Privacy by Default been implemented (e.g., collecting the minimum data by default)?
- [ ] Are secure practices used (e.g., HTTPS, password hashing)?
- [ ] Are logs implemented without unnecessarily storing personal data?
- [ ] Are forms and system components designed with data protection in mind (e.g., secured login, minimal fields)?

## 6. Data Security and DPIA
- [ ] Have potential security risks been assessed (e.g., DPIA if required)?
- [ ] Are CSRF, XSS, and SQL injection protections implemented?
- [ ] Are passwords securely hashed using a strong algorithm (e.g., bcrypt, Argon2)?
- [ ] Are data backup and recovery processes GDPR-compliant?

## 7. Data Subject Rights
- [ ] Can users download or request all personal data related to them (data access request)?
- [ ] Is there an interface or process for users to request the deletion of their personal data?
- [ ] Can users withdraw their consent for data processing?

## 8. Documentation and Communication
- [ ] Is there a privacy policy available to users during registration and easily accessible?
- [ ] Are admins and developers provided with documented data protection practices and processing activities?
- [ ] Is there a documented data breach response process (e.g., how to notify authorities and users of a breach)?

## 9. Third-Party Services and Subcontractors
- [ ] Are third-party services (e.g., cloud services, analytics) used, and do you have GDPR-compliant agreements (DPA) with them?
- [ ] Have you assessed external services (e.g., CDN, email services) regarding data processing and location from a GDPR perspective?

---

**Symbols used:**  
✅ Pass (a note can be added)  
❌ Fail (a note can be added)  
⚠️ Attention (a note can be added)

### Tip for your project:
Since this system is web-based and has a public-facing component, pay special attention to preventing accidental exposure of personal data. For example, the booking calendar should not show the booker’s personal details to non-logged-in users.
