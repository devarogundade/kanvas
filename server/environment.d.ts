declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;

            POSTMARK_TOKEN: string;
            POSTMARK_FROM: string;

            INFURA_PROJECT_ID: string;
            INFURA_PROJECT_SECRET: string;

            DEV_EMAIL: string;
            EVM_PRIVATE_KEY: string;
        }
    }
}

export { };