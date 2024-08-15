import {FastifyReply, FastifyRequest} from "fastify";
import {createUser, findUserByEmail, getAllUsers} from "./user.service";
import {CreateUserInput, LoginInput} from "./user.schema";
import {verifyPassword} from "../../utils/hash";
import {server} from "../../app";

export async function registerUserHandler(request: FastifyRequest<{
    Body: CreateUserInput;
}>, reply: FastifyReply) {

    const body = request.body;
    try {
        const user = await createUser(body);
        return reply.status(201).send(user)
    } catch (err) {
        console.log(err);
        return reply.status(500).send(err)
    }
}


export async function loginHandler(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {


    const body = request.body;


    //find a user by email

    const user = await findUserByEmail(body.email);

    if (!user) {
        return reply.status(401).send({
            message: "Invalid email or password",
        });
    }


    //verify password


    const correctPassword = verifyPassword({
        candidatePassword: body.password,
        salt: user.salt,
        hash: user.password

    })
    //generate token

    if (correctPassword) {
        const {password, salt, ...rest} = user


        return {accessToken: server.jwt.sign(rest)}

    }

    return reply.status(401).send({
        message: "Invalid email or password",
    })
    //respond
}


export async function getAllUsersHandler() {

    return getAllUsers();


}