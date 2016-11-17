module.exports = {
  index: (request, response) => {
    response.sendFile('index.html', {'root': __dirname});
  }
}
