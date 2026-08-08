require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, Events } = require('discord.js');
const noblox = require('noblox.js');
const mineflayer = require('mineflayer');

const app = express();
const PORT = process.env.PORT || 3000;

// Status tracking arrays for your dashboard
const panelStatus = {
    discordBots: [],
    discordAccounts: [],
    robloxBots: [],
    mcBots: []
};

console.log("==========================================");
console.log("   LAUNCHING 1,000,000x NEXT-GEN PANEL    ");
console.log("==========================================");

// ==========================================
// 1. ACTIVATE DISCORD BOTS
// ==========================================
let dBotIndex = 1;
while (true) {
    const token = process.env[`DISCORD_BOT_${dBotIndex}_TOKEN`];
    if (!token) break;

    const botObj = { index: dBotIndex, id: 'Connecting...', status: 'booting', badge: 'warning' };
    panelStatus.discordBots.push(botObj);

    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.once(Events.ClientReady, (c) => {
        botObj.id = c.user.tag;
        botObj.status = 'Online';
        botObj.badge = 'success';
    });

    client.login(token).catch(err => {
        botObj.id = 'Failed';
        botObj.status = 'Error';
        botObj.badge = 'danger';
    });

    dBotIndex++;
}

// ==========================================
// 2. ACTIVATE DISCORD REAL ACCOUNTS
// ==========================================
let dAccIndex = 1;
while (true) {
    const token = process.env[`DISCORD_ACC_${dAccIndex}_TOKEN`];
    if (!token) break;

    const accObj = { index: dAccIndex, id: 'User Account', status: 'Connecting...', badge: 'warning' };
    panelStatus.discordAccounts.push(accObj);

    const userClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

    userClient.once(Events.ClientReady, (c) => {
        accObj.id = c.user.tag;
        accObj.status = 'Active';
        accObj.badge = 'success';
    });

    userClient.login(token).catch(() => {
        accObj.id = 'Restricted';
        accObj.status = 'Blocked';
        accObj.badge = 'danger';
    });

    dAccIndex++;
}

// ==========================================
// 3. ACTIVATE ROBLOX BOTS (SAFE HANDLER)
// ==========================================
let robloxIndex = 1;
while (true) {
    const cookie = process.env[`ROBLOX_BOT_${robloxIndex}_TOKEN`];
    if (!cookie) break;

    const robloxObj = { index: robloxIndex, username: 'Connecting...', status: 'Booting', badge: 'warning' };
    panelStatus.robloxBots.push(robloxObj);

    // Clean up the cookie format just in case extra spaces/quotes were added
    const cleanCookie = cookie.trim().replace(/^["']|["']$/g, '');

    noblox.setCookie(cleanCookie).then(async (user) => {
        robloxObj.username = user.Name;
        robloxObj.status = 'Authenticated';
        robloxObj.badge = 'success';
    }).catch(err => {
        robloxObj.username = 'Invalid Cookie';
        robloxObj.status = 'Failed';
        robloxObj.badge = 'danger';
        console.log(`[Roblox Bot #${robloxIndex}] Cookie failed. Make sure you copy the entire .ROBLOSECURITY string.`);
    });

    robloxIndex++;
}

// ==========================================
// 4. ACTIVATE MINECRAFT BOTS
// ==========================================
let mcIndex = 1;
while (true) {
    const username = process.env[`MC_BOT_${mcIndex}_USERNAME`];
    if (!username) break;

    const mcObj = { index: mcIndex, username: username, status: 'Connecting...', badge: 'warning' };
    panelStatus.mcBots.push(mcObj);

    function launchMinecraftBot() {
        const bot = mineflayer.createBot({
            host: 'play.yourserver.com', // ⚠️ Change to your Minecraft server IP
            port: 25565,
            username: username,
            version: false
        });

        bot.on('spawn', () => {
            mcObj.status = 'In-Game';
            mcObj.badge = 'success';
        });

        bot.on('end', () => {
            mcObj.status = 'Reconnecting';
            mcObj.badge = 'warning';
            setTimeout(launchMinecraftBot, 10000);
        });

        bot.on('error', () => {
            mcObj.status = 'Error';
            mcObj.badge = 'danger';
        });
    }

    launchMinecraftBot();
    mcIndex++;
}

// ==========================================
// NEXT-GEN CYBERPUNK GLASS UI DASHBOARD
// ==========================================
app.get('/', (req, res) => {
    const totalBots = panelStatus.discordBots.length + panelStatus.discordAccounts.length + panelStatus.robloxBots.length + panelStatus.mcBots.length;

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nexus Control Center v2.0</title>
            <meta http-equiv="refresh" content="4">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                :root {
                    --bg: #090d16;
                    --card-bg: rgba(30, 41, 59, 0.7);
                    --border: rgba(255, 255, 255, 0.08);
                    --text: #f8fafc;
                    --text-muted: #94a3b8;
                    --accent: #38bdf8;
                    --success: #10b981;
                    --warning: #f59e0b;
                    --danger: #ef4444;
                }
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
                body { background: var(--bg); color: var(--text); min-height: 100vh; padding: 30px; background-image: radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 40%); }
                .container { max-width: 1200px; margin: 0 auto; }
                
                header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid var(--border); padding-bottom: 20px; }
                .logo { display: flex; align-items: center; gap: 12px; }
                .logo-icon { font-size: 28px; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                h1 { font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
                .stats-pill { background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.2); padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; color: var(--accent); display: flex; align-items: center; gap: 8px; }
                .pulse { width: 8px; height: 8px; background: var(--success); border-radius: 50%; box-shadow: 0 0 10px var(--success); animation: pulse 2s infinite; }

                .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(550px, 1fr)); gap: 20px; }
                .card { background: var(--card-bg); backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: transform 0.2s ease, border-color 0.2s ease; }
                .card:hover { border-color: rgba(56, 189, 248, 0.3); transform: translateY(-2px); }
                
                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
                .card-title { font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 10px; }
                .badge-count { background: rgba(255,255,255,0.06); padding: 4px 10px; border-radius: 6px; font-size: 12px; color: var(--text-muted); }

                table { width: 100%; border-collapse: collapse; }
                th { text-align: left; padding: 10px 12px; font-size: 12px; font-weight: 600; color: var(--text-muted); border-bottom: 1px solid var(--border); text-transform: uppercase; letter-spacing: 0.5px; }
                td { padding: 14px 12px; font-size: 14px; border-bottom: 1px solid var(--border); }
                tr:last-child td { border-bottom: none; }
                
                .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
                .status-success { background: rgba(16, 185, 129, 0.1); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.2); }
                .status-warning { background: rgba(245, 158, 11, 0.1); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.2); }
                .status-danger { background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); }

                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <div class="logo">
                        <span class="logo-icon">⚡</span>
                        <h1>Nexus Command Center</h1>
                    </div>
                    <div class="stats-pill">
                        <div class="pulse"></div>
                        <span>Active Instances: <b>${totalBots}</b></span>
                    </div>
                </header>

                <div class="grid">
                    <!-- Discord Bots -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">🤖 Discord Bots</div>
                            <div class="badge-count">${panelStatus.discordBots.length} Connected</div>
                        </div>
                        <table>
                            <tr><th>#</th><th>Identity / Tag</th><th>Status</th></tr>
                            ${panelStatus.discordBots.map(b => `
                                <tr>
                                    <td>#${b.index}</td>
                                    <td><b>${b.id}</b></td>
                                    <td><span class="status-badge status-${b.badge}">${b.status}</span></td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>

                    <!-- Discord Real Accounts -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">👤 Discord Real Accounts</div>
                            <div class="badge-count">${panelStatus.discordAccounts.length} Managed</div>
                        </div>
                        <table>
                            <tr><th>#</th><th>Account Tag</th><th>Status</th></tr>
                            ${panelStatus.discordAccounts.map(a => `
                                <tr>
                                    <td>#${a.index}</td>
                                    <td><b>${a.id}</b></td>
                                    <td><span class="status-badge status-${a.badge}">${a.status}</span></td>
                                }
                            `).join('')}
                        </table>
                    </div>

                    <!-- Roblox Bots -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">🧱 Roblox Automation</div>
                            <div class="badge-count">${panelStatus.robloxBots.length} Cookies</div>
                        </div>
                        <table>
                            <tr><th>#</th><th>Roblox Username</th><th>Status</th></tr>
                            ${panelStatus.robloxBots.map(r => `
                                <tr>
                                    <td>#${r.index}</td>
                                    <td><b>${r.username}</b></td>
                                    <td><span class="status-badge status-${r.badge}">${r.status}</span></td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>

                    <!-- Minecraft Bots -->
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">⛏️ Minecraft Grid</div>
                            <div class="badge-count">${panelStatus.mcBots.length} Bots</div>
                        </div>
                        <table>
                            <tr><th>#</th><th>In-Game Username</th><th>Status</th></tr>
                            ${panelStatus.mcBots.map(m => `
                                <tr>
                                    <td>#${m.index}</td>
                                    <td><b>${m.username}</b></td>
                                    <td><span class="status-badge status-${m.badge}">${m.status}</span></td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`[Panel] Next-Gen UI live at http://localhost:${PORT}`);
});