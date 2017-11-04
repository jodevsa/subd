'use strict';

import path from 'path';
import fromDir from './search_dir';
import process from 'process';
import fuzzy from 'fuzzy';
import inquirer from 'inquirer';
import inquirerAutocompletePrompt from 'inquirer-autocomplete-prompt';
import Loader from './loader';
import chalk from 'chalk';
import {passiveDownloader, interactiveDownloader} from 'subscene_scraper';

inquirer.registerPrompt('autocomplete', inquirerAutocompletePrompt);

function successMessage(str) {
  return chalk.green('*')+' '+str;
}
function print(str, showVer, ver) {
  if (ver>=parseInt(showVer)) {
    console.log(chalk.blue('*')+'\t'+str);
  }
}
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


function makeArrayFlat(array) {
return array.reduce((total, arr)=>{
return [...total, ...arr];
}, []);
}
async function main() {
  const program = require('commander');
  program.version('0.0.7')
  .option('-s, --search <s>', 'Search movie')
  .option('-l, --language <value>', 'Subtitle Language | DEFAULT=english')
  .option('-d, --directory <value>',
  'Directory to save subtitle at | DEFAULT=./')
  .option('-p, --path <s>', 'Download subtitle for all movies in path')
  .option('-c, --concurrency <n>',
  'Used to assign number of concurrent download with -p DEFAULT=2')
  .option('-v, --verbose <integer>', 'A value that can be increased')
  .parse(process.argv);
  let loader=new Loader();
  if (program.path) {
    const verboseLevel=program.verbose || 1;
    print(chalk.bold('Verbosity level = '+verboseLevel), 2, verboseLevel);
    const files = await fromDir(program.path, ['.mp4', '.avi']);
    let subs=files.length;
    loader.stop('Detected:\n\t'+files.join('\n\t'));
    print(chalk.bold('Detected:\n\t')+chalk.cyan(files.join('\n\t'))
    , 2, verboseLevel);
    const councurrency = parseInt(program.concurrency) || 2;
    loader.start(chalk.bold('Downloading subtitles'
    +chalk.blue(' ['+subs+']')));
    for (let i = 0; i < files.length; i += councurrency) {
      const pack = [];
      for (const file of files.slice(i, i + councurrency)) {
        const name = path.parse(file).name;
        const dir = path.resolve(path.dirname(file));
        const download = passiveDownloader(name, program.language, dir);
        pack.push(download);
      }
      const result=await Promise.all(pack);
      if (verboseLevel >=2) {
      const msg='\n\tDownloaded:\n\t\t'+makeArrayFlat(result).join('\n\t\t');
      print(chalk.bold(msg), 2, verboseLevel);
    }
    }
    loader.stop(successMessage(chalk.bold('Downloaded!')));
  }
  if (program.search) {
    const saveLocation=program.directory || './';
    const movieName = program.search;
    const language = program.language || 'english';
    const downloader=interactiveDownloader(movieName, language, saveLocation);
    loader.start(chalk.bold('Retreiving')+' ...');
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
        loader.start(chalk.bold('Retreiving')+' ...');
        choose(result);
      } else {
        loader.start(chalk.bold('Downloading subtitles'));
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
    loader.stop(
      successMessage(chalk.bold('Downloaded subtitle for '+movieName+msg)));
  });
  }
}

main();
