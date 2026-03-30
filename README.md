# IOTA Asset Digital Twin MVP

Questo progetto è un **MVP (Minimum Viable Product)** che dimostra l'integrazione di un frontend Next.js con uno Smart Contract Move sulla rete **IOTA Testnet**. Permette di creare (mintare) un "Digital Twin" (gemello digitale) di un asset di lusso e di aggiornarne l'integrità tramite scansioni hardware simulate.

## Prerequisiti

Per eseguire correttamente e testare l'MVP è necessario avere installato sulla propria macchina:
- **Node.js** (versione 18 o superiore consigliata)
- **NPM** (o comandi equivalenti come pnpm o yarn)
- *(Opzionale)* **IOTA CLI** (solo se si desidera modificare e ripubblicare lo Smart Contract).

---

## 🚀 1. Configurazione Rapida (Ambiente di Testnet)

Attualmente il progetto è **già configurato** per puntare alla Testnet di IOTA e interagire con il contratto precedentemente pubblicato.  
Verifica che nella root del progetto sia presente il file `.env.local` con i seguenti parametri (le chiavi qui riportate sono quelle attuali di test, non presentano problemi di sicurezza in Testnet):

```env
# Indirizzo del Package Move pubblicato
NEXT_PUBLIC_PACKAGE_ID=0x831cf24d48b4a426ee416581a6094f656a4348283db67b8ab5e589fce2b5dca4

# L'ID dell'oggetto OracleCap che dà all'account l'autorizzazione di validare le transazioni dello scanner
ORACLE_CAP_ID=0xf0efdb3caf0b7204e885915b2c6ad2b42df1f1f9c167385b1bd72127cc50272f

# Chiave privata del Wallet/Oracolo autorizzato a firmare (formato bech32)
ORACLE_SECRET_KEY=iotaprivkey1qrvdxhu790v485j4jz9mmrm98f5u4avraevw6vc5ahl6hnt9xxxav7nl58y

# L'endpoint RPC per connettersi alla Testnet di IOTA
NEXT_PUBLIC_IOTA_RPC_URL=https://api.testnet.iota.cafe

# ID dell'asset demo (questo valore viene automaticamente aggiornato dall'API al primo mint dalla UI)
NEXT_PUBLIC_DEMO_ASSET_ID=0x1ff6ac8a4e7e11118c53d6dd334ec0ff046f89588f8fe053cf2f8e3352c50e8a
```

*(Nota: L'ID del `NEXT_PUBLIC_DEMO_ASSET_ID` cambierà o verrà inizializzato se deciderai di effettuare il mint di un nuovo asset dalla UI).*

---

## 🛠️ 2. Avvio dell'Applicazione (Frontend)

Una volta verificata la presenza del file `.env.local`, apri un nuovo terminale, assicurati di essere nella cartella root del progetto (`progetto-finale-iota`) ed esegui i seguenti passaggi:

1. **Installa tutte le dipendenze**:
   ```bash
   npm install
   ```
2. **Avvia il server Web locale**:
   ```bash
   npm run dev
   ```

A questo punto, il terminale confermerà che l'applicazione è in ascolto all'indirizzo indicato.

---

## 🧪 3. Testare Il Flusso (MVP)

1. Apri il browser web e vai all'indirizzo fornito dal terminale: **`http://localhost:3000`**.
2. **Creazione (Mint) di un nuovo Asset**: 
   - Tramite l'interfaccia principale sarà possibile simulare la registrazione di un Digital Twin.
   - Cliccando l'apposito pulsante o caricando un nuovo pezzo, il frontend contatterà l'API Backend interna (`POST /api/mint`).
   - L'API firmerà e completerà una transazione sulla IOTA Testnet per creare un nuovo oggetto on-chain, aggiornando allo stesso tempo l'identificativo demo del `.env.local` in background.
3. **Simulazione dello Scan (Aggiornamento Integrità)**:
   - Una volta visualizzati i dettagli dell'Asset a schermo, potrai simulare uno "Scanner Hardware" che valuta lo stato del prodotto di lusso.
   - Avvia lo Scan per chiamare l'API `/api/scan`. Durante questo processo, l'Oracolo configge la firma di validità (usando `ORACLE_SECRET_KEY` e `ORACLE_CAP_ID`) e autorizza lo smart contract ad aggiornare i parametri e lo storico tracciamento.
   - A transazione confermata, i dati si aggiorneranno automaticamente sul frontend prelevati in real-time dalla Blockchain di IOTA.

---

## 📋 4. (Avanzato) Come Ripubblicare lo Smart Contract

*(Saltare questo paragrafo se si sta solo testando l'app senza modificare il codice Move).*

Se hai apportato personalizzazioni ai file all'interno della cartella `move/`, affinché le modifiche dello Smart Contract abbiano effetto, dovrai eseguire un nuovo deploy:

1. Apri un terminale nella sottocartella `move/`:
   ```bash
   cd move
   ```
2. Esegui la pubblicazione sulla rete (nota: devi avere impostato `iota client` connesso a `testnet` e disporre di gas sufficiente reperito via faucet):
   ```bash
   iota client publish --gas-budget 100000000
   ```
3. Tra gli "Object Changes" del log fornito a terminale, annota:
   - Il nuovo **Package ID** da sostituire in `NEXT_PUBLIC_PACKAGE_ID`.
   - Il nuovo l'ID dell'oggetto creato col ruolo di `OracleCap` da sostituire in `ORACLE_CAP_ID`.
4. Effettua tutte le sostituzioni di questi campi all'interno del file `.env.local` e riavvia (`Ctrl+C` poi `npm run dev`) il server di sviluppo Next.js per far sì che prenda in carico le nuove variabili.

---

## 🧠 5. Appendice: Dietro le quinte (Comandi CLI IOTA usati)

Per farti capire come l'intero progetto è stato imbastito dall'inizio e come sono stati generati i vari indirizzi e le chiavi, ecco il flusso logico dei comandi **IOTA CLI** che sono stati utilizzati per preparare l'ambiente:

### A. Setup dell'Ambiente e del Wallet
1. **Configurare il client verso la Testnet:**
   ```bash
   iota client new-env --alias testnet --rpc https://api.testnet.iota.cafe
   iota client switch --env testnet
   ```
   *(Questo imposta il tuo client locale per puntare alla rete di test di IOTA, anziché alla Mainnet o alla Devnet).*

2. **Generare un nuovo indirizzo per l'Account principale:**
   ```bash
   iota client new-address ed25519
   ```
   *(Crea un nuovo indirizzo che farà da creatore e da owner del Package quando viene pubblicato lo Smart Contract).*

3. **Richiedere GAS (IOTA di test) per pagare le transazioni:**
   ```bash
   iota client faucet
   ```
   *(Invia una richiesta al Faucet della Testnet per accreditare alcuni IOTA gratuiti all'indirizzo appena creato, necessari per pagare le tasse di pubblicazione).*

### B. Setup delle Chiavi Oracolo (per il Frontend)
L'applicazione Next.js funge da "Oracolo" (o Scanner simulato) che ha bisogno di *firmare* le transazioni di validità in background senza far aprire il wallet all'utente.
1. **Generare la chiave privata (`ORACLE_SECRET_KEY`):**
   ```bash
   iota keytool generate ed25519
   ```
   *(Questo comando stampa a video un indirizzo e la sua chiave privata associata nel formato `iotaprivkey...`. Abbiamo preso questa chiave e l'abbiamo salvata nel file `.env.local`).*

### C. Build e Deploy dello Smart Contract Move
1. **Compilare il contratto:**
   ```bash
   cd move
   iota move build
   ```
   *(Verifica che il codice `.move` o il file `Move.toml` non abbiano errori di sintassi).*

2. **Pubblicare il contratto sulla Blockchain:**
   ```bash
   iota client publish --gas-budget 100000000
   ```
   *(Questo è il comando fondamentale. Invia il bytecode compilato alla rete. La rete esegue la transazione, consuma il Gas specificato, e restituisce il **Package ID** e la lista degli oggetti generati. Tra gli oggetti generati dalla funzione `init` del contratto c'è anche l'`OracleCap`, che abbiamo poi inserito nel file `.env.local` per dare all'Oracolo i permessi per interagire).*

---

**Fine.** Il progetto è un prototipo pensato per testare a costo zero e sulla sicura Testnet le transazioni tipiche per il controllo del mercato secondario/integrità di beni attraverso Web3.
