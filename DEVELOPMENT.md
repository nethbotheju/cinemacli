# Developer Setup Guide

This document contains instructions for developers who want to build, run, and test **CinemaCLI** locally.

---

## 1. Clone the Repository

```bash
git clone https://github.com/nethbotheju/cinemacli.git
cd cinemacli
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Run the Application Directly

You can run the CLI directly using:

```bash
node index.js
```

---

## 4. Build Executable (Optional)

If you'd like to create a standalone executable for testing purposes, follow these steps:

### Step 1: Install Required Tools

Make sure you have [`pkg`](https://www.npmjs.com/package/pkg) and [`@vercel/ncc`](https://www.npmjs.com/package/@vercel/ncc) installed globally:

```bash
npm install -g pkg
npm install -g @vercel/ncc
```

### Step 2: Bundle the Application with `ncc`

Bundle your project files into a single output file:

```bash
ncc build index.js
```

This will create a bundled file inside the `dist/` folder:
`dist/index.js`

### Step 3: Remove Webpack Line (Manual Step)

Open the `dist/index.js` file and scroll to the bottom. You will find the following line (usually third from the end):

```js
module.exports = __webpack_exports__;
```

**Delete this line** to prevent issues during packaging.

### Step 4: Build Executables Using `pkg`

Run the following commands to generate executables for different platforms:

```bash
npm run build:win-x64
npm run build:mac-arm64
```

These scripts should be defined in your `package.json` and use `pkg` under the hood to generate the `.exe` (for Windows) and binary (for macOS).

---

## 5. Test the Executable

Run the generated executable directly from the terminal:

```bash
./dist/cinemacli         # macOS
./dist/cinemacli.exe     # Windows
```

Ensure VLC is installed and accessible from your terminal/command prompt.
