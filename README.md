# movie-cli


### Build the Executable Files

1. **Bundle the Files with `ncc`**
   First, bundle your project files into a single file that can be read by Node.js:

   ```bash
   ncc build index.js
   ```

   This will create a new `index.js` file in the `dist/` folder.

2. **Remove the Webpack Line**
   Open the `dist/index.js` file and scroll to the end. On the 3rd-to-last line, you will find:

   ```js
   module.exports = __webpack_exports__;
   ```

   **Remove** this line and save the file.

3. **Build the Executable Files with `pkg`**
   Now, use `pkg` to create the executable files. Simply run:

   ```bash
   npm run build
   ```

   This will run the `pkg` command with the necessary configuration and create the platform-specific executables.

---

