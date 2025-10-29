import { Body, Controller, Post, Get, ConflictException, HttpStatus, NotFoundException, Param, Patch, HttpException, ParseIntPipe, Delete } from '@nestjs/common';
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
    ) {}

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

    @Patch(':id')
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
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ){
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        return({
            message: 'User updated successfully',
            result: updatedUser
        })
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an user'})
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully'
    })
    @ApiResponse({
        status: 404,
        description: 'User not found'
    })
    async deleteUser(
        @Param('id', ParseIntPipe) id: number
    ){
      await this.userService.deleteUser(id);
        return({
            message: 'User deleted successfully',
            result: null
        })
    }
}
