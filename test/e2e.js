'use strict';

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const startServerChildProcess = require('./spawnProcess').startServerChildProcess;
const killServerChildProcess = require('./spawnProcess').killServerChildProcess;
const childProcess = startServerChildProcess();

const webdriver = require('selenium-webdriver');
const test = require('selenium-webdriver/testing'),
      By       = webdriver.By,
      until    = webdriver.until,
      describe = test.describe,
      it       = test.it;

let driver = new webdriver.Builder().forBrowser('chrome').build();

describe('Suite 1', function() {
  this.timeout(30000); // may take a while

  beforeEach(function() {
    driver.get('http://localhost:8080');
  });

  it('should render the header on load', function() {
    driver.findElement(webdriver.By.css('.header'))
      .then(element => expect(element).to.not.equal(null));
  });

  it('should render the navigation on load', function() {
    driver.findElement(webdriver.By.css('nav'))
      .then(element => expect(element).to.not.equal(null));
  });

  it('should render home content on root load', function() {
    driver.wait(until.elementLocated(webdriver.By.css('div[view].view-home')), 4000).getAttribute('route')
      .then(route => expect(route).to.equal('^/$'));
  });

  it('should render about content on /about load', function() {
    driver.get('http://localhost:8080/about')
      .then(() => driver.wait(until.elementLocated(webdriver.By.css('div[view].view-about')), 4000).getAttribute('route'))
      .then(route => expect(route).to.equal('^/about(.*)'));
  });

  it('should render contact content on /contact load', function() {
    driver.get('http://localhost:8080/contact')
      .then(() => driver.wait(until.elementLocated(webdriver.By.css('div[view].view-contact')), 4000).getAttribute('route'))
      .then(route => expect(route).to.equal('^/contact(.*)'));
  });

  it('should load about content when about link is clicked', function() {
    driver.findElement(By.id('a-about')).click()
      .then(() => {
        driver.wait(until.elementLocated(webdriver.By.css('div[view].view-about')), 4000).getAttribute('route')
          .then(route => expect(route).to.equal('^/about(.*)'));
      });
  });

  it('should load about content when about link is clicked', function() {
    driver.findElement(By.id('a-contact')).click()
      .then(() => {
        driver.wait(until.elementLocated(webdriver.By.css('div[view].view-contact')), 4000).getAttribute('route')
          .then(route => expect(route).to.equal('^/contact(.*)'));
      });
  });

  after(function(done) {
    killServerChildProcess(childProcess.pid);
    done();
    driver.quit();
  });

});
