import { PrismaClient } from "../../../../../generated/prisma";
import { UserMap } from "../mapper/UserMap";
import { User } from "../User";

export class UserRepository{
    constructor(private prisma: PrismaClient){}

    async findById(id: string): Promise<User | null>{
        const raw = await this.prisma.user.findUnique({
            where: { id}
        })
        return raw ? UserMap.toDomain(raw) : null
    }

    async save(user: User): Promise<void>{
        const createData = UserMap.toPersistence(user)
        const updateData = UserMap.toUpdatePersistence(user)
        await this.prisma.user.upsert({
            where: { id: user.id },
            create: createData,
            update: updateData
        })
    }

    async findByEmail(email: string): Promise<User | null>{
        const raw = await this.prisma.user.findUnique({
            where: { email }
        })
        return raw ? UserMap.toDomain(raw) : null
    }

    async updateUser(user: User): Promise<void>{
        // FINDING USER BY ID
        const exists = await this.prisma.user.findUnique({ where: { id: user.id }})
        // VALIDATE IF USER IS EXISTS
        if(!exists){
            throw new Error('[ERROR][FIND-USER]: USER NOT FOUND!')
        }
        // DATA TO UPDATE FORMAT
        const data = UserMap.toUpdatePersistence(user)
        // UPDATE DATA
        await this.prisma.user.update({
            where: { id: user.id },
            data: data
        })
    }

    async deleteUser(user: User): Promise<void>{
        const exists = await this.findById(user.id)
        if(!exists){
            throw new Error('[ERROR][FIND-USERs]: USER NOT FOUND')
        }
        await this.prisma.user.delete({
            where: {id: user.id}
        })
    }

    async fetchAll(): Promise<User[]> {
        const raw = await this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return raw.map(user => UserMap.toDomain(user));
    }

    async deleteById(id: string): Promise<void> {
        const exists = await this.prisma.user.findUnique({ where: { id } });
        if (!exists) {
            throw new Error('[ERROR][DELETE-USER]: USER NOT FOUND');
        }
        await this.prisma.user.delete({ where: { id } });
    }

    async count(): Promise<number> {
        return this.prisma.user.count();
    }
}