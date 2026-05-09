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
            id: 1,
            sid: "sessionId",
            data: "someData",
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        ],
      },

      folders: {
        create: [
          {
            name: "folder1",
            files: {
              create: [
                {
                  name: "file1",
                  user: {
                    connectOrCreate: {
                      where: { email: "andrii@test.com" },
                      create: {
                        name: "Andrii",
                        email: "andrii@test.com",
                        password: "12345",
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },

      files: {
        create: [
          {
            name: "rootFile",
          },
        ],
      },
    },
    include: {
      sessions: true,
      folders: {
        include: {
          files: true,
        },
      },
      files: true,
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
