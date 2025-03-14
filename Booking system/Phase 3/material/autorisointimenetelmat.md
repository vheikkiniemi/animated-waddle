> [!NOTE]
> Materiaalin laadinnassa hyödynnetty ChatGPT-tekoälysovellusta

# **Autorisointi web-ympäristöissä**

Web-ympäristöissä autorisointi tarkoittaa käyttäjän oikeuksien ja pääsyoikeuksien hallintaa sen jälkeen, kun hänet on tunnistettu (autentikoitu). Autorisointiin käytetään usein erilaisia menetelmiä ja tekniikoita.

## **1 Yleisimmät autorisointimenetelmät**

### **1.1 Roolipohjainen autorisointi (RBAC, Role-Based Access Control)**  
- Käyttäjille määritetään roolit (esim. `admin`, `user`, `guest`) ja käyttöoikeudet perustuvat rooleihin.  
- Esimerkki: `Admin` voi muokata tietoja, `User` voi lukea ja päivittää, `Guest` voi vain lukea.  
- Esimerkki koodina:
  ```json
  {
    "username": "ville",
    "role": "admin"
  }
  ```
- **Käyttökohteet:** Verkkopalvelut, joissa on selkeät roolit.

### **1.2 Oikeuspohjainen autorisointi (PBAC, Permission-Based Access Control)**  
- Käyttöoikeudet määritetään yksittäisinä oikeuksina (esim. `"read_reports"`, `"edit_users"`, `"delete_posts"`), joita voi antaa rooleille tai yksittäisille käyttäjille.  
- Joustavampi kuin `RBAC`, koska oikeudet eivät ole kiinteästi sidottuja rooleihin.  
- Esimerkki koodina:
  ```json
  {
    "username": "ville",
    "permissions": ["read_reports", "edit_users"]
  }
  ```
- **Käyttökohteet:** Sovellukset, joissa käyttäjien oikeudet muuttuvat usein.

### **1.3 Aihepohjainen autorisointi (ABAC, Attribute-Based Access Control)**  
- Käyttöoikeudet perustuvat käyttäjän, resurssin tai ympäristön attribuutteihin (esim. `ikä`, `osasto`, `sijainti`, `kellonaika`).  
- Esimerkki: `HR-osaston työntekijä voi nähdä työntekijätiedot vain työaikana ja vain oman osastonsa osalta`.  
- Hyödyllinen monimutkaisissa järjestelmissä.
- Esimerkki koodina:
  ```json
  {
    "username": "ville",
    "department": "HR",
    "access_time": "08:00-18:00"
  }
  ```
- **Käyttökohteet:** Suuryritykset ja dynaamiset tietojärjestelmät.

### **1.4 Token-pohjainen autorisointi**  
- Tokenit (esim. `JWT`, `OAuth 2.0`, `OpenID Connect`) mahdollistavat käyttöoikeuksien hallinnan ilman jatkuvia kirjautumisia.  
- `JSON Web Token (JWT)` – sisältää käyttäjän tiedot ja oikeudet, lähetetään jokaisessa pyynnössä.  
- `OAuth 2.0` – käytetään API-kutsujen valtuutukseen (esim. kirjautuminen Googlella tai Facebookilla).  
- `OpenID Connect (OIDC)` – laajennus OAuth 2.0:lle, joka mahdollistaa myös käyttäjän autentikoinnin.
- **Käyttökohteet:** API-rajapinnat

### **1.5 Kontekstipohjainen autorisointi**  
- Pääsy myönnetään tilanteen mukaan (esim. `IP-osoite`, `laite`, `sijainti`, `käyttäytymismalli`).  
- Esimerkki: `Jos käyttäjä yrittää kirjautua tuntemattomasta laitteesta, hänen on vahvistettava henkilöllisyytensä lisävarmenteella`.  
- Käytössä esimerkiksi `Google Workspace Security` ja `Zero Trust` -arkkitehtuurit.
- **Esimerkki:** Vain Suomessa oleva käyttäjä voi kirjautua sisään.

### **1.6 Hierarkkinen ja monitasoinen autorisointi**  
- Monimutkaisemmissa sovelluksissa autorisointi voi olla hierarkkinen, esim. `esimiehet voivat tarkastella työntekijöidensä tietoja mutta eivät muiden tiimien tietoja`.  
- Yhdistää usein `RBAC`- ja `ABAC`-menetelmiä.

### **1.7 Pääsylistat (ACL, Access Control List)**  
- Jokaisella resurssilla on luettelo käyttäjistä ja heidän oikeuksistaan (esim. `lukeminen`, `kirjoittaminen`, `suorittaminen`).  
- Käytetään usein tiedostojärjestelmissä ja verkkopalvelimilla, mutta ei aina skaalautuva suurissa järjestelmissä.

### **1.8 Delegoitu autorisointi (Delegated Authorization)**  
- Käyttäjä voi myöntää pääsyn resursseihinsa toiselle käyttäjälle tai sovellukselle (esim. `OAuth 2.0 Delegation`).  
- Esimerkki: `Google Drive antaa käyttäjän valita, kuka saa katsella, kommentoida tai muokata tiedostoa`.

### **Mikä menetelmä sopii parhaiten?**  
- **Pienet sovellukset:** RBAC + JWT  
- **Suuret yrityskäyttöjärjestelmät:** ABAC + OAuth 2.0  
- **API-käyttö:** OAuth 2.0 tai API-avaimet  
- **Korkean tietoturvan sovellukset:** Zero Trust -lähestymistapa (mukaan lukien kontekstipohjainen autorisointi)


## **2 Sessioiden käyttö**

### **2.1 Miten sessiot toimivat autorisoinnissa?**  
1. **Käyttäjä kirjautuu sisään:**  
   - Käyttäjä antaa käyttäjätunnuksen ja salasanan.  
   - Sovellus tarkistaa tunnistetiedot ja luo session.  
   
2. **Istunnon luonti:**  
   - Palvelin luo `session ID`:n ja tallentaa sen käyttäjän tietoihin (esim. käyttäjärooli, käyttöoikeudet).  
   - Session ID lähetetään käyttäjälle `evästeenä (cookie)`.  

3. **Sessio seuraa käyttäjää:**  
   - Jokaisessa pyynnössä selain lähettää session ID:n evästeenä takaisin palvelimelle.  
   - Palvelin tarkistaa session tietokannasta tai muistista (esim. Redis) ja antaa pääsyn vain, jos käyttäjä on valtuutettu.  

4. **Sessio päättyy:**  
   - Kun käyttäjä `kirjautuu ulos` tai sessio vanhenee (esim. 30 min käyttämättömyys).  
   - Palvelin poistaa session tiedot ja eväste mitätöityy.

>[!NOTE]  
> ✅ Istunto voi olla lyhytkestoinen ja kestää vain niin kauan kuin käyttäjä on aktiivinen verkkosivulla.  
> ✅ Sessio voi jatkua, vaikka käyttäjä sulkisi selaimen ja palaisi myöhemmin takaisin, jos sessiotiedot on tallennettu esimerkiksi evästeisiin.  
> ✅ Sessio on laajempi käsite, joka kattaa koko käyttäjän vierailun verkkosivustolla. Se voi sisältää useita istuntoja.

### **2.2 Sessioiden tallennusvaihtoehdot**
Sessioita voidaan tallentaa eri tavoin:

- **Palvelimen muistissa**  
  - Nopea, mutta ei skaalautuva (jos palvelimia on useita, sessio ei säily niiden välillä).  
  - Käyttö: **pienet sovellukset**.

- **Tietokannassa (esim. MySQL, PostgreSQL, MongoDB)**  
  - Skaalautuva, mutta tietokanta voi hidastua suuren käyttäjämäärän kanssa.  
  - Käyttö: **monikäyttäjäympäristöt**.

- **Redis- tai Memcached-muistivarastossa**  
  - Nopea ja skaalautuva ratkaisu, sopii suuriin järjestelmiin.  
  - Käyttö: **suurten sovellusten sessionhallinta**.

### **2.3 Sessioihin perustuva autorisointi käytännössä (Node.js + Express)**
Tässä esimerkki siitä, miten sessioita voidaan käyttää `Node.js`-palvelimella `Express.js`:n ja `express-session`-kirjaston avulla:

```javascript
const express = require('express');
const session = require('express-session');

const app = express();

// Session-asetukset
app.use(session({
    secret: 'salainen-avain',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 30 * 60 * 1000 } // 30 min
}));

// Kirjautuminen
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === "admin" && password === "salasana") {
        req.session.user = { username, role: "admin" };
        res.send("Kirjautuminen onnistui!");
    } else {
        res.status(401).send("Väärät tunnukset");
    }
});

// Suojattu reitti
app.get('/admin', (req, res) => {
    if (req.session.user && req.session.user.role === "admin") {
        res.send("Tervetuloa admin-sivulle!");
    } else {
        res.status(403).send("Ei käyttöoikeutta!");
    }
});

// Kirjautuminen ulos
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send("Kirjauduttu ulos!");
});

app.listen(3000, () => console.log('Palvelin käynnissä'));
```

### **2.4 Sessioiden turvallisuus**
- **HttpOnly-evästeet:** Evästeitä ei voi lukea JavaScriptillä, vähentää XSS-riskiä.  
  ```javascript
  cookie: { httpOnly: true, secure: true }
  ```
- **Secure-lippu:** Evästeet lähetetään vain HTTPS-yhteyden yli.  
- **SameSite-lippu:** Estää CSRF-hyökkäyksiä rajoittamalla evästeiden lähetystä eri verkkotunnuksista.  
  ```javascript
  cookie: { sameSite: 'Strict' }
  ```
- **Sessioiden aikaraja ja automaattinen vanhentuminen:**  
  - Käyttäjän istunto suljetaan automaattisesti käyttämättömyyden jälkeen.  
- **Session uudelleenluonti autentikoinnin jälkeen:**  
  - Vähentää sessioiden kaappaamisen riskiä.

### **2.6 Milloin käyttää sessioita?**
✅ Perinteiset web-sovellukset, joissa käyttäjä pysyy kirjautuneena pitkään.  
✅ Sovellukset, joissa käyttöoikeuksien hallinta on monimutkaista (esim. roolipohjainen käyttöoikeus).  
✅ Kun palvelin haluaa säilyttää kontrollin istunnoista, esimerkiksi tietoturvasyistä.  

## **3 JWT (JSON Web Token)**

 [JWT (JSON Web Token)](https://jwt.io/) on **kevyt ja turvallinen** tapa toteuttaa autentikointi ja autorisointi web-sovelluksissa. Se on **tilaton**, eli se ei vaadi palvelimen muistissa olevaa istuntoa (kuten sessiot), vaan kaikki tieto on sisällytetty itse tokeniin.

### **3.1 JWT:n rakenne**  
JWT koostuu kolmesta osasta, jotka on erotettu pisteillä `.`:  

```
header.payload.signature
```

#### **3.1.1 Header (otsikko)**
- Sisältää tiedon algoritmista, jolla token on allekirjoitettu.
- Esimerkki koodina:
  ```json
  {
    "alg": "HS256",
    "typ": "JWT"
  }
  ```

#### **3.1.2 Payload (sisältö)**
- Sisältää käyttäjän tiedot ja käyttöoikeudet.
- Esimerkki koodina:
  ```json
  {
    "sub": "1234567890",
    "name": "Ville Heikkiniemi",
    "role": "admin",
    "exp": 1711881600
  }
  ```
  - `sub`: käyttäjän tunniste
  - `role`: käyttäjän rooli
  - `exp`: vanhentumisaika (UNIX-aika)

#### **3.1.3 Signature (allekirjoitus)**
- Palvelin allekirjoittaa tokenin varmistaakseen sen aitouden.
- Esimerkiksi **HMAC SHA256** -algoritmilla:
  ```
  HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
  ```

### **3.2 JWT:n käyttö**

#### **3.2.1 Käyttäjä kirjautuu sisään**
- Käyttäjä antaa tunnukset.
- Palvelin tarkistaa ne ja luo JWT:n.

#### **3.2.2 JWT lähetetään asiakkaalle**
- Token palautetaan vastauksessa (esim. JSON-muodossa).
- Selain tallentaa tokenin joko **localStorageen** tai **HTTP-only-evästeeseen**.

#### **3.2.3 Käyttäjä tekee suojatun pyynnön**
- Jokaisessa API-pyynnössä käyttäjä lähettää tokenin HTTP-otsakkeessa:
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1...
  ```
- Palvelin **ei tarvitse istuntotietoja**, vaan voi tarkistaa tokenin sisällön.

#### **3.2.4 Palvelin tarkistaa JWT:n**
- Palvelin avaa tokenin, varmistaa sen allekirjoituksen ja tarkistaa käyttöoikeudet.

### **3.3 JWT käytännössä (Node.js + Express)**

Asennetaan tarvittavat paketit
```bash
npm install express jsonwebtoken dotenv
```

Luodaan palvelin ja JWT-autentikointi
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || "salainenavain";

// Kirjautuminen ja JWT:n luominen
app.post('/login', (req, res) => {
    const { username } = req.body;

    if (!username) return res.status(400).json({ message: "Käyttäjänimi vaaditaan" });

    const token = jwt.sign({ username, role: "user" }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token });
});

// Suojattu reitti
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: "Tämä on suojattu reitti", user: req.user });
});

// JWT-tarkistusmiddleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(3000, () => console.log('Palvelin käynnissä portissa 3000'));
```

### **3.4 JWT vs. Session-pohjainen autentikointi**
| **Ominaisuus** | **JWT** | **Sessiot** |
| :----: |:----:|:----:|
| **Tilaton?** | ✅ Kyllä | ❌ Ei |
| **Vaatii palvelimen tallennusta?** | ❌ Ei | ✅ Kyllä |
| **Skaalautuva?** | ✅ Kyllä | ❌ Ei hyvin |
| **Tietoturvariskit?** | Tokenin vuoto | Sessioiden hallinta |
| **API-ystävällinen?** | ✅ Kyllä | ❌ Ei |
| **Helppo mitätöinti?** | ❌ Ei (vaatii blacklistin) | ✅ Kyllä |


**Milloin käyttää JWT:tä?**  
✅ API-rajapinnat (esim. mikroserviitit)  
✅ Hajautetut järjestelmät  
✅ Kertakirjautuminen (SSO)  

**Milloin käyttää sessioita?**  
✅ Perinteiset web-sovellukset  
✅ Korkean tietoturvan sovellukset  

### **3.5 JWT:n turvallisuus**
1. Älä tallenna JWT:tä localStorageen (alttius XSS-hyökkäyksille).  
   - Käytä `HttpOnly-evästettä`, jos mahdollista.  
2. Käytä lyhyttä vanhentumisaikaa (`exp`) ja päivitä token tarvittaessa.  
3. Älä sisällytä arkaluontoisia tietoja JWT:hen, koska se voidaan purkaa ilman salausta.  
4. Mitä tehdä, jos token varastetaan?*
   - Käytä `blacklistia` palvelimella (esim. Redis).  

### **3.6 Yhteenveto**
✅ JWT on kevyt ja skaalautuva tapa autentikointiin ja autorisointiin.  
✅ Hyvä vaihtoehto sessioille API-pohjaisissa sovelluksissa.  
✅ Vaatii lisäturvatoimia, erityisesti tokenin käsittelyssä.  
✅ Ei ole helppoa mitätöidä yksittäistä tokenia ilman erillistä blacklistiä.  

## **4 Autorisointimenetelmät ja sessiot**

### **4.1 Roolipohjainen autorisointi (RBAC) + sessiot**
**Miten se toimii?**
- Käyttäjän rooli (esim. `admin`, `user`, `guest`) tallennetaan sessioon.  
- Jokaisessa pyynnössä tarkistetaan sessiosta, kuuluuko käyttäjä oikeaan rooliin.  

**Esimerkki koodina:**  
  ```javascript
  if (req.session.user && req.session.user.role === 'admin') {
      res.send("Tervetuloa admin-sivulle!");
  } else {
      res.status(403).send("Ei käyttöoikeutta!");
  }
  ```
**Sopii hyvin:**  

✅ Web-sovelluksiin, joissa käyttäjäroolit ovat selkeät ja harvoin muuttuvat.  
✅ Intranetit, hallintapaneelit, verkkokaupat.

### **4.2 Oikeuspohjainen autorisointi (PBAC) + sessiot**
**Miten se toimii?**
- Sen sijaan että sessioon tallennetaan vain rooli, siihen tallennetaan yksittäisiä oikeuksia (esim. `"can_edit_users": true`).
- Jokaisessa pyynnössä tarkistetaan, onko käyttäjällä oikeus toimintaan.

**Esimerkki koodina:** 
  ```javascript
  if (req.session.user && req.session.user.permissions.includes("edit_users")) {
      res.send("Voit muokata käyttäjiä!");
  } else {
      res.status(403).send("Ei käyttöoikeutta!");
  }
  ```
**Sopii hyvin:**  

✅ Suuriin sovelluksiin, joissa käyttäjien käyttöoikeudet voivat muuttua usein.

### **4.3 Aihepohjainen autorisointi (ABAC) + sessiot**
**Miten se toimii?**  
- Sessioon tallennetaan käyttäjän ominaisuuksia (esim. osasto, sijainti, työaika).  
- Pääsy myönnetään vain, jos käyttäjän ominaisuudet täyttävät vaatimukset.  

**Esimerkki:**  
  ```javascript
  if (req.session.user && req.session.user.department === "HR" && withinBusinessHours()) {
      res.send("Voit nähdä työntekijätiedot!");
  } else {
      res.status(403).send("Ei käyttöoikeutta!");
  }
  ```

**Sopii hyvin:**  

✅ Yrityskäyttöön, jossa käyttöoikeudet riippuvat kontekstista.

### **4.4 Token-pohjainen autorisointi (JWT, OAuth 2.0) + sessiot**
**Miten se toimii?**  
- Token voidaan `tallentaa sessioon` sen sijaan, että sitä säilytetään selaimen evästeenä tai LocalStoragessa.  
- Tämän avulla voidaan yhdistää sessioihin perustuva ja token-pohjainen lähestymistapa.  

**Esimerkki:**  
  ```javascript
  req.session.token = "eyJhbGciOiJIUzI1...";
  ```
  - Jokaisessa pyynnössä palvelin käyttää tokenia varmistaakseen käyttäjän oikeudet.  

**Sopii hyvin:**  

✅ Sovelluksiin, joissa tarvitaan yhdistelmä sessioiden ja tokenien hallintaa.

### **4.5 Kontekstipohjainen autorisointi + sessiot**
**Miten se toimii?**  
- Sessioon tallennetaan tietoja käyttäjän laitteen, IP-osoitteen tai sijainnin perusteella.  
- Jos konteksti muuttuu epäilyttävästi (esim. kirjautuminen eri maasta), voidaan vaatia lisätodennus.  

**Esimerkki:**  
  ```javascript
  if (req.session.user && req.session.user.ip === req.ip) {
      res.send("Pääsy myönnetty");
  } else {
      res.status(403).send("Epäilyttävä kirjautuminen, varmista henkilöllisyytesi.");
  }
  ```

**Sopii hyvin:**  

✅ Turvallisuuskriittisiin sovelluksiin (pankit, yrityssovellukset).

### **4.6 Access Control List (ACL) + sessiot**
**Miten se toimii?** 
  - Sessioon tallennetaan käyttäjän oikeudet tiettyihin resursseihin (esim. "voit muokata vain omia tiedostoja").  
  - Jokaisessa pyynnössä tarkistetaan ACL:stä, saako käyttäjä käyttää resurssia.  

**Esimerkki:**  
  ```javascript
  if (req.session.user && acl.check(req.session.user.id, req.params.fileId, "read")) {
      res.send("Tiedoston sisältö");
  } else {
      res.status(403).send("Ei käyttöoikeutta!");
  }
  ```

**Sopii hyvin:**  

✅ Tiedostopalveluihin, projektinhallintajärjestelmiin.

### **4.7 Delegoitu autorisointi (OAuth 2.0 Delegation) + sessiot**
**Miten se toimii?**  
- Sessioon tallennetaan käyttäjän OAuth 2.0 -valtuutus, ja pyyntöjä tehdään käyttäjän puolesta.  

**Esimerkki:**  
  ```javascript
  req.session.oauthToken = "ya29.a0ARrda...";
  ```

**Sopii hyvin:**  

✅ Kolmannen osapuolen palveluihin (Google Drive, Facebook API).

### **4.8 Yhteenveto: Milloin sessiot yhdistetään autorisointimenetelmiin?**
| Autorisointimenetelmä | Voiko käyttää sessioiden kanssa? | Hyvä yhdistelmä? |
|:----:|:----:|:----:|
| `RBAC` (roolipohjainen) | ✅ | Kyllä, yksinkertainen ja tehokas. |
| `PBAC` (oikeuspohjainen) | ✅ | Sopii, jos oikeuksia on paljon ja ne muuttuvat usein. |
| `ABAC` (attribuuttipohjainen) | ✅ | Käytännöllinen, mutta voi vaatia monimutkaisempaa sessiorakennetta. |
| Token-pohjainen (`JWT`, `OAuth`) | ⚠️ | Yleensä tokenit ovat tilattomia, mutta voidaan tallentaa sessioon. |
| Kontekstipohjainen (`Zero Trust`) | ✅ | Sopii tietoturvakriittisiin järjestelmiin. |
| `ACL` (pääsylista) | ✅ | Hyvä, jos oikeudet liittyvät yksittäisiin resursseihin. |
| Delegoitu (`OAuth 2.0 Delegation`) | ✅ | Käytetään, kun sovellus tekee pyyntöjä käyttäjän puolesta. |

**Pohdintaa**  

✅ Sessioiden käyttö on hyödyllistä, kun halutaan pitää käyttäjän tila hallinnassa palvelimen puolella.  
✅ Useimmat autorisointimenetelmät voidaan yhdistää sessioihin, mutta token-pohjainen lähestymistapa voi olla parempi API-pohjaisissa järjestelmissä.  
✅ Valinta riippuu sovelluksen tarpeista: jos käyttäjän tila pitää säilyttää palvelimen puolella, sessiot ovat hyödyllisiä. Jos taas tarvitaan skaalautuva ja hajautettu ratkaisu, token-pohjainen lähestymistapa voi olla parempi.


## **5 Autorisointimenetelmät ja JWT**  

### **5.1 Roolipohjainen autorisointi (RBAC) + JWT**
- JWT sisältää käyttäjän roolin payload-osassa.
- Jokaisessa pyynnössä palvelin tarkistaa, onko käyttäjällä tarvittava rooli.

#### **5.1.1 Esimerkki: JWT payload RBAC:lle**
```json
{
  "sub": "1234567890",
  "name": "Ville Heikkiniemi",
  "role": "admin",
  "exp": 1711881600
}
```

#### **5.1.2 Esimerkki: RBAC:n tarkistus Express.js-palvelimessa**
```javascript
function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).send("Ei käyttöoikeutta!");
        }
        next();
    };
}

// Suojattu admin-reitti
app.get('/admin', authenticateToken, authorizeRole("admin"), (req, res) => {
    res.send("Tervetuloa admin-sivulle!");
});
```

### **5.2 Oikeuspohjainen autorisointi (PBAC) + JWT**
- JWT:ssä voidaan tallentaa yksittäisiä käyttöoikeuksia (permissions).
- Jokaisessa pyynnössä tarkistetaan, onko käyttäjällä oikeus tiettyyn toimintaan.

#### **5.2.1 Esimerkki: JWT payload PBAC:lle**
```json
{
  "sub": "1234567890",
  "permissions": ["read_reports", "edit_users"],
  "exp": 1711881600
}
```

#### **5.2.2 Esimerkki: Oikeuksien tarkistus Express.js-palvelimessa**
```javascript
function authorizePermission(permission) {
    return (req, res, next) => {
        if (!req.user.permissions.includes(permission)) {
            return res.status(403).send("Ei käyttöoikeutta!");
        }
        next();
    };
}

// Suojattu reitti: Vain käyttäjät, joilla on "edit_users"-oikeus
app.get('/edit-user', authenticateToken, authorizePermission("edit_users"), (req, res) => {
    res.send("Voit muokata käyttäjiä!");
});
```

### **5.3 Aihepohjainen autorisointi (ABAC) + JWT**
- JWT sisältää käyttäjän attribuutteja (esim. osasto, sijainti, työaika).
- Palvelin tarkistaa, vastaavatko attribuutit pääsyvaatimuksia.

#### **5.3.1 Esimerkki: JWT payload ABAC:lle**
```json
{
  "sub": "1234567890",
  "department": "HR",
  "location": "Helsinki",
  "exp": 1711881600
}
```

#### **5.3.2 Esimerkki: Attribuuttipohjainen tarkistus**
```javascript
function authorizeByDepartment(department) {
    return (req, res, next) => {
        if (req.user.department !== department) {
            return res.status(403).send("Ei käyttöoikeutta!");
        }
        next();
    };
}

// Vain HR-osaston työntekijät voivat käyttää tätä reittiä
app.get('/hr-dashboard', authenticateToken, authorizeByDepartment("HR"), (req, res) => {
    res.send("Tervetuloa HR-paneeliin!");
});
```

### **5.4 Kontekstipohjainen autorisointi (Zero Trust) + JWT**
- JWT sisältää tietoa käyttäjän kirjautumistavasta, IP-osoitteesta tai laitteesta.
- Jos konteksti muuttuu, palvelin voi hylätä pyynnön.

#### **5.4.1 Esimerkki: JWT payload Zero Trust -mallissa**
```json
{
  "sub": "1234567890",
  "ip": "192.168.1.1",
  "device": "MacBookPro",
  "exp": 1711881600
}
```

#### **5.4.2 Esimerkki: Kontekstin tarkistus**
```javascript
function verifyContext(req, res, next) {
    if (req.user.ip !== req.ip) {
        return res.status(403).send("Epäilyttävä kirjautuminen!");
    }
    next();
}

app.get('/secure-data', authenticateToken, verifyContext, (req, res) => {
    res.send("Tämä on suojattu data.");
});
```

### **5.5 Delegoitu autorisointi (OAuth 2.0) + JWT**
- JWT:tä käytetään OAuth 2.0:ssa valtuutuksen todistamiseen.
- Käyttäjä antaa kolmannelle osapuolelle pääsyn resursseihinsa.

#### **5.5.1 Esimerkki: OAuth 2.0 -pohjainen JWT**
```json
{
  "sub": "1234567890",
  "scope": "read:user write:posts",
  "exp": 1711881600
}
```

#### **5.5.2 Esimerkki: OAuth-scopejen tarkistus**
```javascript
function authorizeScope(requiredScope) {
    return (req, res, next) => {
        if (!req.user.scope.includes(requiredScope)) {
            return res.status(403).send("Ei oikeutta tähän toimintaan!");
        }
        next();
    };
}

app.get('/user-profile', authenticateToken, authorizeScope("read:user"), (req, res) => {
    res.send("Tässä on käyttäjäprofiilisi.");
});
```

### **5.6 JWT vs. Sessioiden käyttö autorisoinnissa**
| **Autorisoitava menetelmä** | **JWT** | **Sessio** |
|----------------------|----------------|---------------|
| **RBAC** (roolipohjainen) | ✅ Sisältyy tokeniin | ✅ Tallennetaan palvelimelle |
| **PBAC** (oikeuspohjainen) | ✅ Sisältyy tokeniin | ✅ Tallennetaan sessioon |
| **ABAC** (attribuuttipohjainen) | ✅ Sisältyy tokeniin | ✅ Tallennetaan sessioon |
| **Zero Trust** | ✅ Sisältää IP- ja laiteseurantaa | ✅ Palvelimen hallitsema |
| **OAuth 2.0** | ✅ Käytetään API-pyynnöissä | ❌ Ei käytetä sessioita |

### **5.7 Yhteenveto**
- **JWT sopii hyvin API-pohjaisiin järjestelmiin**, koska se on **stateless** eikä vaadi palvelimelle tallennettavaa sessiota.
- **Sessioihin perustuva autorisointi sopii perinteisiin web-sovelluksiin**, joissa käyttäjän tila halutaan säilyttää palvelimen muistissa.
- **Yhdistelmä JWT + sessiot voi olla hyödyllinen**, jos halutaan skaalautuvuutta, mutta myös mahdollisuus mitätöidä yksittäisiä käyttäjäsessioita.
- **Valinta riippuu sovelluksen tarpeista**:  
  - **Jos haluat skaalautuvuutta ja API-ystävällisen ratkaisun → käytä JWT:tä.**  
  - **Jos tarvitset enemmän kontrollia ja turvallista istunnonhallintaa → käytä sessioita.** 