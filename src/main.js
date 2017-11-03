'use strict';

import path from 'path';
import fromDir from './search_dir';
import process from 'process';
import fuzzy from 'fuzzy';
import inquirer from 'inquirer';
import inquirerAutocompletePrompt from 'inquirer-autocomplete-prompt';
import {passiveDownloader,
        downloadReleaseSubtitle,
        getTitleSubtitles,
        getMovieSubtitleDetails}
         from '../../subscene_scraper/dist/main.bundle.js';

function sleep(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(seconds);
    }, seconds);
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function searchFuzzy(arr) {
  return async (answers, input) => {
    input = input || '';
    await sleep(getRandomInt(30, 500));
    const fuzzyResult = fuzzy.filter(input, arr.map(function(value) {
      return value.name;
    }));
    return fuzzyResult.map(function(el) {
      return el.original;
    });
  };
}

function resultToInquirerCheckBox(result) {
  const choices = [];
  for (const titleType in result) {
    if (result.hasOwnProperty(titleType)) {
      choices.push(new inquirer.Separator(titleType));
      for (const movie of result[titleType]) {
        choices.push({name: movie.name, value: movie.link});
      }
    }
  }
  return choices;
}
function getURL(name, result) {
  for (const releaseSubtitle of result) {
    if (releaseSubtitle.name === name) {
      return releaseSubtitle.url;
    }
  }
}

inquirer.registerPrompt('autocomplete', inquirerAutocompletePrompt);
async function main() {
  const program = require('commander');
  program.version('0.1.0')
  .option('-m, --movie <string>', 'search movie')
  .option('-l, --language <cmd>', 'language')
  .option('-d, --directory <cmd>', 'directory')
  .option('-p, --path <cmd>', 'directory')
  .option('-c, --councurrency <i>', 'used with passive mode')
  .parse(process.argv);

  if (program.path) {
    const files = await fromDir(program.path, ['.mp4', '.avi']);
    console.log('detected', files.join('\n\t '));
    const councurrency = parseInt(program.councurrency) || 1;
    for (let i = 0; i < files.length; i += councurrency) {
      const pack = [];
      for (const file of files.slice(i, i + councurrency)) {
        const name = path.parse(file).name;
        const dir = path.resolve(path.dirname(file));
        console.log(name, program.language, 5);
        const download = passiveDownloader(name, program.language, dir);
        pack.push(download);
      }
      const result = await Promise.all(pack);

      for (const subtitle of result) {
        console.log('downloaded', subtitle);
      }
    }
  }

  if (program.movie) {
    const movieName = program.movie;
    const language = program.language || 'english';
    const subtitle = await getMovieSubtitleDetails(movieName, language, false);
    console.log('type:', subtitle.type, ', language:', language);
    if (subtitle.type === 'title') {
      const arr = resultToInquirerCheckBox(subtitle.result);
      const {exactTitle: titleUrl} = await inquirer.prompt([
        {
          type: 'list',
          paginated: true,
          name: 'exactTitle',
          message: 'Choose movie Title',
          choices: arr,
        },
      ]);

      let titleSubtitles =
      await getTitleSubtitles({url: titleUrl, lang: language});
      const {release} = await inquirer.prompt([
        {
          type: 'autocomplete',
          name: 'release',
          message: 'Choose subtitle',
          source: searchFuzzy(titleSubtitles),
          pageSize: 4,
          validate: function(val) {
            return val
              ? true
              : 'Type something!';
          },
        },
      ]);

      const releaseURL = getURL(release, titleSubtitles);
      let result = await downloadReleaseSubtitle(releaseURL);
      console.log('downloaded', result);
    } else {
      const {release} = await inquirer.prompt([
        {
          type: 'autocomplete',
          name: 'release',
          message: 'Choose subtitle',
          source: searchFuzzy(subtitle.result),
          pageSize: 4,
          validate: function(val) {
            return val
              ? true
              : 'Type something!';
          },
        },
      ]);
      const releaseURL = getURL(release, subtitle.result);
      let result = await downloadReleaseSubtitle(releaseURL);
      console.log('downloaded', result);
    }
  }
}
main();
