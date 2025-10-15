import { Not } from "typeorm";
import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'The name of the user',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'john@example.com',
        description: 'The email of the user',
    })
    @IsEmail()
    @IsNotEmpty()
    mail: string;

    @ApiProperty({
        example: 'password123',
        description: 'The user password (min 6 characters)',
    })
    @MinLength(6)
    @IsString()
    password: string;
}