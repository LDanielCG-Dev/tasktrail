const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const TOKEN_TYPES = [
    { name: 'verify' },
    { name: 'recover' },
]

async function main() {
    for (const [index, token] of TOKEN_TYPES.entries()) {
        await prisma.tokenTypes.upsert({
            where: { id: index + 1 },
            update: {},
            create: {
                name: token.name,
            }
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })

    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })