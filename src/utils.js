import * as dotenv from 'dotenv';

export function getEnvVars(targetKey) {
    try {
        dotenv.config();
        return process.env[targetKey] || "";
    } catch (err) {
        console.error(err);
    }
};
