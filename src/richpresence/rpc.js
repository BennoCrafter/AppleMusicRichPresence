
const { execSync } = require('child_process');
const DiscordRPC = require('discord-rpc');
const { getSongCover } = require('../utils/getSongCover');
const clientId = '1221392804161523824'; // Replace this with your actual client ID
const rpc = new DiscordRPC.Client({ transport: 'ipc' });


let currentTrack = undefined;

async function setDiscordPresence(trackName, artistName, artworkUrl, songDuration, currentPos) {
    try {
        await rpc.setActivity({
            details: trackName,
            state: artistName,
            largeImageKey: artworkUrl, // Use the resolved artwork URL
            largeImageText: 'Apple Music',
            smallImageKey: 'note-icon',
            smallImageText: 'Currently hearing',
            instance: false,
            startTimestamp: Math.floor(new Date().getTime() / 1000),
            endTimestamp: Math.floor(new Date().getTime() / 1000) + parseInt(songDuration) - parseInt(currentPos)
        });
    } catch (error) {
        console.error('Error setting Discord presence:', error);
    }
}


async function updatePresence() {
    const script = 'osascript ./src/richpresence/getmusicinfo.applescript';
    try {
        const result = execSync(script).toString().split("||");
        console.log(result)
        if(result[0] == "STOPPED"){
            await rpc.clearActivity()
        }else{
            if(result[1] !== undefined && result[0] !== "PAUSED"){
                await setDiscordPresence(result[1], result[2], await getSongCover(result[2], result[1]), result[5], result[4]);
                currentTrack = result[1]
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

const initDiscordRPC = () => {
    DiscordRPC.register(clientId);
    rpc.login({ clientId }).then(() => {
        console.log('Successfully connected to Discord.');
    }).catch(error => {
        console.error('Error connecting to Discord:', error);
    });
}

rpc.on('ready', () => {
    updatePresence();
    // Update presence every 5 seconds
    setInterval(updatePresence, 5000);
});


module.exports = {initDiscordRPC, currentTrack}