import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

type UserRequest = {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    async execute({ name, email, password }: UserRequest) {

        // Verificar se ele enviou um email
        if(!email) {
            throw new Error("Email incorrect");
        }

        // Verificar se esse email já esta cadastrado
        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        });

        if(userAlreadyExists) {
            throw new Error("User already exists")
        }

        const passwordHash = await hash(password, 8);

        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash
            },
            select: {
                id: true,
                email: true,
                name: true,
            }
        });

        return user;
    }
}

export { CreateUserService }