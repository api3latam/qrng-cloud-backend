export function getEnvVars(targetKey: string) {
    try {
        require("dotenv").config();
        return process.env[targetKey] || "";
    } catch (err) {
        console.error(err);
    }
};
