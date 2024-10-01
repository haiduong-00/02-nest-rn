import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @IsMongoId({message: "_id không hợp lệ"})
    @IsNotEmpty({message: "_id không được để trống"})
    _id: string;
    
    name: string;
    phone: string;
    address: string;
    image: string;
}
