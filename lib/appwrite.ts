// src/lib/server/appwrite.js
'use server';
import { Client, Account, Databases, Users } from 'node-appwrite';
import { cookies } from 'next/headers';

function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`Environment variable ${key} is missing`);
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value as string; // Assert it's a string
}

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(getEnvVariable('NEXT_PUBLIC_APPWRITE_ENDPOINT'))
    .setProject(getEnvVariable('NEXT_PUBLIC_APPWRITE_PROJECT'));

  const session = cookies().get('appwrite-session');
  console.log('session', session);

  if (!session || !session.value) {
    throw new Error('No session');
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(getEnvVariable('NEXT_PUBLIC_APPWRITE_ENDPOINT'))
    .setProject(getEnvVariable('NEXT_PUBLIC_APPWRITE_PROJECT'))
    .setKey(getEnvVariable('NEXT_APPWRITE_KEY'));

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get user() {
      return new Users(client);
    },
  };
}
