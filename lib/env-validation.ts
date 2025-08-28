/**
 * Environment validation utilities
 */

export function validateEnvVars() {
  const requiredVars = [
    'NOTION_TOKEN',
    'NOTION_DATABASE_ID'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }
}

export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not defined`);
  }
  
  return value;
}
