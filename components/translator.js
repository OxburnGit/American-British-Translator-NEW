const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require('./british-only.js');

class Translator {
  constructor() {
    this.americanToBritish = { ...americanOnly, ...americanToBritishSpelling, ...americanToBritishTitles };
    this.britishToAmerican = {
      ...britishOnly,
      ...this.reverseDict(americanToBritishSpelling),
      ...this.reverseDict(americanToBritishTitles)
    };
  }

  reverseDict(dict) {
    return Object.fromEntries(Object.entries(dict).map(([key, value]) => [value, key]));
  }

  highlight(text) {
    return `<span class="highlight">${text}</span>`;
  }

  translate(text, locale) {
    let dictionary = locale === 'american-to-british' ? this.americanToBritish : this.britishToAmerican;
    let timeRegex = locale === 'american-to-british' ? /(\d{1,2}):(\d{2})/g : /(\d{1,2})\.(\d{2})/g;

    let translated = text;

    // Handle time conversion
    translated = translated.replace(timeRegex, (match) => {
      let newTime = locale === 'american-to-british' 
        ? match.replace(':', '.')
        : match.replace('.', ':');
      return this.highlight(newTime);
    });

    // Handle titles and other words
    Object.keys(dictionary).forEach((word) => {
      let wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
      translated = translated.replace(wordRegex, (match) => {
        let translation = dictionary[word];

        // If converting from American to British and the match has a period
        if (locale === 'american-to-british' && match.endsWith('.')) {
          return this.highlight(translation); // Just return the highlighted translation without the dot
        }

        // Handle capitalization if needed
        if (match[0] === match[0].toUpperCase()) {
          translation = translation.charAt(0).toUpperCase() + translation.slice(1);
        }
        
        return this.highlight(translation);
      });
    });

    translated = translated.replace('.</span>.', '</span>')
    return translated === text ? "Everything looks good to me!" : translated;
  }
}

module.exports = Translator;
