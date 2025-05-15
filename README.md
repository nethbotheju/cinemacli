# 🎬 CinemaCLI

**CinemaCLI** is a powerful command-line application that allows you to search, select, and stream movies or TV shows directly from torrent sources — all from your terminal.

---

## 🚀 Features
- Search movies and TV series by name, year, and more
- Browse through available torrent sources
- Stream selected torrents in real-time
- Creates a local server for streaming
- Integrates with VLC Media Player for playback

---

## 🛠 How It Works
1. Enter the title and year of the movie or show you want to watch.
2. CinemaCLI fetches torrent files from available sources.
3. Select the preferred torrent file.
4. A local server is created to stream the file in real-time.
5. The video streams and plays using VLC player.

---

## 📦 Installation

Precompiled versions of CinemaCLI are available for **macOS arm64** and **Windows x64**.

### macOS Installation:

1. Download the `cinemacli` executable from the [Releases Page](https://github.com/nethbotheju/cinemacli/releases).
2. Move the downloaded file to a directory of your choice.
3. Add the directory to your system’s `PATH` for easy access.
4. Use `cinemacli` from the terminal.

### Windows Installation:

1. Download the `cinemacli.exe` executable from the [Releases Page](https://github.com/nethbotheju/cinemacli/releases).
2. Move `cinemacli.exe` to a directory of your choice.
3. Add the directory to your system’s `PATH`.
4. Use `cinemacli` from Command Prompt or PowerShell.

---

## ▶️ Usage

```bash
cinemacli
```

Follow the prompts to search and stream your content.

---

## 📋 Requirements

* VLC Media Player (must be installed and accessible via the command line)

---

## 🐞 Reporting Issues

If you encounter any bugs, problems, or have feature requests, please open an issue on this repository. Your feedback helps improve CinemaCLI for everyone!

[Go to Issues](https://github.com/nethbotheju/cinemacli/issues)

---

## 🤝 Contribution

Contributions are **very welcome**! Whether it's fixing bugs, improving documentation, or adding new features — your help makes this project better.

Please fork the repository, make your changes in a separate branch, and submit a pull request with a clear description of your improvements.

---

## 🛠 Developer Setup Guide

For detailed instructions on how to build, run, and test CinemaCLI locally, please refer to the [DEVELOPMENT.md](./DEVELOPMENT.md) file.

---

## 🙏 Credits & Acknowledgements

CinemaCLI leverages the power of several open-source libraries and tools:

* [Axios](https://github.com/axios/axios) — Promise-based HTTP client for making API requests
* [Chalk](https://github.com/chalk/chalk) — Terminal string styling and coloring
* [Cheerio](https://github.com/cheeriojs/cheerio) — Fast, flexible, and lean implementation of core jQuery for server-side HTML parsing
* [Inquirer](https://github.com/SBoudrias/Inquirer.js) — Interactive command-line prompts
* [Peerflix](https://github.com/mafintosh/peerflix) — Streaming torrent client for Node.js
* [ncc](https://github.com/vercel/ncc) — CLI for compiling Node.js modules into a single file
* [pkg](https://github.com/vercel/pkg) — Package your Node.js project into an executable  
* [Node.js](https://nodejs.org/) — JavaScript runtime environment
* [VLC Media Player](https://www.videolan.org/vlc/) — Media player used for streaming playback

A big thank you to all the maintainers and contributors of these projects for their amazing work!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
You are free to use, modify, and distribute this software in accordance with the terms of the license.

---

Enjoy movies right from your terminal! 🍿