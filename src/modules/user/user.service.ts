import prisma from "../../utils/prisma";
import {CreateUserInput} from "./user.schema";
import {hashPassword} from "../../utils/hash";

import * as argon2 from "argon2";


export async function createUser(input: CreateUserInput) {

    const {password, ...rest} = input;


    const {hash, salt} = hashPassword(password);


    // const hash = await argon2.hash(password);


    return prisma.user.create({
        data: {...rest, salt, password: hash},
    });


}


export async function findUserByEmail(email: string) {

    return prisma.user.findUnique({where: {email}});
}


export async function getAllUsers() {
    return prisma.user.findMany({
        select: {
            email: true,
            name: true,
            id: true,
        }
    })
}