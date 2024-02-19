import pool from '../database/connection';
import { Request, Response} from 'express';

interface User{
	id: string,
	name: string
};

interface MovieRating{
	movieId: string,
	userId: string,
	isPublic: boolean,
	comment: string,
	rating: number
};

const createUser = async (request:Request, response:Response)=>{
	const user:User ={
		id: request.body.cpf,
		name: request.body.name
	};

	try{
		const query = `INSERT INTO "USERS" ("id", "name") VALUES ('${user.id}','${user.name}')`;

		await pool.query(query,(err:any, result:any)=>{
			if (err){ 
				switch (err.code){
					case '23505':
						return response.json({message: 'Error '+ err.code + ' - This user already exists'});
					default:
						return response.json(err);
				}
			}
			else
				return response.status(200).json({message: user.name + ' Saved'});
		})
	}catch(err){
		console.error('ERROR_SAVING_USER', err);
	}
};

const sendRating = async (request:Request, response:Response)=>{
	const rate:MovieRating = {
		movieId: request.body.movieId,
		userId: request.body.cpf,
		isPublic: request.body.isPublic,
		comment: request.body.comment,
		rating: request.body.rating
	};

	if((rate.rating < 1) || (rate.rating > 5))
		return response.status(400).json({message: 'Rate must be in the range 1 to 5'});

	try{
		const verifyComment = `SELECT * FROM "RATING" WHERE "movieId"='${rate.movieId}' AND "userId"='${rate.userId}' AND "comment"='${rate.comment}'`;
		await pool.query(verifyComment,(err:any, result:any)=>{
			if (err){
				return response.json({message: 'Error '+ err.code});
			}
			else{
				if(result.rowCount === 1)
					return response.status(200).json({message: 'This comment already exists'});
				else{
					const query = `INSERT INTO "RATING" ("movieId", "userId", "isPublic", "comment", "rating") VALUES ('${rate.movieId}','${rate.userId}','${rate.isPublic}','${rate.comment}','${rate.rating}')`;
					pool.query(query,(err:any, result:any)=>{
						if (err){
							switch (err.code){
								case '23503':
									return response.json({message: 'Error '+ err.code + ' - User or movie incorrect'});
								default:
									return response.json(err);
							}
						}
						else
							return response.status(200).json({message: 'Rated'});
					});

				}
			}
		});
	}catch(err){
		console.error('ERROR_SAVING_RATING', err);
	}
};

const updateRating = async (request:Request, response:Response)=>{
	const rate:MovieRating = {
		movieId: String(request.headers.movieid),
		userId: String(request.headers.cpf),
		isPublic: request.body.isPublic,
		comment: request.body.comment,
		rating: request.body.rating
	};

	if((rate.rating < 1) || (rate.rating > 5))
		return response.status(400).json({message: 'Rate must be in the range 1 to 5'});

	try{
		const queryId = `SELECT id FROM "RATING" WHERE "userId"='${rate.userId}' AND "movieId"='${rate.movieId}'`;
		const query = `UPDATE "RATING" SET "isPublic"=${rate.isPublic}, comment='${rate.comment}', "rating"=${rate.rating} WHERE id=(${queryId})`;

		await pool.query(query,(err:any, result:any)=>{
			if (err){
				switch (err.code){
					case '23503':
						return response.json({message: 'Error '+ err.code + ' - User or movie incorrect'});
					case '23505':
						return response.json({message: 'Error '+ err.code + ' - This comment already exists'});
					default:
						return response.json(err);
				}
			}
			else
				return response.status(200).json({message: 'Review updated'});
		});
	}catch(err){
		console.error('ERROR_UPDATING_REVIEW', err);
	}
};

const deleteReview = async (request:Request, response:Response)=>{
	const rate:MovieRating = {
		movieId: String(request.headers.movieid),
		userId: String(request.headers.cpf),
		isPublic: false,
		comment: '',
		rating: 0
	};

	try{
		const queryId = `SELECT id FROM "RATING" WHERE "userId"='${rate.userId}' AND "movieId"='${rate.movieId}'`;
		const query = `DELETE FROM "RATING" WHERE id=(${queryId})`;

		await pool.query(query,(err:any, result:any)=>{
			if (err){
				switch (err.code){
					case '23503':
						return response.json({message: 'Error '+ err.code + ' - User or movie incorrect'});
					case '23505':
						return response.json({message: 'Error '+ err.code + ' - This comment already exists'});
					default:
						return response.json(err);
				}
			}
			else
				return response.status(200).json({message: 'Review deleted'});
		});
	}catch(err){
		console.error('ERROR_UPDATING_REVIEW', err);
	}
};

export default {createUser, sendRating, updateRating, deleteReview};