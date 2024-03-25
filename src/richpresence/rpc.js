
const { execSync } = require('child_process');
const DiscordRPC = require('discord-rpc');
const { getSongCover } = require('../utils/getSongCover');
const clientId = '1221392804161523824'; // Replace this with your actual client ID
const clientId0 = "1122755565567889469"
DiscordRPC.register(clientId);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

let currentTrack = undefined;

async function setDiscordPresence(trackName, artistName, artworkUrl, songDuration) {
    try {
        await rpc.setActivity({
            details: 'Listening to:',
            state: `${trackName} by ${artistName}`,
            largeImageKey: artworkUrl, // Use the resolved artwork URL
            largeImageText: 'Apple Music',
            smallImageKey: 'note-icon',
            smallImageText: 'Currently hearing',
            instance: false,
            startTimestamp: Math.floor(new Date().getTime() / 1000),
            endTimestamp: Math.floor(new Date().getTime() / 1000) + parseInt(songDuration)
        });
    } catch (error) {
        console.error('Error setting Discord presence:', error);
    }
}


export async function updatePresence() {
    const script = 'osascript getmusicinfo.applescript';
    try {
        const result = execSync(script).toString().split("||");
        if(currentTrack!==result[1] && result[1] !== undefined && result[0] !== "PAUSED"){
            await setDiscordPresence(result[1], result[2], await getSongCover(result[2], result[1]), result[5]);
            currentTrack= result[1]
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

rpc.on('ready', () => {
    console.log('Connected to Discord.');
    // Set initial presence when ready
    updatePresence();
    // Update presence every 5 seconds
    setInterval(updatePresence, 5000);
});

rpc.login({ clientId }).catch(console.error);
