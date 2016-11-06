var request = require('request')
    , express = require('express')
    ,assert = require("assert")
    ,http = require("http");

describe('http tests', function(){

    it('should go to login page if correct url is given', function(done){
        http.get('http://localhost:3000/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should not return the home page if url is wrong', function(done){
        http.get('http://localhost:3000/homeinvalidrequest', function(res) {
            assert.equal(404, res.statusCode);
            done();
        })
    });

    it('should fetch users to follow', function(done) {
        request.get(
            'http://localhost:3000/fetchToFollow',
             function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('should not go to profile page if not logged on', function(done) {
        request.post(
            'http://localhost:3000/ProfilePage',
            { form: { first_name: 'shailesh',last_name:'yedge',email:'yedgeshailesh@gmail.com',password:'11',userhandle:'shailesh11'}},
            function (error, response, body) {
                assert.equal(404, response.statusCode);
                done();
            }
        );
    });

    it('should not allow hash search if not logged in', function(done) {
        request.post(
            'http://localhost:3000/goToHashPage',
            { form: { username:'shaileshyedge1'}},
            function (error, response, body) {
                assert.equal(404, response.statusCode);
                done();
            }
        );
    });
});