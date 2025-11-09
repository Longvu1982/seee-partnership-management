import { Role } from '@prisma/client';
import { v4 as uuidv4, v4 } from 'uuid';
import { db } from '../src/utils/db.server';
import { hashPassword } from './../src/utils/bcryptHandler';

async function getUser() {
  return {
    id: uuidv4(),
    name: 'ADMIN SEEE Khoa Điện Tử',
    email: 'example@company.com',
    phone: '',
    role: Role.ADMIN,
    username: 'adminSeee1',
    password: await hashPassword('123456789'),
  };
}

async function seed() {
  const user = await getUser();
  console.log(`[*] Seeding Admin : ${JSON.stringify(user)}`);
  console.log(`[*] password : 123456789 `);

  await db.user.create({
    data: user,
  });
}

seed();
