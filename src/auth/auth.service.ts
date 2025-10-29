import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entity/user.entity";
import { In, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';


export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async register(name: string, mail:string, password:string): Promise<User> {
        const user = this.userRepository.create({
            name,
            mail,
            password: await bcrypt.hash(password, 10),
        })

        if (await this.userRepository.findOneBy({mail})) {
            throw new Error(`User with email ${mail} already exists`);
        }

        return this.userRepository.save(user);

    }

    async login (mail:string, password: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ mail});

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordvalid = await bcrypt.compare(password, user.password);

        if (!isPasswordvalid) {
            throw new Error('Invalid credentials');
        }

        return user;
    }
}