import { prisma } from "./lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Andrii",
      email: "andrii@test.com",
      password: "12345",
      sessions: {
        create: [
          {
            sid: "sessionId",
            data: "someData",
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        ],
      },
    },
  });

  await prisma.folder.create({
    data: {
      name: "folder1",
      userId: user.id,
      files: {
        create: [
          {
            name: "file1",
            url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            size: 1024,
            userId: user.id,
          },
        ],
      },
    },
  });

  console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
