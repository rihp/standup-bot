"use strict"; // since I hate not using semicolons

/**
 * Required Imports
 *  - dotenv: .env support
 *  - fs: file system support (for reading ./commands)
 *  - mongoose: mongoDB client
 *  - discord.js: discord (duh)
 *  - schedule: for running the cron jobs
 *  - standup.model: the model for the standup stored in mongo
 */

require("dotenv").config();


  // / / / / / / / / / / / / / / / / / / /
 // NOTION API CONFIG 
// use `const = require("...")` because the file uses ES5, and this stack doesnt have babel installed, so you cannot use `import {} from ...`
const notionClient = require("@notionhq/client")
const notion = new notionClient.Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

const getDatabases = async () => {
    const databases = await notion.databases.list();

    console.log(databases);
};
getDatabases()

const getAllApplications = async (req, res) => {
    const data = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID
    });

    const pages = data.results.map(page => {
        return {
            id: page.id,
            created: page.created_time,
            updated: page.last_edited_time,
            title: page.properties.Title.title[0],
  //          date: page.properties.date[rich_text],
   //         username: page.properties.username[rich_text],
//            position: page.properties.Position.select.name,
//            status: page.properties.Status.select.name,
//            deadline: page.properties['Next Deadline'].date.start,
//            jobDescription: page.properties['Job Description'].url,
//            comments: page.properties.Comments.rich_text[0].plain_text
        }
    });
    console.log(" ~ Mapped data:")
    console.log(pages)
    return pages;
};

getAllApplications()

async function addItem(username, text) {
  try {
    await notion.request({
      path: "pages",
      method: "POST",
      body: {
        parent: { database_id: databaseId },
        properties: {
          title: { 
            title:[
              {
                "text": {
                  "content": text
                }
              }
            ],
            username: [
                {
                "text": {
                    "content": username
                }
                }
            ]
          }
        }
      },
    })
    console.log(" ~ Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }
}

// addItem("Roberto", "Yurts in Big Sur, California")

//const fs = require("fs");
//const mongoose = require("mongoose");
//const { Client, MessageEmbed, Collection } = require("discord.js");
//const schedule = require("node-schedule");
//const standupModel = require("./models/standup.model");
//const showPromptCommand = require("./commands/showPrompt");
//const messsages = require(process.env.MESSAGES)
//const PREFIX = process.env.PREFIX

// _RIHP_
//
const fs = require("fs");
const { Client, MessageEmbed, Collection } = require("discord.js");

const PREFIX = process.env.PREFIX


console.log(" ~ loading up commands"); 

// lists .js files in commands dir
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// init bot client with a collection of commands
const bot = new Client();
bot.commands = new Collection();

// Imports the command file + adds the command to the bot commands collection
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}


// Prepare bot
bot.once("ready", () => {
    console.log("Discord Bot Ready")
//   ... this prompts members if it is re-deployed and time criteria is met
//    if(Date.now() < (new Date()).setHours(10, 30)) {
//      promptMembers();
//    }
  });


// when a user enters a command
bot.on("message", async (message) => {

    console.log(" ~ message received!")
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
  
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
  
    if (!bot.commands.has(commandName)) return;
  
    if (message.mentions.users.has(bot.user.id))
      return message.channel.send(":robot:");
  
    const command = bot.commands.get(commandName);
  
    if (command.guildOnly && message.channel.type === "dm") {
      return message.channel.send("Hmm, that command cannot be used in a dm!");
    }
  
    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.channel.send(`Error 8008135: Something went wrong!`);
    }
  });


bot.login(process.env.DISCORD_TOKEN);


console.log(" ~ this is how we do it")


