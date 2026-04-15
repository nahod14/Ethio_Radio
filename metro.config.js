// Metro 0.83+ uses Array.prototype.toReversed (Node 20+). Polyfill for Node 18.
// Prefer Node >= 20.19.4 (see package.json engines) for full SDK 54 support.
if (typeof Array.prototype.toReversed !== 'function') {
  Array.prototype.toReversed = function toReversed() {
    return [...this].reverse();
  };
}

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
