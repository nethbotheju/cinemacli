#!/usr/bin/env node

const inquirer = require("inquirer");
const cheerio = require("cheerio");
const axios = require("axios");

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
    const htmlResponse = await movieGet(keyword);
    const result = extractTop5Results(htmlResponse);
    console.log(result);
  } else {
    const { seriesName, seriesSeason, seriesEpisode, seriesQuality } =
      await tvSeries();

    const keyword = `${seriesName} s${seriesSeason}e${seriesEpisode} ${seriesQuality}`;
    const htmlResponse = await tvGet(keyword);
    const result = extractTop5Results(htmlResponse);
    console.log(result);
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
  const baseUrl = "https://1337x.to"; // Define the base URL

  // Select the table rows, limit to the first 5
  const rows = $("table.table-list tbody tr").slice(0, 5);

  rows.each((index, element) => {
    const $row = $(element);

    // Find the second <a> tag within the name column for name and link
    const nameLinkElement = $row.find("td.coll-1.name a").eq(1);
    const name = nameLinkElement.text().trim();
    const relativeLink = nameLinkElement.attr("href");
    const torrentLink = relativeLink ? baseUrl + relativeLink : "N/A";

    const seeders =
      parseInt($row.find("td.coll-2.seeds").text().trim(), 10) || 0;
    const leechers =
      parseInt($row.find("td.coll-3.leeches").text().trim(), 10) || 0;
    const time = $row.find("td.coll-date").text().trim();

    // Extract size text (it's the first text node within the td)
    const sizeElement = $row.find("td.coll-4");
    const size = sizeElement.contents().first().text().trim(); // Get only the first text node content

    // Find the uploader link text
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
    console.error("Error:", error.message);
    return "";
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
    console.error("Error:", error.message);
    return "";
  }
}
