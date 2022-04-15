import { Telegraf } from 'telegraf'

const bot = new Telegraf(process.env.BOT_TOKEN)

import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const keyBoard = JSON.stringify({keyboard: [ ['/Hey','/Buy', '/QA'] ]});

bot.command('quit', (ctx) => {
  ctx.telegram.leaveChat(ctx.message.chat.id)
  ctx.leaveChat()
})

bot.on('text', async (ctx) => {
  const response = await openai.createCompletion('text-curie-001', {
    prompt: ctx.update.message.text,
    temperature: 0.8,
    max_tokens: 256,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  var AIResponse = response.data.choices[0].text
  
  console.log(AIResponse)

  if (AIResponse != null){
    // const username = ctx.update.message.from.username
    // const message = `Привет @${username} 😏`
    ctx.telegram.sendMessage(ctx.message.chat.id, AIResponse)
  }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
