#!/usr/bin/env node

// Peerflix hasn't been updated in 5–7 years and still uses 'new Buffer()',
// which is deprecated in newer Node.js versions. It should be replaced with 'Buffer.alloc()', etc.
// Try to patch the package and fix it.
// The problem is that the project is developed using node20 but the pkg does not support node20 it uses the node18.
process.removeAllListeners("warning");
process.on("warning", (e) => {
  if (e.name === "DeprecationWarning" && e.code === "DEP0005") {
  } else {
    console.warn(e);
  }
});

const inquirer = require("inquirer");
const cheerio = require("cheerio");
const axios = require("axios");
const readline = require("readline");
const peerflix = require("peerflix");
const { spawn } = require("child_process");
const chalk = require("chalk");

// Handle crl+c
process.on("SIGINT", () => {
  console.log(
    chalk.red.bold(
      "\n🛑  Process interrupted. Exiting the application safely..."
    )
  );
  process.exit();
});

async function main() {
  const { contentType } = await inquirer.prompt([
    {
      type: "list",
      name: "contentType",
      message: "Select a content type:",
      choices: ["Movie", "TV Series"],
    },
  ]);

  if (contentType === "Movie") {
    const { movieName, movieYear, movieQuality } = await movie();

    const keyword = `${movieName} ${movieYear} ${movieQuality}`;
    console.log(chalk.blue.bold("\n🔍 Searching movies..."));

    const htmlResponse = await movieGet(keyword);
    const results = extractTop5Results(htmlResponse);

    // Remove "searching movies" line
    readline.moveCursor(process.stdout, 0, -2);
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);

    if (results.length == 0) {
      console.log(
        chalk.yellow.bold("\n⚠️  No Results Found: ") +
          chalk.yellow(
            "No torrent sources were found. Please try selecting a different quality option, or make sure you are using a valid and available movie with the correct year."
          )
      );
      process.exit(1);
    }

    while (true) {
      const option = await selectStreamOption(results);

      console.log(chalk.blue.bold("\n🔍 Extracting magnet link..."));
      const magnetURL = await getMagentURL(option.link);

      // Remove "Extracting magnet link" line
      readline.moveCursor(process.stdout, 0, -2);
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);

      console.log(
        chalk.green.bold("\n🔗 The magnet URL is: ") +
          chalk.white.underline(magnetURL) +
          "\n"
      );

      const success = await openInVlc(magnetURL);

      if (success) {
        break;
      }

      console.log(
        chalk.red.bold(
          "\n❌  Streaming failed: Unable to start the server. Please try another server option.\n"
        )
      );
    }
  } else {
    const { seriesName, seriesSeason, seriesEpisode, seriesQuality } =
      await tvSeries();

    const keyword = `${seriesName} s${seriesSeason}e${seriesEpisode} ${seriesQuality}`;
    console.log(chalk.blue.bold("\n🔍 Searching TV series..."));

    const htmlResponse = await tvGet(keyword);
    const results = extractTop5Results(htmlResponse);

    // Remove "Searching TV series" line
    readline.moveCursor(process.stdout, 0, -2);
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);

    if (results.length == 0) {
      console.log(
        chalk.yellow.bold("\n⚠️  No Results Found: ") +
          chalk.yellow(
            "No torrent sources were found. Please try selecting a different quality option, or make sure you are using a valid and available TV series with the correct season and episode number."
          )
      );

      process.exit(1);
    }

    while (true) {
      const option = await selectStreamOption(results);

      console.log(chalk.blue.bold("\n🔍 Extracting magnet link..."));
      const magnetURL = await getMagentURL(option.link);

      // Remove "Extracting magnet link" line
      readline.moveCursor(process.stdout, 0, -2);
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);

      console.log(
        chalk.green.bold("\n🔗 The magnet URL is: ") +
          chalk.white.underline(magnetURL) +
          "\n"
      );

      const success = await openInVlc(magnetURL);

      if (success) {
        break;
      }

      console.log(
        chalk.red.bold(
          "\n❌  Streaming failed: Unable to start the server. Please try another server option.\n"
        )
      );
    }
  }
}

async function movie() {
  const { movieName } = await inquirer.prompt([
    {
      type: "input",
      name: "movieName",
      message: "Enter the name of the movie:",
    },
  ]);

  const { movieYear } = await inquirer.prompt([
    {
      type: "input",
      name: "movieYear",
      message: "Enter the year of the movie:",
    },
  ]);

  const { movieQuality } = await inquirer.prompt([
    {
      type: "list",
      name: "movieQuality",
      message: "Select the quality you need to watch:",
      choices: ["360p", "480p", "720p", "1080p"],
    },
  ]);

  return { movieName, movieYear, movieQuality };
}

async function tvSeries() {
  const { seriesName } = await inquirer.prompt([
    {
      type: "input",
      name: "seriesName",
      message: "Enter the name of the TV series:",
    },
  ]);

  const { seriesSeason } = await inquirer.prompt([
    {
      type: "input",
      name: "seriesSeason",
      message: "Enter the season number:",
    },
  ]);

  const { seriesEpisode } = await inquirer.prompt([
    {
      type: "input",
      name: "seriesEpisode",
      message: "Enter the episode number:",
    },
  ]);

  const { seriesQuality } = await inquirer.prompt([
    {
      type: "list",
      name: "seriesQuality",
      message: "Select the quality you need to watch:",
      choices: ["360p", "480p", "720p", "1080p"],
    },
  ]);

  return { seriesName, seriesSeason, seriesEpisode, seriesQuality };
}

main();

function extractTop5Results(html) {
  const $ = cheerio.load(html);
  const results = [];
  const baseUrl = "https://1337x.to";

  const rows = $("table.table-list tbody tr").slice(0, 5);

  rows.each((index, element) => {
    const $row = $(element);

    const nameLinkElement = $row.find("td.coll-1.name a").eq(1);
    const name = nameLinkElement.text().trim();
    const relativeLink = nameLinkElement.attr("href");
    const torrentLink = relativeLink ? baseUrl + relativeLink : "N/A";

    const seeders =
      parseInt($row.find("td.coll-2.seeds").text().trim(), 10) || 0;
    const leechers =
      parseInt($row.find("td.coll-3.leeches").text().trim(), 10) || 0;
    const time = $row.find("td.coll-date").text().trim();

    const sizeElement = $row.find("td.coll-4");
    const size = sizeElement.contents().first().text().trim();

    const uploaderLinkElement = $row.find("td.coll-5 a");
    const uploader =
      uploaderLinkElement.length > 0
        ? uploaderLinkElement.text().trim()
        : "N/A";

    results.push({
      name: name,
      seeders: seeders,
      leechers: leechers,
      time: time,
      size: size,
      uploader: uploader,
      link: torrentLink,
    });
  });

  return results;
}

async function movieGet(keyword) {
  const url = `https://1337x.to/category-search/${encodeURIComponent(
    keyword
  )}/Movies/1/`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (error.code === "ENOTFOUND") {
      console.error(
        chalk.red.bold("❌ Network error:") +
          chalk.white(" Please check your internet connection.")
      );
    } else {
      console.error(
        chalk.red.bold("❌ Error:") + chalk.white(` ${error.message}`)
      );
    }
    process.exit(1);
  }
}

async function tvGet(keyword) {
  const url = `https://1337x.to/category-search/${encodeURIComponent(
    keyword
  )}/TV/1/`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (error.code === "ENOTFOUND") {
      console.error(
        chalk.red.bold("❌ Network error:") +
          chalk.white(" Please check your internet connection.")
      );
    } else {
      console.error(
        chalk.red.bold("❌ Error:") + chalk.white(` ${error.message}`)
      );
    }
    process.exit(1);
  }
}

function selectStreamOption(results) {
  const nameWidth = Math.max(...results.map((r) => r.name.length), 40);
  const sizeWidth = Math.max(...results.map((r) => String(r.size).length), 10);
  const seedersWidth = 8;
  const leechersWidth = 8;

  const header = `${"".padEnd(2)} ${"Name".padEnd(nameWidth)} | ${"Size".padEnd(
    sizeWidth
  )} | ${"Seeders".padEnd(seedersWidth)} | ${"Leechers".padEnd(leechersWidth)}`;
  const separator = "-".repeat(header.length);

  console.log(
    chalk.yellow.bold("\n 📡 Select the server you need to stream: \n")
  );

  console.log(header);
  console.log(separator);

  results.forEach((result, index) => {
    const line = `${String(index + 1).padEnd(3)}${result.name.padEnd(
      nameWidth
    )} | ${String(result.size).padEnd(sizeWidth)} | ${String(
      result.seeders
    ).padEnd(seedersWidth)} | ${String(result.leechers).padEnd(leechersWidth)}`;
    console.log(line);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    function ask() {
      rl.question(chalk.cyan.bold("\n👉 Enter your choice: "), (answer) => {
        const index = parseInt(answer) - 1;
        if (!isNaN(index) && index >= 0 && index < results.length) {
          rl.close();
          resolve(results[index]);
        } else {
          console.log(chalk.red.bold("❌ Invalid selection. Try again."));
          ask();
        }
      });
    }

    ask();
  });
}

async function getMagentURL(url) {
  try {
    const response = await axios.get(url);

    const regex = /var\s+mainMagnetURL\s*=\s*"(.*?)"\s*;/;

    const match = response.data.match(regex);

    if (match && match[1]) {
      return match[1];
    } else {
      console.error(
        chalk.red.bold("❌ Error:") +
          chalk.white(" mainMagnetURL not found in the HTML content.")
      );
      process.exit(1);
    }
  } catch (error) {
    if (error.code === "ENOTFOUND") {
      console.error(
        chalk.red.bold("❌ Network error:") +
          chalk.white(" Please check your internet connection.")
      );
    } else {
      console.error(
        chalk.red.bold("❌ Error:") + chalk.white(` ${error.message}`)
      );
    }
    process.exit(1);
  }
}

function openInVlc(magnetURL) {
  return new Promise((resolve) => {
    console.log(
      chalk.green.bold("🚀 Creating and starting the local streaming server...")
    );

    const engine = peerflix(magnetURL, { vlc: true });

    let isReady = false;

    // Set a 10-second timeout
    const timeout = setTimeout(() => {
      if (!isReady) {
        // Remove "Creating and starting the local streaming server" line
        readline.moveCursor(process.stdout, 0, -1);
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);

        engine.destroy();
        resolve(false);
      }
    }, 15_000);

    engine.on("ready", () => {
      isReady = true;
      clearTimeout(timeout);

      const url = `http://localhost:${engine.server.address().port}/`;

      // Remove "Creating and starting the local streaming server" line
      readline.moveCursor(process.stdout, 0, -1);
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);

      console.log(
        chalk.green.bold("📺 The video is streaming to: ") +
          chalk.cyan.underline(url)
      );

      console.log(
        chalk.cyan.bold("\n🎬 Opening video stream with VLC player...")
      );

      const vlc = spawn("vlc", [url]);

      vlc.on("spawn", () => {
        console.log(chalk.green.bold("\n✔️ VLC launched successfully"));

        console.log(
          chalk.yellow.bold("\n⚠️  Warning:") +
            chalk.yellow(
              " Please do not close this terminal — the streaming server will shut down if you do. Make sure the terminal stays open while streaming through VLC.\n" +
                " Also, if you decide to close VLC, please make sure to terminate this terminal as well — otherwise, the server will keep running in the background.\n"
            )
        );
        resolve(true);
      });

      vlc.on("error", (err) => {
        console.error(
          chalk.red.bold("\n❌ Failed to open VLC:"),
          chalk.red(err)
        );
        console.log(
          chalk.yellow(
            "\n⚠️  Please make sure VLC is installed and its path is added to your environment variables."
          )
        );
        console.log(
          chalk.yellow(
            "\n💡 Alternatively, you can copy the HTTP stream URL and open it in any video player that supports streaming.\n" +
              "⚠️  Regardless of whether you're using VLC or another player, please do not close this terminal — the streaming server will shut down if the terminal is closed.\n" +
              "⚠️  If you close video player, make sure to terminate this terminal manually as well — otherwise, the server will keep running in the background."
          )
        );
        resolve(true);
      });
    });
  });
}
