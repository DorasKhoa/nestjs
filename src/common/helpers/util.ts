import * as bcrypt from 'bcrypt';

export const hashedPasswordHelper = async(plainPassword: string) => {
    try {
        const saltRound = 10;
        return await bcrypt.hash(plainPassword, saltRound);
    } catch (error) {
        console.log(error)
    }
}

export const comparePasswordHelper = async(plainPassword: string, hashedPassword: string) => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword)
    } catch (error) {
        console.log(error)
    }
}