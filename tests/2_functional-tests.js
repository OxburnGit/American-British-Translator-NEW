const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    // Test 1: POST avec texte et locale valide
    test('Translation with text and locale fields', (done) => {
      chai.request(server)
        .post('/api/translate')
        .send({ text: "Mangoes are my favorite fruit.", locale: "american-to-british" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'text');
          assert.property(res.body, 'translation');
          assert.equal(res.body.translation, 'Mangoes are my <span class="highlight">favourite</span> fruit.');
          done();
        });
    });
  
    // Test 2: POST avec locale invalide
    test('Translation with invalid locale field', (done) => {
      chai.request(server)
        .post('/api/translate')
        .send({ text: "Mangoes are my favorite fruit.", locale: "invalid-locale" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid value for locale field');
          done();
        });
    });
  
    // Test 3: POST sans texte
    test('Translation with missing text field', (done) => {
      chai.request(server)
        .post('/api/translate')
        .send({ locale: "american-to-british" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });
  
    // Test 4: POST sans locale
    test('Translation with missing locale field', (done) => {
      chai.request(server)
        .post('/api/translate')
        .send({ text: "Mangoes are my favorite fruit." })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });
  
    // Test 5: POST avec texte vide
    test('Translation with empty text', (done) => {
      chai.request(server)
        .post('/api/translate')
        .send({ text: "", locale: "american-to-british" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'No text to translate');
          done();
        });
    });
  
    // Test 6: POST avec texte sans traduction nécessaire
    test('Translation with text that needs no translation', (done) => {
      chai.request(server)
        .post('/api/translate')
        .send({ text: "This text needs no translation.", locale: "american-to-british" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.translation, "Everything looks good to me!");
          done();
        });
    });
  });
  