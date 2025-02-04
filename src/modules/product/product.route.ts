import {FastifyInstance} from "fastify";
import {createProductHandler, getProductsHandler} from "./product.controller";
import {$ref} from "./product.schema";


export async function productRoutes(server: FastifyInstance) {
    server.post("/", {
        preHandler: [server.authenticate],
        schema: {
            body: $ref('createProductSchema'),
            response: {
                201: $ref('productResponseSchema')
            }
        }

    }, createProductHandler);


    server.get("/", {
        preHandler: [server.authenticate],
        schema: {
            response: {
                201: $ref('productsResponseSchema')
            }
        }
    }, getProductsHandler)

}





