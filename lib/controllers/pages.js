module.exports = {
  index: (request, response) => {
    console.log('pages.js handling request');
    response.sendFile('/../../public/index.html', {'root': __dirname});
  }
}
