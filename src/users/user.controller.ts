import { Body, Controller, Post, Get, ConflictException, HttpStatus, NotFoundException, Param, Patch, HttpException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({
        status: 201,
        description: 'User successfully created',
        type: User
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'User with this email already exists'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data'
    })
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        try {
            return await this.userService.createUser(
                createUserDto.name,
                createUserDto.mail,
                createUserDto.password
            );
        } catch (error) {
            if (error.message.includes('already exists')) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of users',
        type: [User]
    })
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }


    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({
        name: 'id',
        description: 'User ID',
        type: 'number',
        required: true
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User found successfully',
        type: User
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User not found'
    })
    async findOneByid(@Param('id') id: number): Promise<User> {
        const user = await this.userService.findOneByid(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    @Patch(':mail')
    @ApiOperation({ summary: 'Update user details' })
    @ApiResponse({
        status: 200,
        description: 'User updated successfully'
    })
    @ApiResponse({
        status: 404,
        description: 'User not found'
    })
    async updateUser(
        @Param('mail') mail: string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<Partial<User>> {
        return this.userService.updateUser(mail, updateUserDto);
    }
}
