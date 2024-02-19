import pool from '../database/connection';
import { Request, Response} from 'express';


interface Advice{
    movieRateId: number,
    adviceRequestId: number
}

interface RequestAdvice{
    requestAdvice: string
}

const askAdvice = async (request:Request, response:Response)=>{
    const requestAdvice:RequestAdvice ={
		requestAdvice: request.body.requestAdvice
	};

	try{
		const query = `INSERT INTO "ADVICEREQUEST" ("request") VALUES ('${requestAdvice.requestAdvice}')`;

		await pool.query(query,(err:any, result:any)=>{
			if (err) console.error(err);
			else
				return response.status(200).json({message: requestAdvice.requestAdvice + ' Created'});
		})
	}catch(err){
		console.error('ERROR_CREATING_REQUEST_ADVICE', err);
	}
};

const sendAdvice = async (request:Request, response:Response)=>{
    const advice:Advice ={
		movieRateId: request.body.movieRateId,
        adviceRequestId: request.body.adviceRequestId
	};

	try{
		const query = `INSERT INTO "ADVICE" ("movieRateId", "adviceRequestId") VALUES ('${advice.movieRateId}','${advice.adviceRequestId}')`;

		await pool.query(query,(err:any, result:any)=>{
			if (err){
				if(err.code == 23503)
					return response.status(400).json({message:'Movie or Request Forum does not exists'});

				console.error(err.code);
			}
			else
				return response.status(200).json({message:'Advice Sent'});
		})
	}catch(err){
		console.error('ERROR_SENDING_ADVICE', err);
	}
};

export default {askAdvice, sendAdvice};