import {  ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto{

    @ApiProperty({ description: 'User email', example: 'jose@pureba.es'})
    @IsEmail()
    @IsNotEmpty()
    mail: string;

    @ApiProperty({ description: 'User password', example: 'password1234'})
    @IsString()
    @IsNotEmpty()
    password: string;

}