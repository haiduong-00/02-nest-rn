import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  isEmailExist = async (email: string): Promise<boolean> => {
    const user = await this.userModel.exists({ email });
    if (user) return true;
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;

    // check exist email
    const isExist = await this.isEmailExist(email);
    if (isExist) throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng sử dụng email khác`);

    // hash password
    const hashPassword = await hashPasswordHelper(password)
    const user = await this.userModel.create({
      name, email, password: hashPassword, phone, address, image
    })
    return {
      _id: user._id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * (pageSize);

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-password")
      .sort(sort as any);

    return {
      meta: {
        current: current, // trang hiện tại
        pageSize: pageSize, // số lượng bản ghi đã lấy
        pages: totalPages,  // tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      }, results
    };
  }

  async findOne(_id: string) {
    return await this.userModel.findOne({ _id });
  }

  async findByEmail (email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id }, { ...updateUserDto }
    );
  }

  async remove(_id: string) {
    //check id
    if (mongoose.isValidObjectId(_id)) {
      //delete
      return this.userModel.deleteOne({ _id })
      // return `This is a action delete id ${_id}`;
    } else {
      throw new BadRequestException("ID không đúng với định dạng mongodb")
    }
  }
}