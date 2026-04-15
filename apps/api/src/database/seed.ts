import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { RoleName } from '../common/enums/role-name.enum';
import { Role, User } from '../entities';

config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'chouse',
    entities: [Role, User],
  });

  await dataSource.initialize();
  const roleRepository = dataSource.getRepository(Role);
  const userRepository = dataSource.getRepository(User);

  for (const roleName of [
    RoleName.ADMIN,
    RoleName.CASHIER,
    RoleName.CUSTOMER,
  ]) {
    const exists = await roleRepository.findOne({ where: { name: roleName } });
    if (!exists) {
      await roleRepository.save(roleRepository.create({ name: roleName }));
    }
  }

  const adminRole = await roleRepository.findOneByOrFail({
    name: RoleName.ADMIN,
  });
  const adminEmail = (
    process.env.SEED_ADMIN_EMAIL ?? 'admin@chouse.local'
  ).toLowerCase();

  const existingAdmin = await userRepository.findOne({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await userRepository.save(
      userRepository.create({
        email: adminEmail,
        fullName: process.env.SEED_ADMIN_NAME ?? 'C House Admin',
        roleId: adminRole.id,
        phoneVerified: true,
        phone: process.env.SEED_ADMIN_PHONE ?? '+905550000000',
        googleId: null,
      }),
    );
    console.log(`Seeded admin user: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
