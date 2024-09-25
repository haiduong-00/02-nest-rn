import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export const hashPasswordHelper = async(plainPassword: string) => {
    try {
        return await bcrypt.hash(plainPassword, saltOrRounds);
    } catch (error) {
        console.log(error);
        
    }
}