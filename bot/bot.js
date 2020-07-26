
const fp = require('fastify-plugin')
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(async (_, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log('Response time: %sms', ms)
})

module.exports = fp((fastify, _, next) => {

    bot.on('new_chat_members', (ctx) => {
        try {
            if (ctx.message.chat.id == process.env.GROUP_ID) {
                try { ctx.deleteMessage() }
                catch (err) { }
                for (const member of ctx.message.new_chat_members) {
                    try { ctx.reply(process.env.WELCOME_MESSAGE.replace('{{name}}', member.first_name)) }
                    catch (err) { }
                }
            }
        } catch (error) { }
    })

    bot.on('left_chat_member', (ctx) => {
        try {
            if (ctx.message.chat.id == process.env.GROUP_ID) {
                try {
                    ctx.deleteMessage()
                    ctx.reply(process.env.LEFT_MESSAGE.replace('{{name}}', ctx.message.left_chat_member.first_name))
                } catch (error) { }
            }
        } catch (error) { }
    })

    bot.launch()

    next()
})
