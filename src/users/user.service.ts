import { Repository } from "typeorm/repository/Repository";
import { User } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from 'bcrypt';


export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async createUser(name: string, mail: string, password: string): Promise<User> {
        const existingUser = await this.userRepository.findOneBy({ mail })
        if (existingUser) {
            throw new Error(`User with email ${mail} already exists`);
        }

        try {

            // Se hashea la password antes de guardar
            const hashed = await bcrypt.hash(password, 10);
            const newUser = this.userRepository.create({
                name,
                mail,
                password: hashed
            })
            return await this.userRepository.save(newUser);
        } catch (error: any) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

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

    async updateUser(mail: string, updateDto: UpdateUserDto): Promise<Partial<User>> {
        const user = await this.userRepository.findOneBy({ mail });
        if (!user) {
            throw new NotFoundException(`User with email ${mail} not found`);
        }

        // Create object only with fields to update
        const updateFields: Partial<User> = {};

        // Only update name if provided
        if (updateDto.name) {
            updateFields.name = updateDto.name;
        }

        // Only update password if provided
        if (updateDto.password) {
            updateFields.password = await bcrypt.hash(updateDto.password, 10);
        }

        // Only perform update if there are fields to update
        if (Object.keys(updateFields).length > 0) {
            await this.userRepository.update({ mail }, updateFields);
        }

        // Get updated user
        const updatedUser = await this.userRepository.findOneBy({ mail });
        if (!updatedUser) {
            throw new NotFoundException(`User with email ${mail} not found after update`);
        }

        // Remove password from response
        const { password, ...result } = updatedUser;
        return result;
    }
}