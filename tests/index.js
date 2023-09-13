const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

chai.use(chaiHttp);
chai.should();

describe("Movies", () => {
  describe("GET /", () => {
    let statusNumber = [200, 500];

    it("should get all movies", (done) => {
      chai.request(app)
        .get('/api/movies')
        .end((err, res) => {
          res.body.should.be.a('object');

          if(statusNumber.includes(res.status)){
            res.body.should.have.property('message');
          }

          done();
        });
    });
    
    it("should get a single movie", (done) => {
      const id = 1;
      let statusNumber = [200, 404, 500];

      chai.request(app)
        .get(`/api/movies/${id}`)
        .end((err, res) => {
          res.body.should.be.a('object');

          if(statusNumber.includes(res.status)){
            res.body.should.have.property('message');
          }

          done();
        });
    });
  });

  describe("POST /", () => {
    it("should create a movie", (done) => {
      let statusNumber = [200, 404, 412, 500];

      chai.request(app)
        .post('/api/movies')
        .end((err, res) => {
          res.body.should.be.a('object');

          if(statusNumber.includes(res.status)){
            if(res.status == 200){
              res.body.should.have.data('data');
            }else if(res.status == 412){
              res.body.should.have.property('validation_message');
            }
            res.body.should.have.property('message');
          }

          done();
        });
    });
  });
  
  describe("PUT /", () => {
    it("should update a movie", (done) => {
      const id = 1;
      let statusNumber = [200, 404, 412, 500];
      chai.request(app)
        .put(`/api/movies/${id}`)
        .end((err, res) => {
          res.body.should.be.a('object');
          
          if(statusNumber.includes(res.status)){
            if(res.status == 412){
              res.body.should.have.property('validation_message');
            }
            res.body.should.have.property('message');
          }

          done();
        });
    });
  });

  describe("DELETE /", () => {
    it("should delete a movie", (done) => {
      const id = 1;
      let statusNumber = [200, 404, 500]
      chai.request(app)
        .delete(`/api/movies/${id}`)
        .end((err, res) => {
          res.body.should.be.a('object');
  
          if(statusNumber.includes(res.status)){
            res.body.should.have.property('message');
          }
          done();
        });
    });
  });

});