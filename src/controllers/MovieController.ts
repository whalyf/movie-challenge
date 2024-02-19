import pool from '../database/connection';
import { Request, Response} from 'express';
import axios, {AxiosResponse } from 'axios';

interface MovieAttributes{
	title: string,
	genre: string,
	actors: string,
	director: string
};

const getMovie = async (request:Request, response:Response)=>{
	const titleSearch = request.body.title;
	try{
		const moviesFound:AxiosResponse =  await axios.get(`http://www.omdbapi.com/?i=tt3896198&apikey=8b187242&s=${titleSearch}`);
		return response.status(200).json({message: moviesFound.data});
	}catch(err){
		console.error('ERROR_SEARCHING_MOVIES', err);
	}
};

const saveMovie = async (request:Request, response:Response)=>{
	const imdbId = request.body.imdbId;
	const userId = String(request.headers.cpf);
	const isPublic = request.body.isPublic;

	try{
		const movieSave:AxiosResponse =  await axios.get(`http://www.omdbapi.com/?i=${imdbId}&apikey=8b187242`);
		const movie:MovieAttributes ={
			title: movieSave.data["Title"],
			genre: movieSave.data["Genre"],
			actors: movieSave.data["Actors"],
			director: movieSave.data["Director"]
		};
		const verifyMovieId = `SELECT * FROM "WISHLIST" WHERE id='${imdbId}'`;
		await pool.query(verifyMovieId,(err:any, result:any)=>{
			if (err) console.error(err);
			else
				if(result.rowCount === 1)
					return response.status(200).json({message: 'This movie is already in the list'});
			else{
				const query = `INSERT INTO "WISHLIST" ("id", "title", "genre", "actors", "director", "isPublic", "userId") VALUES ('${imdbId}','${movie.title}', '${movie.genre}', '${movie.actors}', '${movie.director}', '${isPublic}', '${userId}')`
			
				pool.query(query,(err:any, result:any)=>{
					if (err) console.error(err);
					else
					return response.status(200).json({message: movie.title + ' Saved'});
				});
			}
		});

	}catch(err){
		console.error('ERROR_SAVING_MOVIE', err);
	}
};

const selectMovie = async (request:Request, response:Response)=>{
	const movie:MovieAttributes ={
		title: String(request.query['title']),
		genre: String(request.query['genre']),
		actors: String(request.query['actors']),
		director: String(request.query['director'])
	};

 	try{
		const query = `SELECT title, actors, genre, director FROM "WISHLIST" WHERE title='${movie.title}' OR genre='${movie.genre}' OR actors='${movie.actors}' OR director='${movie.director}'`;
		await pool.query(query,(err:any, result:any)=>{
			if (err) console.error(err);
			else
			return response.status(200).json(result.rows);
		});
	}catch(err){
		console.error('ERROR_SAVING_MOVIE', err);
	}
}

export default{getMovie, saveMovie, selectMovie};
