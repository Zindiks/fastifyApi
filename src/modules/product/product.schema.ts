import {z} from 'zod'

import {buildJsonSchemas} from "fastify-zod";


const productInput = {
    title: z.string(),
    price: z.number(),
    content: z.string().optional(),


}
const productGenerated = {
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),

}

const createProductSchema = z.object({
    ...productInput,
})

const productResponseSchema = z.object({
    ...productGenerated,
    ...productInput,

})

// plural
const productsResponseSchema = z.array(productResponseSchema)

export type CreateProductInput = z.infer<typeof createProductSchema>
export const {schemas: productSchemas, $ref} = buildJsonSchemas({
    createProductSchema,
    productResponseSchema,
    productsResponseSchema,
}, {$id: "Product"})