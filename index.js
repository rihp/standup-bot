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


console.log(" ~ this is how we do it")


