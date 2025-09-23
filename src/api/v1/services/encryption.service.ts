import bcrypt from 'bcrypt'
import { PASSWORD_SALT } from '../../../config/constants.js';

class EncryptionService {

    /**
     * Hashes a string using a salt
     * @param str The string to be hashed
     * @param salt The salt to be used in encryption
     * @returns The hashed string
     */
    public async hashString(str: string, salt?: number): Promise<string> {
        if (salt) {
            return await bcrypt.hash(str, salt);
        }
        return await bcrypt.hash(str, 0);
    }

    /**
     * Hashes a password
     * @param password The password to be hashed
     * @returns The hashed password
     */
    public async hashPassword(password: string): Promise<string> {
        return await this.hashString(password, PASSWORD_SALT);
    }

    /**
     * Compares a string with a hash to identify a match
     * @param str 
     * @param hashed 
     * @returns 
     */
    public async compareHash(str: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(str, hashed);
    }
}

export default EncryptionService