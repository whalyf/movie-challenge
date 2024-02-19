import express from 'express';

import movie from './controllers/MovieController';
import user from './controllers/UserController';
import group from './controllers/GroupController';
import advice from './controllers/AdviceController';



const routes = express.Router();

//----------------------------------Movies----------------------------------
routes.get('/movie', movie.getMovie);
routes.post('/save', movie.saveMovie);
routes.get('/select', movie.selectMovie);


//----------------------------------Users----------------------------------
routes.post('/user', user.createUser);
routes.post('/rate', user.sendRating);
routes.put('/updateRate', user.updateRating);
routes.delete('/deleteReview', user.deleteReview);


//-----------------------------DiscussionGroups-----------------------------
routes.post('/group', group.createGroup);
routes.post('/sendDiscussion', group.sendDiscussion);

//----------------------------------Advice----------------------------------
routes.post('/askAdvice', advice.askAdvice);
routes.post('/sendAdvice', advice.sendAdvice);

export default routes;