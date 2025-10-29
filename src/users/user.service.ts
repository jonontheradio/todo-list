import { Repository } from "typeorm/repository/Repository";
import { User } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from 'bcrypt';
import { Not } from "typeorm";


export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOneByid(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }

    async updateUser(id: number, updateDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOneBy({ id })

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if(updateDto.password) {
            updateDto.password = await bcrypt.hash(updateDto.password, 10)
        }

        Object.assign(user, updateDto)

        return await this.userRepository.save(user)

    }

    async deleteUser(id:number): Promise<void> {
        const user = await this.userRepository.findOneBy({ id});

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.userRepository.delete(id);
    }
}