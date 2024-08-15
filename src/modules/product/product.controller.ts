import {FastifyReply, FastifyRequest} from "fastify";
import {createProduct, getProducts} from "./product.service";
import {CreateProductInput} from "./product.schema";

export async function getProductsHandler(request: FastifyRequest, reply: FastifyReply) {
    const products = await getProducts()
    return reply.status(200).send(products)
}


export async function createProductHandler(request: FastifyRequest<{
    Body: CreateProductInput;
}>, reply: FastifyReply) {

    return createProduct({
        ...request.body,
        ownerId: request.user.id

    })


}