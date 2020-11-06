
const fp = require('fastify-plugin')
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(async (_, next) => {
    try {
        const start = new Date()
        await next()
        const ms = new Date() - start
        console.log('Response time: %sms', ms)
    }
    catch (error) {
        console.log(`Error Occured: ${error.message}`)
    }
})

module.exports = fp((fastify, _, next) => {

    bot.on('new_chat_members', async (ctx) => {
        if (ctx.message.chat.id == process.env.GROUP_ID) {
            await ctx.deleteMessage();
            for (const member of ctx.message.new_chat_members) {
                await ctx.reply(process.env.WELCOME_MESSAGE.replace('{{name}}', member.first_name))
            }
        }
    })

    bot.on('left_chat_member', async (ctx) => {
        if (ctx.message.chat.id == process.env.GROUP_ID) {
            await ctx.deleteMessage()
            await ctx.reply(process.env.LEFT_MESSAGE.replace('{{name}}', ctx.message.left_chat_member.first_name))
        }
    })

    bot.launch()

    next()
})
