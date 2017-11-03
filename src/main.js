'use strict';

import path from 'path';
import fromDir from './search_dir';
import process from 'process';
import fuzzy from 'fuzzy';
import inquirer from 'inquirer';
import inquirerAutocompletePrompt from 'inquirer-autocomplete-prompt';
import Loader from './loader';
import {passiveDownloader,
        interactiveDownloader}
         from '../../subscene_scraper/dist/main.bundle.js';

inquirer.registerPrompt('autocomplete', inquirerAutocompletePrompt);
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
  return async (answers, _input) => {
    const input = _input || '';
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


async function main() {
  const program = require('commander');
  program.version('0.1.0')
  .option('-m, --movie <string>', 'search movie')
  .option('-l, --language <cmd>', 'language')
  .option('-d, --directory <cmd>', 'directory')
  .option('-p, --path <cmd>', 'directory')
  .option('-c, --councurrency <i>', 'used with passive mode')
  .parse(process.argv);
let loader=new Loader();
  if (program.path) {
    loader.start('Detecting movies...')
    const files = await fromDir(program.path, ['.mp4', '.avi']);
    loader.stop('Detected:\n\t'+files.join('\n\t'));
    const councurrency = parseInt(program.councurrency) || 1;
    loader.start('Downloading subtitles')
    for (let i = 0; i < files.length; i += councurrency) {
      const pack = [];
      for (const file of files.slice(i, i + councurrency)) {
        const name = path.parse(file).name;
        const dir = path.resolve(path.dirname(file));
        const download = passiveDownloader(name, program.language, dir);
        pack.push(download);
      }
      await Promise.all(pack);
    }
    loader.stop('Downloaded!');
  }
  if (program.movie) {
    const movieName = program.movie;
    const language = program.language || 'english';
    const downloader=interactiveDownloader(movieName, language, '.');
    loader.start('Retreiving ...');
    downloader.on('info', async (info, choose)=>{
      loader.stop();
      const list =
      info.type ==='title'?resultToInquirerCheckBox(info.result):info.result;
      const {result: result} = await inquirer.prompt([
        {
          type: 'list',
          paginated: true,
          name: 'result',
          message: 'Choose movie Title',
          choices: list,
        },
      ]);
      if (info.type ==='title') {
        loader.start('Retreiving ...');
        choose(result);
      } else {
        loader.start('Downloading subtitle');
        choose(getURL(result, info.result));
      }
  }).on('title', async (list, choose)=>{
    loader.stop();
    const {release} = await inquirer.prompt([
      {
        type: 'autocomplete',
        name: 'release',
        message: 'Choose subtitle',
        source: searchFuzzy(list),
        pageSize: 4,
        validate: function(val) {
          return val
            ? true
            : 'Type something!';
        },
      },
    ]);
    loader.start('Downloading subtitle');
    choose(getURL(release, list));
  }).on('done', (result, movieName)=>{
    const msg=' at:\n\t'+result.join('\n\t');
    loader.stop('Downloaded subtitle for '+movieName+msg);
  });
  }
}
main();
