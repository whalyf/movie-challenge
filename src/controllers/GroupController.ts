import pool from '../database/connection';
import { Request, Response} from 'express';

interface Group{
    groupName: string
	isPublic: boolean,
    description: string
};

interface Discussion{
    groupId: string
	userId: string,
    argument: string
};

const createGroup = async (request:Request, response:Response)=>{
    const group:Group ={
		groupName: request.body.groupName,
        isPublic: request.body.isPublic,
        description: request.body.description
	};

	try{
		const query = `INSERT INTO "GROUPS" ("groupName", "isPublic", "description") VALUES ('${group.groupName}','${group.isPublic}','${group.description}')`;

		await pool.query(query,(err:any, result:any)=>{
			if (err) console.error(err);
			else
				return response.status(200).json({message: group.groupName + ' Created'});
		})
	}catch(err){
		console.error('ERROR_SAVING_USER', err);
	}
};

const sendDiscussion = async (request:Request, response:Response)=>{
    const discussion:Discussion ={
		groupId: String(request.headers.groupid),
        userId: String(request.headers.cpf),
        argument: request.body.argument
	};

	try{
		const query = `INSERT INTO "DISCUSSIONS" ("groupId", "userId", "argument") VALUES ('${discussion.groupId}','${discussion.userId}','${discussion.argument}')`;

		await pool.query(query,(err:any, result:any)=>{
			if (err) console.error(err);
			else
				return response.status(200).json({message: 'Discussion Created'});
		})
	}catch(err){
		console.error('ERROR_SAVING_USER', err);
	}
};

export default {createGroup, sendDiscussion};