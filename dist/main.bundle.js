#!/usr/bin/env node
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
module.exports = __webpack_require__(3);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var main = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var _this2 = this;

    var program, loader, files, councurrency, i, pack, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, file, name, dir, download, movieName, language, downloader;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            program = __webpack_require__(4);

            program.version('0.1.0').option('-m, --movie <string>', 'search movie').option('-l, --language <cmd>', 'language').option('-d, --directory <cmd>', 'directory').option('-p, --path <cmd>', 'download subtitle for all movies in path').option('-c, --councurrency <i>', 'used with passive mode').parse(_process2.default.argv);
            loader = new _loader2.default();

            if (!program.path) {
              _context4.next = 38;
              break;
            }

            _context4.next = 6;
            return (0, _search_dir2.default)(program.path, ['.mp4', '.avi']);

          case 6:
            files = _context4.sent;

            loader.stop('Detected:\n\t' + files.join('\n\t'));
            councurrency = parseInt(program.councurrency) || 1;

            loader.start(_chalk2.default.bold('Downloading subtitles'));
            i = 0;

          case 11:
            if (!(i < files.length)) {
              _context4.next = 37;
              break;
            }

            pack = [];
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context4.prev = 16;

            for (_iterator3 = files.slice(i, i + councurrency)[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              file = _step3.value;
              name = _path2.default.parse(file).name;
              dir = _path2.default.resolve(_path2.default.dirname(file));
              download = (0, _subscene_scraper.passiveDownloader)(name, program.language, dir);

              pack.push(download);
            }
            _context4.next = 24;
            break;

          case 20:
            _context4.prev = 20;
            _context4.t0 = _context4['catch'](16);
            _didIteratorError3 = true;
            _iteratorError3 = _context4.t0;

          case 24:
            _context4.prev = 24;
            _context4.prev = 25;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 27:
            _context4.prev = 27;

            if (!_didIteratorError3) {
              _context4.next = 30;
              break;
            }

            throw _iteratorError3;

          case 30:
            return _context4.finish(27);

          case 31:
            return _context4.finish(24);

          case 32:
            _context4.next = 34;
            return Promise.all(pack);

          case 34:
            i += councurrency;
            _context4.next = 11;
            break;

          case 37:
            loader.stop(successMessage(_chalk2.default.bold('Downloaded!')));

          case 38:
            if (program.movie) {
              movieName = program.movie;
              language = program.language || 'english';
              downloader = (0, _subscene_scraper.interactiveDownloader)(movieName, language, '.');

              loader.start(_chalk2.default.bold('Retreiving') + ' ...');
              downloader.on('info', function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(info, choose) {
                  var list, _ref4, result;

                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          loader.stop();
                          list = info.type === 'title' ? resultToInquirerCheckBox(info.result) : info.result;
                          _context2.next = 4;
                          return _inquirer2.default.prompt([{
                            type: 'list',
                            paginated: true,
                            name: 'result',
                            message: 'Choose movie Title',
                            choices: list
                          }]);

                        case 4:
                          _ref4 = _context2.sent;
                          result = _ref4.result;

                          if (info.type === 'title') {
                            loader.start(_chalk2.default.bold('Retreiving') + ' ...');
                            choose(result);
                          } else {
                            loader.start(_chalk2.default.bold('Downloading subtitles'));
                            choose(getURL(result, info.result));
                          }

                        case 7:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, _this2);
                }));

                return function (_x3, _x4) {
                  return _ref3.apply(this, arguments);
                };
              }()).on('title', function () {
                var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(list, choose) {
                  var _ref6, release;

                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          loader.stop();
                          _context3.next = 3;
                          return _inquirer2.default.prompt([{
                            type: 'autocomplete',
                            name: 'release',
                            message: 'Choose subtitle',
                            source: searchFuzzy(list),
                            pageSize: 4,
                            validate: function validate(val) {
                              return val ? true : 'Type something!';
                            }
                          }]);

                        case 3:
                          _ref6 = _context3.sent;
                          release = _ref6.release;

                          loader.start('Downloading subtitle');
                          choose(getURL(release, list));

                        case 7:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _callee3, _this2);
                }));

                return function (_x5, _x6) {
                  return _ref5.apply(this, arguments);
                };
              }()).on('done', function (result, movieName) {
                var msg = ' at:\n\t' + result.join('\n\t');
                loader.stop(successMessage(_chalk2.default.bold('Downloaded subtitle for ' + movieName + msg)));
              });
            }

          case 39:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[16, 20, 24, 32], [25,, 27, 31]]);
  }));

  return function main() {
    return _ref2.apply(this, arguments);
  };
}();

var _path = __webpack_require__(0);

var _path2 = _interopRequireDefault(_path);

var _search_dir = __webpack_require__(5);

var _search_dir2 = _interopRequireDefault(_search_dir);

var _process = __webpack_require__(9);

var _process2 = _interopRequireDefault(_process);

var _fuzzy = __webpack_require__(10);

var _fuzzy2 = _interopRequireDefault(_fuzzy);

var _inquirer = __webpack_require__(11);

var _inquirer2 = _interopRequireDefault(_inquirer);

var _inquirerAutocompletePrompt = __webpack_require__(12);

var _inquirerAutocompletePrompt2 = _interopRequireDefault(_inquirerAutocompletePrompt);

var _loader = __webpack_require__(13);

var _loader2 = _interopRequireDefault(_loader);

var _chalk = __webpack_require__(15);

var _chalk2 = _interopRequireDefault(_chalk);

var _subscene_scraper = __webpack_require__(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_inquirer2.default.registerPrompt('autocomplete', _inquirerAutocompletePrompt2.default);

function successMessage(str) {
  return _chalk2.default.green('*') + ' ' + str;
}

function sleep(seconds) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
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
  var _this = this;

  return function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(answers, _input) {
      var input, fuzzyResult;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              input = _input || '';
              _context.next = 3;
              return sleep(getRandomInt(30, 500));

            case 3:
              fuzzyResult = _fuzzy2.default.filter(input, arr.map(function (value) {
                return value.name;
              }));
              return _context.abrupt('return', fuzzyResult.map(function (el) {
                return el.original;
              }));

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
}

function resultToInquirerCheckBox(result) {
  var choices = [];
  for (var titleType in result) {
    if (result.hasOwnProperty(titleType)) {
      choices.push(new _inquirer2.default.Separator(titleType));
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = result[titleType][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var movie = _step.value;

          choices.push({ name: movie.name, value: movie.link });
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }
  return choices;
}
function getURL(name, result) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = result[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var releaseSubtitle = _step2.value;

      if (releaseSubtitle.name === name) {
        return releaseSubtitle.url;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}

main();

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("commander");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var findFilesByExt = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(startPath, extFilter) {
    var doesExist, result, files, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, filename, _stat, subResult;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return statP(startPath);

          case 2:
            doesExist = _context.sent;

            if (doesExist) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', Promise.reject(new Error('path' + startPath + ' does not exists')));

          case 5:
            result = [];
            _context.next = 8;
            return readdirP(startPath);

          case 8:
            files = _context.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 12;
            _iterator = files[Symbol.iterator]();

          case 14:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 32;
              break;
            }

            file = _step.value;
            filename = _path2.default.join(startPath, file);
            _context.next = 19;
            return lstatP(filename);

          case 19:
            _stat = _context.sent;

            if (!_stat.isDirectory()) {
              _context.next = 27;
              break;
            }

            _context.next = 23;
            return findFilesByExt(filename, extFilter);

          case 23:
            subResult = _context.sent;

            if (subResult.length != 0) {
              result = [].concat(_toConsumableArray(subResult), _toConsumableArray(result));
            }
            _context.next = 28;
            break;

          case 27:
            if (extFilter.indexOf(_path2.default.extname(filename)) >= 0) {
              result.push(filename);
            }

          case 28:
            ;

          case 29:
            _iteratorNormalCompletion = true;
            _context.next = 14;
            break;

          case 32:
            _context.next = 38;
            break;

          case 34:
            _context.prev = 34;
            _context.t0 = _context['catch'](12);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 38:
            _context.prev = 38;
            _context.prev = 39;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 41:
            _context.prev = 41;

            if (!_didIteratorError) {
              _context.next = 44;
              break;
            }

            throw _iteratorError;

          case 44:
            return _context.finish(41);

          case 45:
            return _context.finish(38);

          case 46:
            ;
            return _context.abrupt('return', result);

          case 48:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[12, 34, 38, 46], [39,, 41, 45]]);
  }));

  return function findFilesByExt(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _util = __webpack_require__(6);

var _fs = __webpack_require__(7);

var _path = __webpack_require__(0);

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

__webpack_require__(8).shim();


var readdirP = (0, _util.promisify)(_fs.readdir);
var lstatP = (0, _util.promisify)(_fs.lstat);
var statP = (0, _util.promisify)(_fs.stat);

;

exports.default = findFilesByExt;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("util.promisify");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("process");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("fuzzy");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("inquirer");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("inquirer-autocomplete-prompt");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bottomBar = __webpack_require__(14);

var _bottomBar2 = _interopRequireDefault(_bottomBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loader = function () {
  function Loader() {
    _classCallCheck(this, Loader);

    this.ui = '';
    this.word = '';
    this.loader = ['/', '|', '\\', '-'];
    this.i = 3;
    this.running = false;
  }

  _createClass(Loader, [{
    key: 'start',
    value: function start(word) {
      var _this = this;

      this.running = true;
      if (word) {
        this.word = ' ' + word;
      }
      this.ui = new _bottomBar2.default({ bottomBar: this.loader[this.i % 4] + this.word });
      this.timer = setInterval(function () {
        _this.ui.updateBottomBar(_this.loader[_this.i++ % 4] + _this.word);
      }, 200);
    }
  }, {
    key: 'stop',
    value: function stop(msg) {
      var output = msg ? msg + '\n' : '';
      if (this.running) {
        this.running = false;
        clearInterval(this.timer);
        this.ui.updateBottomBar(output);
        this.ui.close();
      }
    }
  }]);

  return Loader;
}();

;

exports.default = Loader;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("inquirer/lib/ui/bottom-bar");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("subscene_scraper");

/***/ })
/******/ ]);