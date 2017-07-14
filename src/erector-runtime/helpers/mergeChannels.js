import { ACTION_RUN } from '../../constants';
import { RESTANTE, CANCEL } from 'reciprocator';

function accost(dispatch, subject) {
  let next = function callback(promise) {
    next = promise;
  };
  dispatch({
    type: ACTION_RUN,
    subject: subject,
    props: undefined,
    next: next
  });
  return next;
}

function isFunction(subject) {
  return typeof subject === 'function';
}

/**
 * Marge two or many channels.
 * @example
 * const watchFile1 = yield watch('./a.js');
 * const watchFile2 = yield watch('./b.js');
 * const onAnyChange = yield mergeChannels(
 *  watchFile1.on('change'),
 *  watchFile2.on('change'),
 * );
 * while (true) {
 *  const file = yield onAnyChange();
 *  yield echo(`${file} has changed`);
 * }
 * // path/to/a.js has changes
 * // path/to/b.js has changes
 * @param  {...channels} ...channels
 * @return {function}
 */
export default function mergeChannels(...channels) {
  return function* (state, store) {
    const sequence = [];
    let enabled = true;
    let anticipant;

    for (let i = 0; i < channels.length; i++) {
      if (typeof channel !== 'function') {
        channels[i] = yield channels[i];
      }
    }

    channels = channels.filter(isFunction);

    const energizer = function(subject) {
      if (!enabled) {
        return;
      }
      accost(store.dispatch, subject)
      .then(function(next) {
        if (anticipant && enabled) {
          anticipant(next);
          anticipant = null;
        } else {
          sequence.push(next);
        }

        if (sequence.length > 200) {
          throw new Error("Dangerously count of observable result");
        }

        energizer(subject);
      });
    };

    channels.forEach(subject => energizer(subject));

    const batcher = function plural() {
      if (sequence.length) {
        return sequence.shift();
      } else {
        return new Promise(function(resolve, reject) {
          anticipant = resolve;
        });
      }
    }

    batcher[CANCEL] = function() {
      enabled = false;
    }

    batcher[RESTANTE] = true;

    yield batcher;
  }
}