#!/usr/bin/env node

const inquirer = require("inquirer");

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

    console.log("\n🎬 Movie Information:");
    console.log("Name:", movieName);
    console.log("Year:", movieYear);
    console.log("Quality:", movieQuality);
  } else {
    const { seriesName, seriesSeason, seriesEpisode, seriesQuality } =
      await tvSeries();
    console.log("\n📺 TV Series Info:");
    console.log("Name:", seriesName);
    console.log("Season:", seriesSeason);
    console.log("Episode:", seriesEpisode);
    console.log("Quality:", seriesQuality);
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
