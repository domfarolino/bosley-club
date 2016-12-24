'use strict';

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const webdriver = require('selenium-webdriver');
const test = require('selenium-webdriver/testing'),
      By = webdriver.By,
      until = webdriver.until;

let driver = new webdriver.Builder().forBrowser('chrome').build();

test.describe('Suite 1', function() {
  this.timeout(30000); // may take a while

  beforeEach(function() {
    driver.get('http://localhost');
  });

  test.it('should render the header on load', function() {
    driver.findElement(webdriver.By.css('.header'))
      .then(element => expect(element).to.not.equal(null));
  });

  test.it('should render the navigation on load', function() {
    driver.findElement(webdriver.By.css('nav'))
      .then(element => expect(element).to.not.equal(null));
  });

  test.it('should render home content on root load', function() {
    driver.wait(until.elementLocated(webdriver.By.css('div[view].view-home')), 4000).getAttribute('route')
      .then(route => expect(route).to.equal('^/$'));
  });

  test.it('should render about content on /about load', function() {
    driver.get('http://localhost/about')
      .then(() => driver.wait(until.elementLocated(webdriver.By.css('div[view].view-about')), 4000).getAttribute('route'))
      .then(route => expect(route).to.equal('^/about(.*)'));
  });

  test.it('should render contact content on /contact load', function() {
    driver.get('http://localhost/contact')
      .then(() => driver.wait(until.elementLocated(webdriver.By.css('div[view].view-contact')), 4000).getAttribute('route'))
      .then(route => expect(route).to.equal('^/contact(.*)'));
  });

  test.it('should load about content when about link is clicked', function() {
    driver.findElement(By.id('a-about')).click()
      .then(() => {
        driver.wait(until.elementLocated(webdriver.By.css('div[view].view-about')), 4000).getAttribute('route')
          .then(route => expect(route).to.equal('^/about(.*)'));
      });
  });

  test.it('should load about content when about link is clicked', function() {
    driver.findElement(By.id('a-contact')).click()
      .then(() => {
        driver.wait(until.elementLocated(webdriver.By.css('div[view].view-contact')), 4000).getAttribute('route')
          .then(route => expect(route).to.equal('^/contact(.*)'));
      });
  });

  after(function(done) {
    done();
    driver.quit();
  });

});
