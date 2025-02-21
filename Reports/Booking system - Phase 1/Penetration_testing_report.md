# Penetration testing report

## 1. Introduction:

### Purpose and scope of the report.

Test for the registeration page

### Testing schedule and environment.

Virtualbo+Kali


### Scope of testing.
### Methods and tools used for testing.

Manual
Automated -> Zap

**Updated 21.2.2025**
Retest


## 2. Summary:
- Key findings and recommendations (3 main points). What should be addressed immediately?
- General assessment of the system’s security posture.

## 3. Findings and Categorization:
- A detailed description and categorization of identified deviations and vulnerabilities.
- Note: There should be a relatively high number of deviations and vulnerabilities.

Example Categories:
- Red (Critical): Deviations and vulnerabilities that can lead to major security breaches or system compromise.
    - xample: Gaining administrator privileges without authentication.
- Yellow (Medium): Vulnerabilities that can cause serious security issues but require specific conditions or combinations to exploit.
    - Example: XSS attack that can steal user data.
- Green (Low): Vulnerabilities that pose minor security issues or require highly specific conditions to exploit.
    - Example: Outdated software versions that are not currently vulnerable but may be in the future.

## 4. Appendices:
- ZAP report: App_first_test.md
- ZAP report: App_second_test.md