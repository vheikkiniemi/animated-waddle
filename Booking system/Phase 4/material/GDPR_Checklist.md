# GDPR Compliance Checklist – Web-based Booking System

## 1 Personal data mapping and minimization
**1.1** [✅/❌/⚠️] Have all personal data collected and processed in the system been identified? (e.g., name, email, age, username)  
**1.2** [✅/❌/⚠️] Have you ensured that only necessary personal data is collected (data minimization)?  
**1.3** [✅/❌/⚠️] Is user age recorded to verify that the booker is over 15 years old?  

## 2 User registration and management  
**2.1** [✅/❌/⚠️] Does the registration form (page) include GDPR-compliant consent for processing personal data (e.g., acceptance of the privacy policy)?  
**2.2** [✅/❌/⚠️] Can users view, edit, and delete their own personal data via their account?  
**2.3** [✅/❌/⚠️] Is there a mechanism for the administrator to delete a reserver in accordance with the "right to be forgotten"?  
**2.4** [✅/❌/⚠️] Is underage registration (under 15 years) and booking functionality restricted?  

## 3 Booking visibility  
**3.1** [✅/❌/⚠️] Are bookings visible to non-logged-in users only at the resource level (without any personal data)?  
**3.2** [✅/❌/⚠️] Is it ensured that names, emails, or other personal data of bookers are not exposed publicly or to unauthorized users?  

## 4 Access control and authorization  
**4.1** [✅/❌/⚠️] Have you ensured that only administrators can add, modify, and delete resources and bookings?  
**4.2** [✅/❌/⚠️] Is the system using role-based access control (e.g., reserver vs. administrator)?  
**4.3** [✅/❌/⚠️] Are administrator privileges limited to ensure GDPR compliance (e.g., administrators cannot use data for unauthorized purposes)?  

## 5 Privacy by Design Principles  
**5.1** [✅/❌/⚠️] Has Privacy by Default been implemented (e.g., collecting the minimum data by default)?  
**5.2** [✅/❌/⚠️] Are secure practices used (e.g., HTTPS, password hashing)?  
**5.3** [✅/❌/⚠️] Are logs implemented without unnecessarily storing personal data?  
**5.4** [✅/❌/⚠️] Are forms and system components designed with data protection in mind (e.g., secured login, minimal fields)?  

## 6 Data security and DPIA  
**6.1** [✅/❌/⚠️] Have potential security risks been assessed (e.g., DPIA if required)?  
**6.2** [✅/❌/⚠️] Are CSRF, XSS, and SQL injection protections implemented?  
**6.3** [✅/❌/⚠️] Are passwords securely hashed using a strong algorithm (e.g., bcrypt, Argon2)?  
**6.4** [✅/❌/⚠️] Are data backup and recovery processes GDPR-compliant?  
**6.5** [✅/❌/⚠️] Is personal data stored in data centers located within the EU?

## 7 Data anonymization and pseudonymization  
**7.1** [✅/❌/⚠️] Is personal data anonymized where possible?  
**7.2** [✅/❌/⚠️] Are pseudonymization techniques used to protect data while maintaining its utility?  

## 8 Data subject rights  
**8.1** [✅/❌/⚠️] Can users download or request all personal data related to them (data access request)?  
**8.2** [✅/❌/⚠️] Is there an interface or process for users to request the deletion of their personal data?  
**8.3** [✅/❌/⚠️] Can users withdraw their consent for data processing?  

## 9 Documentation and communication  
**9.1** [✅/❌/⚠️] Is there a privacy policy available to users during registration and easily accessible?  
**9.2** [✅/❌/⚠️] Are administrators and developers provided with documented data protection practices and processing activities?  
**9.3** [✅/❌/⚠️] Is there a documented data breach response process (e.g., how to notify authorities and users of a breach)?  

---

**Symbols used:**  
✅ Pass (a note can be added)  
❌ Fail (a note can be added)  
⚠️ Attention (a note can be added)
