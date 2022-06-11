const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://vgpharaoh:"+process.env.mango+"@cluster0.yzgtu.mongodb.net/?retryWrites=true&w=majority";
const mongoclient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const db_connection = mongoclient.connect();
const { Client, Intents } = require('discord.js');
//const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

var refresh = true;

var serverIDs = ['977791137861468180'];
var prefix = '~';

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);

client.on('disconnect', function(event) {
    console.log('----- Bot disconnected from Discord -----');
    if(refresh) {
        console.log('Attempting to reconnect...\n');
        setTimeout(client.login(process.env.BOT_TOKEN), 1000);
    } else {
        console.log('No reconnect requested...\n');
    }
});

client.on('messageCreate', message => {
    if(message.author.bot) return;

    if(message.guild.id && message.guild.id !== undefined) {
        if(!serverIDs.includes(message.guild.id)) return;
    }

    var channelID = message.channel;
    var contents = message.content;
    var splitted = contents.split(' ');
    var  cmd = splitted[0];
    
    if(cmd.substring(0,1) == prefix) {
        console.log('found prefix');
        switch(cmd.substring(1)) {
            case 'roll': 
                query().then(message => sendMSG(channelID, message)).catch(console.dir);
                break;

        }
    }
});

function sendMSG(channel, text){
    if(channel && channel !== undefined && text !==''){
        channel.send(text);
    }
}
async function query() {
    try {
        const data = await mongoclient.db("Zeldice");
        const collection = await data.collection("facts");


        let count = await collection.countDocuments();
        let raw = Math.random() * (count);
        let rand = Math.floor(raw).toString();
        const query = { num: rand };
        const options = { sort: { num: -1 } };
        const factObj = await collection.findOne(query, options);

        let found = false;
        for (key in factObj) { if (key === "num") { found = factObj[key]; } }
        if (!found) return '';

        return factObj.fact;
    } catch (e) {
        console.error(e);
    } finally { }
}