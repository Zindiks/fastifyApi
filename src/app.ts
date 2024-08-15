import Fastify, {FastifyReply, FastifyRequest} from "fastify";
import fastifyJwt from "fastify-jwt";
import {userRoutes} from "./modules/user/user.route";
import {userSchemas} from "./modules/user/user.schema";
import {productSchemas} from "./modules/product/product.schema";
import {productRoutes} from "./modules/product/product.route";
import {version} from '../package.json'

import swagger from '@fastify/swagger-ui'


import {withRefResolver} from "fastify-zod";

export const server = Fastify({logger: true});


server.get("/healthcheck", (req, res) => {
    return res.status(200).send("Ok!");
})

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any
    }
}

declare module "fastify-jwt" {
    interface FastifyJWT {
        user: {
            id: string
            email: string;
            name: string;
        }
    }

}

server.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify()
    } catch (err) {
        return reply.send(err)
    }
})


server.register(fastifyJwt, {
    secret: "sWefcawq45fFSdcxdsder4fSDfvxcee"
})


async function main() {
    for (const schema of [...userSchemas, ...productSchemas]) {
        server.addSchema(schema);
    }


    server.register(import('@fastify/swagger'))
    server.register(import('@fastify/swagger-ui'), {
        routePrefix: '/docs'
    })


    server.register(userRoutes, {
        prefix: "api/users"
    });

    server.register(productRoutes, {
        prefix: "api/products"
    })


    server.get("/", (req, res) => {
        console.log(req.params)
        res.send("Hello World!");
    })

    server.listen({
        port: 3000,
        host: '0.0.0.0'  // Указываем хост, по умолчанию это 'localhost'
    }, (err, address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
        server.log.info(`Server listening at ${address}`);
    });

}


main()
