const bcrypt = require('bcrypt');

const seed = async (prisma) => {
  const password = await bcrypt.hash('password', 10);

  await prisma.user.create({
    data: {
      username: 'admin',
      password,
    },
  });

  // Add other seed data if needed

  console.log('Seeding completed successfully!');
};

module.exports = {
  default: seed,
};
