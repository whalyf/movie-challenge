const assert = require('assert');
const expect = require('chai').expect;

//const movie = require('../controllers/MovieController');


describe('Simple Math Test ASSERT', () => {
    it('should return 2', () => {
           assert.equal(1 + 1, 2);
       });
    it('should return 9', () => {
           assert.equal(3 * 3, 9);
       });
});


describe('Simple Math Test CHAI', () => {
    it('should return 2', () => {
           expect(1 + 1).to.equal(2);
       });
    it('should return 9', () => {
           expect(3 * 3).to.equal(9);
       });
});


/* describe('Movie Tests', () => {
    const mockMovie ={
        title: String('Hulk')
    }
    describe('get movie by title', () => {
        it('should be hulk movie',()=>{

        });
        movie.getMovie()

    });

});  */