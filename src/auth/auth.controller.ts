import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entity/user.entity";
import { LoginDto } from "./dto/login.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
        status: 201,
        description: 'User successfully registered',
    })
    async register(@Body() createUserDto: CreateUserDto): Promise<User> {

        const newUser = await this.authService.register(
            createUserDto.name,
            createUserDto.mail,
            createUserDto.password
        );
        return ({ message: 'User registered successfully', result: newUser } as any);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'User successfully logged in' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async login(@Body() loginDto: LoginDto): Promise<User> {
        const user = await this.authService.login(
            loginDto.mail,
            loginDto.password
        );
        return ({ message: 'User logged in successfully', result: user } as any
        )
    }
}