import { Telegraf } from "telegraf";
import OpenAI from "openai";

const bot = new Telegraf(process.env.BOT_TOKEN);

const openai = new OpenAI();

bot.on("text", async (ctx) => {
  const userText = ctx.message.text;

  try {
    await ctx.sendChatAction("typing");

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: userText }],
    });

    const botReply = completion.choices[0].message.content;

    await ctx.reply(botReply);
  } catch (err) {
    console.error("OpenAI error:", err);
    await ctx.reply(`❗️ Sorry, an error occurred ${err}`);
  }
});

bot
  .launch()
  .then(() => console.log("Bot is active"))
  .catch(console.error);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
