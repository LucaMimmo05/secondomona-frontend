# Secondomona - Sistema di Gestione Visite e Timbrature

Un'applicazione web moderna per la gestione delle visite aziendali e delle timbrature dei dipendenti, sviluppata con React e Vite.

## 📋 Indice

- [Caratteristiche](#caratteristiche)
- [Tecnologie Utilizzate](#tecnologie-utilizzate)
- [Struttura del Progetto](#struttura-del-progetto)
- [Installazione](#installazione)
- [Configurazione](#configurazione)
- [Avvio dell'Applicazione](#avvio-dellapplicazione)
- [Ruoli e Permessi](#ruoli-e-permessi)
- [Funzionalità Principali](#funzionalità-principali)
- [API e Backend](#api-e-backend)
- [Sicurezza](#sicurezza)
- [Sviluppo](#sviluppo)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contribuire](#contribuire)

## ✨ Caratteristiche

- **Sistema multi-ruolo**: Supporto per Admin, Portineria e Dipendenti
- **Gestione visite**: Creazione, modifica e monitoraggio delle visite
- **Gestione visitatori**: Anagrafica completa con validazione documenti
- **Sistema timbrature**: Punch-in/out con persistenza dello stato
- **Dashboard responsive**: Interfaccia adattiva per desktop, tablet e mobile
- **Autenticazione JWT**: Sistema di autenticazione sicuro con token refresh
- **Notifiche avanzate**: Alert personalizzati con animazioni e auto-dismiss
- **Validazione real-time**: Controllo automatico della validità dei token

## 🛠 Tecnologie Utilizzate

### Frontend

- **React 19.1.0** - Libreria principale per l'interfaccia utente
- **Vite** - Build tool e development server
- **React Router DOM 7.6.0** - Gestione delle rotte
- **Bootstrap 5.3.6** - Framework CSS per il design responsivo
- **React Toastify 11.0.5** - Sistema di notifiche
- **DataTables.net 2.3.1** - Tabelle interattive
- **jQuery 3.7.1** - Supporto per DataTables

### Sviluppo

- **ESLint** - Linting del codice
- **Vite** - Hot Module Replacement (HMR)

## 📁 Struttura del Progetto

```
secondomona-frontend/
├── src/
│   ├── assets/          # Icone SVG e risorse statiche
│   ├── components/      # Componenti riutilizzabili
│   │   ├── AdminSidebar.jsx
│   │   ├── EmployeeSidebar.jsx
│   │   ├── ReceptionSidebar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Selector.jsx
│   ├── context/         # Context API per stato globale
│   │   └── AuthContext.jsx
│   ├── hooks/           # Custom hooks
│   │   └── useTokenValidation.js
│   ├── pages/           # Pagine dell'applicazione
│   │   ├── Login.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── EmployeeDashboard.jsx
│   │   ├── ReceptionDashboard.jsx
│   │   ├── AddVisitor.jsx
│   │   ├── AddVisit.jsx
│   │   ├── TimeTracking.jsx
│   │   └── TimbratureMonitor.jsx
│   ├── styles/          # File CSS
│   ├── utils/           # Utility functions
│   │   ├── apiUtils.js
│   │   └── parseJwt.js
│   ├── App.jsx          # Componente principale
│   └── main.jsx         # Entry point
├── public/              # File pubblici
├── package.json         # Dipendenze e script
└── README.md           # Documentazione
```

## 🚀 Installazione

### Prerequisiti

- **Node.js** (versione 18 o superiore)
- **npm** o **yarn**
- **Backend API** in esecuzione su `http://localhost:8080`

### Passi per l'installazione

1. **Clona il repository**

   ```bash
   git clone <repository-url>
   cd secondomona-frontend
   ```

2. **Installa le dipendenze**

   ```bash
   npm install
   ```

   oppure con yarn:

   ```bash
   yarn install
   ```

## ⚙️ Configurazione

### Variabili d'Ambiente

Il backend API è configurato per funzionare su:

- **URL Base**: `http://localhost:8080`
- **Endpoints principali**:
  - `/api/auth/login` - Autenticazione
  - `/api/visitatori` - Gestione visitatori
  - `/api/visite` - Gestione visite
  - `/api/timbrature` - Sistema timbrature
  - `/api/dipendenti` - Gestione dipendenti

### Configurazione Backend

Assicurati che il backend sia configurato per:

- Accettare richieste CORS dal frontend
- Utilizzare autenticazione JWT
- Fornire token di refresh
- Gestire i ruoli utente: `Admin`, `Portineria`, `Dipendente`

## 🎮 Avvio dell'Applicazione

### Modalità Sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

### Build per Produzione

```bash
npm run build
```

### Preview della Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 👥 Ruoli e Permessi

### 🔐 Admin

**Accesso completo al sistema**

- Gestione visite attive e archivio
- Assegnazione badge
- Aggiunta visite e visitatori
- Gestione dipendenti
- Monitoraggio timbrature
- Controllo completo sistema

### 🏢 Portineria

**Gestione front-office**

- Visualizzazione visite attive
- Archivio visite
- Assegnazione badge
- Aggiunta visite e visitatori
- Gestione dipendenti
- Timbrature e monitoraggio

### 👨‍💼 Dipendente

**Funzioni base**

- Visualizzazione visite attive
- Aggiunta nuove visite
- Sistema timbrature personali

## 🎯 Funzionalità Principali

### 🔑 Sistema di Autenticazione

- Login con email e password
- Autenticazione JWT con refresh token
- Logout automatico alla scadenza token
- Protezione delle rotte basata sui ruoli

### 👥 Gestione Visitatori

- **Anagrafica completa**: Nome, cognome, email, telefono
- **Documenti**: Dropdown per tipo documento (CI, Passaporto, Patente)
- **Dati aziendali**: Azienda, indirizzo, partita IVA
- **Validazione**: Controllo codice fiscale e email
- **Alert avanzati**: Notifiche con icone e auto-dismiss

### 📅 Gestione Visite

- Creazione visite con date e orari
- Associazione visitatore-richiedente
- Flag per DPI e accesso automezzi
- Materiale informatico
- Stato visite (attive/archiviate)

### ⏰ Sistema Timbrature

- **Punch-in/Punch-out** con persistenza stato
- **Stato globale**: Mantenimento working status tra navigazioni
- **Monitoraggio**: Visualizzazione timbrature per data
- **Filtri**: Per stato e periodo temporale

### 📱 Interfaccia Responsiva

- **Desktop**: Sidebar fissa con navigazione completa
- **Mobile/Tablet**: Menu hamburger con offcanvas
- **Responsive design**: Bootstrap 5 con breakpoint ottimizzati

## 🔌 API e Backend

### Endpoints Principali

#### Autenticazione

```
POST /api/auth/login
Body: { email, password }
Response: { accessToken, refreshToken }
```

#### Visitatori

```
GET    /api/visitatori          # Lista visitatori
POST   /api/visitatori          # Crea visitatore
PUT    /api/visitatori/:id      # Modifica visitatore
DELETE /api/visitatori/:id      # Elimina visitatore
```

#### Visite

```
GET    /api/visite              # Lista visite
GET    /api/visite/attive       # Visite attive
POST   /api/visite              # Crea visita
PUT    /api/visite/:id          # Modifica visita
```

#### Timbrature

```
GET    /api/timbrature/oggi/:id    # Timbrature oggi
POST   /api/timbrature            # Nuova timbratura
GET    /api/timbrature/data/:date # Timbrature per data
```

### Formato Token JWT

```json
{
  "sub": "userId",
  "name": "Nome",
  "surname": "Cognome",
  "idPersona": 123,
  "idTessera": 456,
  "groups": ["Admin", "access-token"],
  "exp": 1234567890
}
```

## 🔒 Sicurezza

### Protezione delle Rotte

- **ProtectedRoute component**: Validazione ruoli via JWT
- **Token validation**: Controllo scadenza automatico
- **Logout automatico**: Al token scaduto o non autorizzato
- **Ruoli dal token**: Estrazione sicura dai groups JWT

### Gestione Token

- **AccessToken**: Token principale per le API
- **RefreshToken**: Token di rinnovo automatico
- **localStorage**: Persistenza sicura lato client
- **Auto-refresh**: Rinnovo automatico token scaduti

### Sicurezza API

- **Authorization headers**: Bearer token su ogni chiamata
- **Error handling**: Gestione 401/403 con logout automatico
- **CORS**: Configurazione cross-origin

## 🔧 Sviluppo

### Struttura Components

```jsx
// Esempio componente con ruoli
const AdminDashboard = () => {
  const [activeSelector, setActiveSelector] = useState("Visite Attive");

  const renderContent = () => {
    switch (activeSelector) {
      case "Visite Attive":
        return <ActiveVisits />;
      case "Aggiungi Visitatore":
        return <AddVisitor />;
      // ...altri casi
    }
  };

  return (
    <div className="home">
      <AdminSidebar
        activeSelector={activeSelector}
        setActiveSelector={setActiveSelector}
      />
      <div className="home-content">{renderContent()}</div>
    </div>
  );
};
```

### Context API Usage

```jsx
// AuthContext per stato globale
const { token, role, isWorking, updateWorkingStatus } = useAuth();
```

### Chiamate API

```jsx
// Utility per chiamate sicure
import { apiCall } from "../utils/apiUtils";

const response = await apiCall("/api/endpoint", {
  method: "POST",
  body: JSON.stringify(data),
});
```

### Best Practices

- **Componenti funzionali** con hooks
- **Prop drilling evitato** via Context API
- **Error boundaries** per gestione errori
- **Loading states** per UX ottimale
- **Validazione client-side** per performance

## 📦 Deployment

### Build di Produzione

```bash
# Crea build ottimizzata
npm run build

# File generati in /dist
# Servire con web server (nginx, apache, etc.)
```

### Variabili d'Ambiente

Crea file `.env.production`:

```
VITE_API_BASE_URL=https://api.produzione.com
VITE_APP_NAME=Secondomona
```

### Configurazione Server

```nginx
# Esempio nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
    }
}
```

## 🐛 Troubleshooting

### Problemi Comuni

#### Token Scaduto

```
Errore: "Token scaduto o mancante"
Soluzione: Rifare login o verificare backend
```

#### CORS Error

```
Errore: "CORS policy blocked"
Soluzione: Configurare headers CORS nel backend
```

#### 404 su Refresh

```
Errore: Page not found al refresh
Soluzione: Configurare try_files nel web server
```

### Debug

```bash
# Attivare modalità debug
localStorage.setItem('debug', 'true');

# Verificare token in console
console.log(localStorage.getItem('accessToken'));

# Network tab per chiamate API
```

## 🤝 Contribuire

### Sviluppo

1. **Fork** del repository
2. **Crea branch** per feature: `git checkout -b feature/nome-feature`
3. **Commit** modifiche: `git commit -m 'Add feature'`
4. **Push** branch: `git push origin feature/nome-feature`
5. **Pull Request** con descrizione dettagliata

### Code Style

- **ESLint**: Seguire regole definite
- **Prettier**: Formattazione automatica
- **Naming**: camelCase per variabili, PascalCase per componenti
- **Comments**: JSDoc per funzioni complesse

### Testing

```bash
# Aggiungere test per nuove funzionalità
npm test

# Coverage report
npm run test:coverage
```

## 📄 Licenza

Questo progetto è parte del corso **ITS Incom** per lo sviluppo di applicazioni web moderne.

## 📞 Supporto

Per supporto tecnico o domande:

- **Issue GitHub**: Aprire ticket con dettagli problema
- **Documentazione**: Consultare questo README
- **Logs**: Verificare console browser e network tab

---

**Versione**: 1.0.0  
**Ultimo aggiornamento**: Maggio 2025  
**Compatibilità**: Node.js 18+, Browser moderni (Chrome 90+, Firefox 88+, Safari 14+)
