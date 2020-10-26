module.exports = (title, body) => `
  <!DOCTYPE html>
  <html>

  <head>
    <title>${title}</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
    <script src="https://unpkg.com/fxjs/dist/fx.min.js"></script>
    <script src="/javascripts/$.js"></script>
  </head>

  <body>
    ${body}
  </body>

  </html>
`;