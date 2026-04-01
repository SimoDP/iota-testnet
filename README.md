# IOTA Asset Digital Twin MVP

This project is an **MVP (Minimum Viable Product)** that demonstrates the integration of a Next.js frontend with a Move smart contract on the **IOTA Testnet**. It allows you to create (mint) a "Digital Twin" of a luxury asset and update its integrity through simulated hardware scans.

## Prerequisites

To run and test the MVP correctly, you need the following installed on your machine:
- **Node.js** (version 18 or higher recommended)
- **NPM** (or equivalent commands such as pnpm or yarn)
- *(Optional)* **IOTA CLI** (only if you want to modify and republish the smart contract).

---

## 🚀 1. Quick Setup (Testnet Environment)

The project is currently **already configured** to point to IOTA Testnet and interact with the previously deployed contract.  
Make sure the `.env.local` file exists at the project root with the following parameters (the keys shown here are the current test keys and do not pose any security issues on Testnet):

```env
# Address of the published Move package
NEXT_PUBLIC_PACKAGE_ID=0x831cf24d48b4a426ee416581a6094f656a4348283db67b8ab5e589fce2b5dca4

# ID of the OracleCap object that gives the account authorization to validate scanner transactions
ORACLE_CAP_ID=0xf0efdb3caf0b7204e885915b2c6ad2b42df1f1f9c167385b1bd72127cc50272f

# Private key of the authorized Wallet/Oracle used to sign (bech32 format)
ORACLE_SECRET_KEY=iotaprivkey1qrvdxhu790v485j4jz9mmrm98f5u4avraevw6vc5ahl6hnt9xxxav7nl58y

# RPC endpoint used to connect to IOTA Testnet
NEXT_PUBLIC_IOTA_RPC_URL=https://api.testnet.iota.cafe

# Demo asset ID (value read from the `.env.local` file; update this field manually if you regenerate the mint)
NEXT_PUBLIC_DEMO_ASSET_ID=0x1ff6ac8a4e7e11118c53d6dd334ec0ff046f89588f8fe053cf2f8e3352c50e8a
```

*(Note: the `NEXT_PUBLIC_DEMO_ASSET_ID` value must be updated manually only if you decide to change the asset or mint again).*

---

## 🛠️ 2. Starting the Application (Frontend)

Once the `.env.local` file is present, open a new terminal, make sure you are in the project root folder (`progetto-finale-iota`) and run the following steps:

1. **Install all dependencies**:
   ```bash
   npm install
   ```
2. **Start the local web server**:
   ```bash
   npm run dev
   ```

At this point, the terminal will confirm that the application is listening on the indicated address.

---

## 🧪 3. Testing the Flow (MVP)

1. Open the web browser and go to the address provided by the terminal: **`http://localhost:3000`**.
2. **Create (Mint) a New Asset**:
   - Through the main interface, you can simulate the registration of a Digital Twin.
   - By clicking the dedicated button or loading a new item, the frontend will contact the internal backend API (`POST /api/mint`).
   - The API will sign and complete a transaction on IOTA Testnet to create a new on-chain object, while also updating the demo identifier in `.env.local` in the background.
3. **Simulating the Scan (Integrity Update)**:
   - Once the asset details are visible on screen, you can simulate a "Hardware Scanner" that evaluates the status of the luxury product.
   - Start the scan to call the `/api/scan` API. During this process, the Oracle signs the validity proof (using `ORACLE_SECRET_KEY` and `ORACLE_CAP_ID`) and authorizes the smart contract to update the parameters and tracking history.
   - Once the transaction is confirmed, the data will update automatically on the frontend, pulled in real time from the IOTA blockchain.

---

## 📋 4. (Advanced) How to Republish the Smart Contract

*(Skip this section if you are only testing the app without modifying the Move code).*

If you have customized files inside the `move/` folder, and you want the smart contract changes to take effect, you need to deploy again:

1. Open a terminal in the `move/` subfolder:
   ```bash
   cd move
   ```
2. Publish to the network (note: you must have `iota client` configured and connected to `testnet`, and have sufficient gas obtained via faucet):
   ```bash
   iota client publish --gas-budget 100000000
   ```
3. In the "Object Changes" section of the terminal log, note:
   - The new **Package ID** to replace in `NEXT_PUBLIC_PACKAGE_ID`.
   - The new ID of the object created as `OracleCap` to replace in `ORACLE_CAP_ID`.
4. Replace all of these fields inside the `.env.local` file and restart the Next.js development server (`Ctrl+C` then `npm run dev`) so it picks up the new variables.

---

## 🧠 5. Appendix: Behind the Scenes (IOTA CLI Commands Used)

To show how the whole project was set up from the beginning and how the various addresses and keys were generated, here is the logical flow of the **IOTA CLI** commands that were used to prepare the environment:

### A. Environment and Wallet Setup
1. **Configure the client for Testnet:**
   ```bash
   iota client new-env --alias testnet --rpc https://api.testnet.iota.cafe
   iota client switch --env testnet
   ```
   *(This configures your local client to point to the IOTA test network instead of Mainnet or Devnet).*

2. **Generate a new address for the main account:**
   ```bash
   iota client new-address ed25519
   ```
   *(Creates a new address that will act as creator and owner of the Package when the smart contract is published).*

3. **Request GAS (test IOTA) to pay for transactions:**
   ```bash
   iota client faucet
   ```
   *(Sends a request to the Testnet faucet to credit some free IOTA to the newly created address, which are needed to pay publication fees).*

### B. Oracle Key Setup (for the Frontend)
The Next.js application acts as an "Oracle" (or simulated scanner) that needs to *sign* validity transactions in the background without opening the user's wallet.
1. **Generate the private key (`ORACLE_SECRET_KEY`):**
   ```bash
   iota keytool generate ed25519
   ```
   *(This command prints an address and its associated private key in the `iotaprivkey...` format. We took this key and saved it in the `.env.local` file).*

### C. Build and Deploy the Move Smart Contract
1. **Compile the contract:**
   ```bash
   cd move
   iota move build
   ```
   *(Verifies that the `.move` code or the `Move.toml` file do not contain syntax errors).*

2. **Publish the contract on the blockchain:**
   ```bash
   iota client publish --gas-budget 100000000
   ```
   *(This is the key command. It sends the compiled bytecode to the network. The network executes the transaction, consumes the specified gas, and returns the **Package ID** and the list of generated objects. Among the objects generated by the contract's `init` function there is also the `OracleCap`, which we then inserted into the `.env.local` file to give the Oracle permissions to interact).*

---

**End.** The project is a prototype designed to test, at no cost and on the secure Testnet, the typical transactions for controlling the secondary market and integrity of goods through Web3.
