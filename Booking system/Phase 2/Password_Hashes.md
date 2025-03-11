# 🔐 Password Hashing with Node.js  
This guide explains how to hash passwords using **MD5, SHA1, SHA256, Bcrypt, and Argon2** in **Node.js**.

## 🚀 **1. Installation**  
Before running the script, install the necessary dependencies.

```bash
# Install Node
sudo apt install nodejs npm

# Create a new project (optional)
mkdir password-hasher && cd password-hasher
npm init -y

# Install required dependencies
npm install bcryptjs argon2
```

If using **ES Modules (`import`)**, update `package.json` to include:

```json
{
  "type": "module"
}
```

## 📜 **2. Node.js Script (`hashs.mjs`)**  
Create a file **`hashs.mjs`** and add the following code:

```javascript
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import argon2 from "argon2";

// Function to hash password
async function hashPassword(password) {
    // MD5
    const md5Hash = crypto.createHash('md5').update(password).digest('hex');

    // SHA1
    const sha1Hash = crypto.createHash('sha1').update(password).digest('hex');

    // SHA256
    const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');

    // Bcrypt
    const bcryptHash = await bcrypt.hash(password, 10);

    // Argon2
    const argon2Hash = await argon2.hash(password);

    return { md5Hash, sha1Hash, sha256Hash, bcryptHash, argon2Hash };
}

// Get password from command line argument
const password = process.argv[2] || "mypassword";

hashPassword(password).then(hashes => {
    console.log(`MD5: ${hashes.md5Hash}`);
    console.log(`SHA1: ${hashes.sha1Hash}`);
    console.log(`SHA256: ${hashes.sha256Hash}`);
    console.log(`Bcrypt: ${hashes.bcryptHash}`);
    console.log(`Argon2: ${hashes.argon2Hash}`);
}).catch(err => console.error("Error:", err));
```

## ▶ **3. Run the Script**  
Run the script and pass a password as an argument.

```bash
node hashs.mjs "mypassword"
```

### ✅ **Example Output**
```bash
MD5: 34819d7beeabb9260a5c854bc85b3e44
SHA1: 91dfd9ddb4198affc5c194cd8ce6d338fde470e2
SHA256: 89e01536ac207279409d4de1e5253e01f4a1769e696db0d6062ca9b8f56767c8
Bcrypt: $2b$10$iYvOj6y1kLHWmTDY6MSSkOsb6fisqPyoIQYfQO7jvZLeLTgM67NuS
Argon2: $argon2id$v=19$m=65536,t=3,p=4$F3t8M593zaFekDDW9x0hGA$MqlzTq5Iy1m9kHgYBsBpFYfCHqHgIisUMyNOxlIVJyk
```

🔹 **Note:** Bcrypt and Argon2 hashes **change every time** because they include a unique **random salt**.

## ✅ **4. Verifying a Password**
To verify if a password matches a **Bcrypt** or **Argon2** hash, use:

### 🔑 **Bcrypt Verification**
```javascript
const storedHash = "$2b$10$iYvOj6y1kLHWmTDY6MSSkOsb6fisqPyoIQYfQO7jvZLeLTgM67NuS";
bcrypt.compare("mypassword", storedHash, (err, result) => {
    console.log("Bcrypt Match:", result);  // Output: true
});
```

### 🔑 **Argon2 Verification**
```javascript
const storedHash = "$argon2id$v=19$m=65536,t=3,p=4$niddXHQXIYNrBcsp+zkPdw$/CPIRv2cCDF6Xw7PseVtvJHD50Iuwvhr2g/RxgEy/K4";
argon2.verify(storedHash, "mypassword").then(match => {
    console.log("Argon2 Match:", match);  // Output: true
});
```

# 🔐 **Understanding Password Hashing Differences**

## ✅ **Why Do MD5, SHA1, and SHA256 Stay the Same?**
- **MD5, SHA1, and SHA256** are **deterministic** cryptographic hash functions.
- Given the same input (`"mypassword"`), they always produce the same output.
- **No salt is used**, meaning the hash is predictable and repeatable.

### **Example**
```bash
MD5:    34819d7beeabb9260a5c854bc85b3e44
SHA1:   91dfd9ddb4198affc5c194cd8ce6d338fde470e2
SHA256: 89e01536ac207279409d4de1e5253e01f4a1769e696db0d6062ca9b8f56767c8
```
- The **same password** produces the **same hash** every time.
- These hashes are **not safe** for storing passwords because they are **fast and vulnerable to brute force and rainbow table attacks**.

## 🔄 **Why Do Bcrypt and Argon2 Change Every Time?**
Unlike SHA-based hashes, **Bcrypt and Argon2 include a randomly generated salt** to make the hashes unique each time.

### **1️⃣ Bcrypt**
- Bcrypt is a **work-factor-based** hash function.
- The structure of the hash:  
  ```
  $2b$10$<22-char-salt><31-char-hash>
  ```
- Every time you hash the same password, Bcrypt generates a new **22-character salt**, causing a different hash.

#### **Example**
```bash
Bcrypt: $2b$10$iYvOj6y1kLHWmTDY6MSSkOsb6fisqPyoIQYfQO7jvZLeLTgM67NuS
Bcrypt: $2b$10$E9x8FxvHXnHPYh/mojegLeNQZ5kcTMrgSc/r06.mqAMUcAu0OogPm
```
- Both hashes represent the same password (`"mypassword"`), but they are different because of the **random salt**.
- However, when verifying a password, Bcrypt extracts the salt and applies it **correctly**, meaning **all valid hashes still recognize the correct password**.

### **2️⃣ Argon2**
- Argon2 is a **modern, memory-hard password hashing algorithm**.
- The structure of the hash:  
  ```
  $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>
  ```
- The **salt is randomly generated** for each hash, making it unique.

#### **Example**
```bash
Argon2: $argon2id$v=19$m=65536,t=3,p=4$F3t8M593zaFekDDW9x0hGA$MqlzTq5Iy1m9kHgYBsBpFYfCHqHgIisUMyNOxlIVJyk
Argon2: $argon2id$v=19$m=65536,t=3,p=4$niddXHQXIYNrBcsp+zkPdw$/CPIRv2cCDF6Xw7PseVtvJHD50Iuwvhr2g/RxgEy/K4
```
- Both hashes **represent the same password**, but are **different because of the random salt**.
- Like Bcrypt, **Argon2 verifies passwords correctly by extracting and using the salt properly**.

## 🛠 **Are All Hashes Still Valid?**
Yes! Even though **Bcrypt and Argon2 produce different hashes each time,** they are **still valid**. 

### **How Does Verification Work?**
When verifying a password:
1. The stored hash contains the **salt and algorithm parameters**.
2. The hashing function re-runs using those parameters.
3. If the result matches the stored hash, the password is correct.

✅ **Example of Bcrypt Verification in Node.js**
```javascript
import bcrypt from "bcryptjs";

const password = "mypassword";
const storedHash = "$2b$10$iYvOj6y1kLHWmTDY6MSSkOsb6fisqPyoIQYfQO7jvZLeLTgM67NuS";

bcrypt.compare(password, storedHash, (err, result) => {
    console.log("Password matches:", result);  // Output: true
});
```
Even if a new Bcrypt hash is generated every time, **the verification will always pass if the correct password is provided**.

✅ **Example of Argon2 Verification**
```javascript
import argon2 from "argon2";

const password = "mypassword";
const storedHash = "$argon2id$v=19$m=65536,t=3,p=4$niddXHQXIYNrBcsp+zkPdw$/CPIRv2cCDF6Xw7PseVtvJHD50Iuwvhr2g/RxgEy/K4";

argon2.verify(storedHash, password).then(match => {
    console.log("Password matches:", match);  // Output: true
}).catch(err => console.error("Error:", err));
```
- **As long as you store the original hash, you can always verify passwords correctly**.

## 🚀 **Conclusion**
| Algorithm | Deterministic? | Uses Salt? | Secure for Passwords? |
|-----------|--------------|------------|----------------------|
| **MD5** | ✅ Yes | ❌ No | ❌ No (Fast & Broken) |
| **SHA1** | ✅ Yes | ❌ No | ❌ No (Weak) |
| **SHA256** | ✅ Yes | ❌ No | ❌ No (Still Fast) |
| **Bcrypt** | ❌ No | ✅ Yes | ✅ Yes (Slow & Secure) |
| **Argon2** | ❌ No | ✅ Yes | ✅ Yes (Best Option) |


## 🔥 **Summary**
- **MD5, SHA1, and SHA256** generate the **same** hash every time.
- **Bcrypt and Argon2** generate **different** hashes every time due to **random salt**.
- **Passwords can always be verified correctly** even if the hash changes.
- **Argon2 is the most secure option for modern applications**.

🚀 **Always use Bcrypt or Argon2 for storing passwords**.