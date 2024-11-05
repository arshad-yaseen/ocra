const {Ocra} = require('./build/index.js');

const ocra = new Ocra({
  provider: 'openai',
  key: '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',
});

(async () => {
  const contents = await ocra.pdf('./document.pdf');

  console.log(contents);
})();
