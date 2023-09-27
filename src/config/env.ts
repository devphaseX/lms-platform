import { TypeOf, object, string } from 'zod';

const envString = (fieldName: string) =>
  string({
    required_error: `${fieldName} is missing.Check your env file`,
    invalid_type_error: `${fieldName} is expected to be string type`,
  });

const envSchema = object({
  DATABASE_URL: envString('DATABASE_URL'),
  UPLOADTHING_SECRET: envString('UPLOADTHING_SECRET'),
  UPLOADTHING_APP_ID: envString('UPLOADTHING_APP_ID'),
});
type ParsedEnv = TypeOf<typeof envSchema>;

const parsedEnv = envSchema.parse(process.env);

export { parsedEnv, type ParsedEnv };
