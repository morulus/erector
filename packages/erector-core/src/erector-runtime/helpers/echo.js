import dispatch from './dispatch';
import digest from './digest';
import {
  ECHO
} from '../../constants';

const ECHO_TYPE_DEFAULT = 0;
const ECHO_TYPE_LOG = 1;
const ECHO_TYPE_SUCCESS = 2;
const ECHO_TYPE_ERROR = 3;
const ECHO_TYPE_WARN = 4;
const ECHO_TYPE_NOTE = 5;
const ECHO_TYPE_HEADER = 6;
const ECHO_TYPE_OK = 7;
const ECHO_TYPE_INLINE = 8;
const ECHO_TYPE_CLEAR = 9;

function noop() { return true; }

function typeEcho(messages, type) {
  return function* () {
    for (let i = 0;i < messages.length;++i) {
      if (typeof messages[i] !== 'string') {
        messages[i] = yield digest(messages[i]);
      }
    }

    yield dispatch({
      type: ECHO,
      message: messages,
      messageType: type
    });
    yield true;
  }
}

/**
 * Print a message to the terminal (like console.log)
 * Has static methods:
 * - echo.success Satisfactory message
 * - echo.warn Waning
 * - echo.note Notification
 * - echo.error Error
 * - echo.clear Clear terminal
 * @example
 * yield echo.clear();
 * yield echo('Welcome');
 * yield echo.note('to');
 * yield echo.warn('the');
 * yield echo.success('Erector');
 * @param  {...*} ...messages One or many messages
 */
const echo = function echo(...messages) {
  return typeEcho(messages, ECHO_TYPE_DEFAULT);
}

/**
* Echo log message
*/
echo.log = function echo(...messages) {
  return typeEcho(messages, ECHO_TYPE_LOG);
}

/**
* Success log message
*/
echo.success = function echoSuccess(...messages) {
  return typeEcho(messages, ECHO_TYPE_SUCCESS);
}

/**
* Success point
*/
echo.ok = function echoOk(...messages) {
  return typeEcho(['✓'].concat(messages), ECHO_TYPE_OK);
}

/**
* Echo error message
*/
echo.error = function echoError(...messages) {
  return typeEcho(messages, ECHO_TYPE_ERROR);
}

/**
* Echo warning
*/
echo.warn = function echoWarn(...messages) {
  return typeEcho(messages, ECHO_TYPE_WARN);
}

/**
* Echo debug message (only for development mode)
*/
echo.debug = function echoDebug(...messages) {
  return process.env.NODE_ENV==='development' ? typeEcho(messages, ECHO_TYPE_WARN) : noop;
}

echo.note = function echoHappy(...messages) {
  return typeEcho(messages, ECHO_TYPE_NOTE);
}

echo.header = function echoHappy(...messages) {
  return typeEcho(messages, ECHO_TYPE_HEADER);
}

echo.clear = function() {
  return typeEcho([], ECHO_TYPE_CLEAR);
}

echo.type = function(type, ...messages) {
  return typeEcho(messages, type);
}

echo.inline = function(...messages) {
  return typeEcho(messages, ECHO_TYPE_INLINE);
}

export default echo;