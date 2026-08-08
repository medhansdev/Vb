require('dotenv').config();
const noblox = require('noblox.js');

// Load the Roblox cookie from your .env file (supports multiple tokens)
async function startRobloxBots() {
    let robloxIndex = 1;
    
    console.log("==========================================");
    console.log("      ROBLOX DEDICATED BOT WORKER         ");
    console.log("==========================================");

    while (true) {
        const cookie = process.env[`ROBLOX_BOT_${robloxIndex}_TOKEN`];
        if (!cookie || cookie.includes('...')) break; // Skips missing or placeholder cookies

        const cleanCookie = cookie.trim().replace(/^["']|["']$/g, '');

        try {
            console.log(`[Roblox Bot #${robloxIndex}] Authenticating with cookie...`);
            
            // Authenticate user via noblox.js
            const currentUser = await noblox.setCookie(cleanCookie);
            console.log(`[Roblox Bot #${robloxIndex}] Successfully logged in as: ${currentUser.Name} (ID: ${currentUser.UserID})`);

            // Check account balance or user info
            const robux = await noblox.getRobux(currentUser.UserID).catch(() => 'Hidden/Restricted');
            console.log(`[Roblox Bot #${robloxIndex}] Robux Balance: ${robux}`);

            // Optional: Join a game or register presence
            const targetPlaceId = 1818; // Classic Roblox Baseplate Place ID (Change to your target game)
            try {
                await noblox.getGameInstances(targetPlaceId);
                console.log(`[Roblox Bot #${robloxIndex}] Connected to game server structure for Place ID: ${targetPlaceId}`);
            } catch (err) {
                console.log(`[Roblox Bot #${robloxIndex}] Could not fetch server instances for place ID.`);
            }

        } catch (error) {
            console.error(`[Roblox Bot #${robloxIndex}] Authentication failed! Make sure your .ROBLOSECURITY cookie is fresh and valid.`);
        }

        robloxIndex++;
    }

    if (robloxIndex === 1) {
        console.log("[Roblox Worker] No Roblox cookies found in your .env file!");
    }
}

// Run the Roblox automation worker
startRobloxBots();