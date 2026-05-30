import dotenv from 'dotenv';


dotenv.config();


const requiredEnvVars = ['PORT'] as const;

type EnvKeys = (typeof requiredEnvVars)[number];

const evnConfig: Record<EnvKeys,string>={
    PORT: process.env.PORT || '',
};

for (const key of requiredEnvVars) {
    if(!evnConfig[key]) {
        throw new Error (`❌ Missing required environment variable: ${key}`);
  }
}

export const env = {
    PORT:Number(evnConfig.PORT),
};