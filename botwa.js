const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Inisialisasi client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Konfigurasi bot
const config = {
    // Prefix untuk command
    prefix: '.',
    
    // ID grup yang akan dimonitor (optional - kosongkan untuk semua grup)
    targetGroups: [],
    
    // Welcome message template
    welcomeMessage: `🎮 Selamat datang {user} di grup *{groupName}*! 

🌟 Terima kasih telah bergabung dengan komunitas kami.

📋 *Peraturan Grup:*
• Perilaku toxic diperbolehkan dalam batas wajar
• Dilarang melakukan jomok (joke yang berlebihan)
• Grup ini khusus untuk main bersama (mabar)
• Dilarang membagikan link apapun - pelanggaran akan mengakibatkan kick otomatis
• Dilarang melakukan promosi dalam bentuk apapun
• Untuk jual-beli link jasa, item, atau akun, silakan gunakan grup JB
• Dilarang membuat drama atau konflik

💡 Ketik *.menu* untuk melihat command yang tersedia

🎯 Selamat bermain dan semoga dapat bersenang-senang bersama! 🚀`,

    // Goodbye message template
    goodbyeMessage: `👋 Selamat tinggal *{user}*!

Terima kasih sudah menjadi bagian dari grup *{groupName}*.
Semoga kita bisa bertemu lagi di masa depan! 

Good luck dan happy gaming! 🎮✨`,

    linkWarning: `⚠️ *PERINGATAN PELANGGARAN ATURAN* ⚠️

@{user}, membagikan link tidak diperbolehkan dalam grup ini.
Pesan Anda telah dihapus sesuai dengan peraturan grup.

🚨 *PERINGATAN PERTAMA* - Pelanggaran kedua akan mengakibatkan kick otomatis tanpa peringatan lebih lanjut.`,

    // Final warning before kick
    finalKick: `🚫 *PENGELUARAN OTOMATIS DARI GRUP* 

@{user} telah dikeluarkan dari grup karena melanggar peraturan untuk kedua kalinya.

Pelanggaran: Membagikan link yang tidak diperbolehkan dalam grup mabar ini.`,

    // Menu command
    menuMessage: `🎮 *BOT ROBLOX MABAR MENU* 🎮

━━━━━━━━━━━━━━━━━━━━━
📌 *COMMAND UMUM (Semua Member)*
━━━━━━━━━━━━━━━━━━━━━

*.menu* - Menampilkan menu ini
*.helpjoin* - Panduan cara join Private Server
*.helpgabisajoin* - Solusi tidak bisa join PS
*.rules* - Menampilkan peraturan grup
*.ping* - Cek status bot
*.serverlist* - Lihat daftar Private Server aktif

━━━━━━━━━━━━━━━━━━━━━
👑 *COMMAND ADMIN*
━━━━━━━━━━━━━━━━━━━━━

*.status* - Status lengkap bot
*.warnings* - Lihat daftar warning aktif
*.reset @user* - Reset warning user
*.clearwarnings* - Reset semua warning
*.addlink [url]* - Tambah link PS yang diizinkan
*.removelink [nomor]* - Hapus link PS dari daftar
*.links* - Lihat semua link yang diizinkan
*.kick @user* - Kick member dari grup
*.setwelcome [pesan]* - Ubah pesan welcome
*.setgoodbye [pesan]* - Ubah pesan goodbye
*.antilink on/off* - Toggle fitur anti-link

━━━━━━━━━━━━━━━━━━━━━
ℹ️ *INFORMASI*
━━━━━━━━━━━━━━━━━━━━━

• Bot aktif 24/7
• Anti-link otomatis aktif
• Link Roblox PS diizinkan
• 2x pelanggaran = kick otomatis

_Bot Version: 2.0.0_
_Made with ❤️ for Roblox Community_`,

    // Rules message
    rulesMessage: `📋 *PERATURAN GRUP MABAR ROBLOX* 📋

1️⃣ *Perilaku Toxic*
   • Diperbolehkan dalam batas wajar
   • Jangan berlebihan sampai menyakiti perasaan

2️⃣ *Dilarang Jomok*
   • Joke berlebihan tidak diperbolehkan
   • Keep it fun and friendly

3️⃣ *Tujuan Grup*
   • Khusus untuk main bersama (mabar)
   • Fokus pada gaming dan kesenangan

4️⃣ *Anti-Link Policy*
   • DILARANG KERAS membagikan link apapun
   • Kecuali link Private Server Roblox yang sudah disetujui
   • Pelanggaran = warning → kick

5️⃣ *No Promotion*
   • Dilarang promosi dalam bentuk apapun
   • Termasuk channel, produk, atau jasa

6️⃣ *Jual-Beli*
   • Untuk transaksi, gunakan grup JB
   • Grup ini khusus untuk mabar saja

7️⃣ *No Drama*
   • Dilarang membuat drama atau konflik
   • Selesaikan masalah pribadi di luar grup

⚠️ *SANKSI:*
• Peringatan 1: Warning
• Peringatan 2: Kick otomatis
• Rejoin setelah kick: Ban permanen

_Patuhi rules untuk kenyamanan bersama!_ 🎮`,

    // Server list message template
    serverListMessage: `🎮 *DAFTAR PRIVATE SERVER ROBLOX* 🎮

{serverList}

📝 *Cara Join:*
1. Klik link di atas
2. Aplikasi Roblox akan terbuka otomatis
3. Tunggu hingga masuk ke server

❓ Ada masalah? Ketik *.helpgabisajoin*`,

    // Help untuk tidak bisa join PS
    helpGabisaJoinMessage: `🔧 *BANTUAN UNTUK MASALAH TIDAK DAPAT BERGABUNG KE PRIVATE SERVER* 

Jika Anda mengalami kesulitan bergabung ke Private Server, ikuti langkah-langkah berikut:

*Metode 1 - Reset Aplikasi:*
1️⃣ Keluar dari aplikasi Roblox sepenuhnya
2️⃣ Tutup aplikasi Roblox dari background/recent apps
3️⃣ Setelah aplikasi tertutup, klik kembali link Private Server yang dibagikan
4️⃣ Aplikasi akan terbuka otomatis dan join ke server

*Metode 2 - Persyaratan Akun (13+):*
⚠️ Akun Roblox harus berusia 13+ (tahun pembuatan akun di bawah 2010)

Cara mengubah tahun akun:
1️⃣ Buka aplikasi Roblox
2️⃣ Klik ikon titik tiga (⋯) di pojok kanan bawah
3️⃣ Pilih "Pengaturan" (Settings)
4️⃣ Pilih "Info Akun" (Account Info)
5️⃣ Ubah tanggal lahir ke tahun di bawah 2010

*Metode 3 - Membuat Akun Baru:*
Jika metode di atas memerlukan verifikasi KTP dan tidak dapat dilakukan, solusi paling efektif adalah membuat akun Roblox baru dengan tahun pembuatan di bawah 2010.

💡 Jika masih mengalami kesulitan, silakan hubungi admin grup.`,

    // Help untuk cara join PS
    helpJoinMessage: `🎮 *PANDUAN BERGABUNG KE PRIVATE SERVER ROBLOX*

Berikut adalah langkah-langkah untuk bergabung ke Private Server:

*Melalui Aplikasi Mobile:*
1️⃣ Pastikan aplikasi Roblox sudah terinstall
2️⃣ Salin (copy) link Private Server dari grup
3️⃣ Klik link tersebut atau paste di browser
4️⃣ Aplikasi Roblox akan terbuka otomatis
5️⃣ Tunggu hingga game memuat dan Anda masuk ke server

*Melalui Browser/PC:*
1️⃣ Pastikan sudah login ke akun Roblox di browser
2️⃣ Klik atau paste link Private Server
3️⃣ Klik tombol "Join Server" atau "Play"
4️⃣ Game akan dimuat melalui Roblox Player

*Tips Penting:*
• Pastikan koneksi internet stabil
• Jika server penuh, coba bergabung beberapa saat kemudian
• Pastikan akun Roblox Anda memenuhi persyaratan usia 13+

❓ Jika mengalami kendala, gunakan command *.helpgabisajoin* untuk troubleshooting.`
};

// Storage untuk warning
let warnings = new Set();

// Fitur anti-link status (default: on)
let antilinkEnabled = true;

// Daftar link Roblox Private Server yang diizinkan
let allowedRobloxLinks = [
    'https://www.roblox.com/share?code=0d0b24f63d07c945bc6fe95d2b195317&type=Server',
    'https://www.roblox.com/share?code=783531a80e979540bab8413f564fd0fc&type=Server',
    'https://www.roblox.com/share?code=1c66b587b4cc094d94fac00e2ded5931&type=Server'
];

// Event ketika QR code ready
client.on('qr', (qr) => {
    console.log('📱 Scan QR Code ini dengan WhatsApp Anda:');
    qrcode.generate(qr, {small: true});
});

// Event ketika bot ready
client.on('ready', () => {
    console.log('✅ Bot WhatsApp Roblox sudah siap!');
    console.log(`📞 Terhubung sebagai: ${client.info.pushname}`);
    console.log('🎮 Monitoring welcome, goodbye, dan anti-link...');
    console.log(`💡 Prefix command: ${config.prefix}`);
});

// Event ketika ada member baru join grup
client.on('group_join', async (notification) => {
    try {
        const chat = await notification.getChat();
        const contact = await notification.getContact();
        
        // Cek apakah grup dalam daftar target (jika ada)
        if (config.targetGroups.length > 0 && !config.targetGroups.includes(chat.id._serialized)) {
            return;
        }
        
        // Buat welcome message
        const welcomeMsg = config.welcomeMessage
            .replace('{user}', `@${contact.number}`)
            .replace('{groupName}', chat.name);
        
        // Kirim welcome message dengan mention
        await chat.sendMessage(welcomeMsg, {
            mentions: [contact]
        });
        
        console.log(`👋 Welcome message dikirim ke ${contact.pushname || contact.number} di grup ${chat.name}`);
        
    } catch (error) {
        console.error('❌ Error saat mengirim welcome message:', error);
    }
});

// Event ketika ada member leave grup
client.on('group_leave', async (notification) => {
    try {
        const chat = await notification.getChat();
        const contact = await notification.getContact();
        
        // Cek apakah grup dalam daftar target (jika ada)
        if (config.targetGroups.length > 0 && !config.targetGroups.includes(chat.id._serialized)) {
            return;
        }
        
        // Buat goodbye message
        const goodbyeMsg = config.goodbyeMessage
            .replace('{user}', contact.pushname || contact.number)
            .replace('{groupName}', chat.name);
        
        // Kirim goodbye message
        await chat.sendMessage(goodbyeMsg);
        
        // Hapus warning user yang leave (cleanup)
        const userId = contact.id._serialized;
        warnings.delete(userId);
        
        console.log(`👋 Goodbye message dikirim untuk ${contact.pushname || contact.number} di grup ${chat.name}`);
        
    } catch (error) {
        console.error('❌ Error saat mengirim goodbye message:', error);
    }
});

// Fungsi untuk cek apakah user adalah admin
async function isAdmin(message) {
    try {
        const chat = await message.getChat();
        if (!chat.isGroup) return false;
        
        const contact = await message.getContact();
        const participant = chat.participants.find(p => p.id._serialized === contact.id._serialized);
        
        return participant && (participant.isAdmin || participant.isSuperAdmin);
    } catch (error) {
        console.error('Error checking admin:', error);
        return false;
    }
}

// Fungsi untuk deteksi link yang tidak diizinkan
function containsDisallowedLink(text) {
    // Skip jika anti-link disabled
    if (!antilinkEnabled) return false;
    
    // Cek apakah ada link Roblox Private Server yang diizinkan
    const hasAllowedRobloxLink = allowedRobloxLinks.some(allowedLink => 
        text.includes(allowedLink)
    );
    
    // Jika ada link Roblox yang diizinkan, skip pemeriksaan
    if (hasAllowedRobloxLink) {
        return false;
    }
    
    // Pattern untuk mendeteksi link umum
    const linkPatterns = [
        // HTTP/HTTPS URLs
        /https?:\/\/[^\s]+/gi,
        // www URLs
        /www\.[^\s]+/gi,
        // Domain dengan TLD umum
        /[a-zA-Z0-9-]+\.(com|org|net|edu|gov|mil|int|co|id|me|io|app|ly|to|cc|tv|fm|tk|ml|ga|cf)[^\s]*/gi,
        // WhatsApp invite links
        /chat\.whatsapp\.com\/[^\s]+/gi,
        // Telegram links
        /t\.me\/[^\s]+/gi,
        // Discord invite
        /discord\.gg\/[^\s]+/gi,
        // Short links
        /(bit\.ly|tinyurl\.com|goo\.gl|t\.co|short\.link)\/[^\s]+/gi
    ];
    
    return linkPatterns.some(pattern => pattern.test(text));
}

// Main message handler
client.on('message', async (message) => {
    try {
        const chat = await message.getChat();
        
        // Hanya proses pesan grup
        if (!chat.isGroup) return;
        
        // Cek apakah grup dalam daftar target (jika ada)
        if (config.targetGroups.length > 0 && !config.targetGroups.includes(chat.id._serialized)) {
            return;
        }
        
        const command = message.body.toLowerCase().trim();
        const isUserAdmin = await isAdmin(message);
        
        // ========== COMMAND UNTUK SEMUA USER ==========
        
        // Command .menu
        if (command === `${config.prefix}menu`) {
            await message.reply(config.menuMessage);
            console.log('📋 Menu dikirim ke grup');
            return;
        }
        
        // Command .helpjoin
        if (command === `${config.prefix}helpjoin`) {
            await message.reply(config.helpJoinMessage);
            console.log('🔧 Help join dikirim ke grup');
            return;
        }
        
        // Command .helpgabisajoin
        if (command === `${config.prefix}helpgabisajoin`) {
            await message.reply(config.helpGabisaJoinMessage);
            console.log('🔧 Help gabisa join dikirim ke grup');
            return;
        }
        
        // Command .rules
        if (command === `${config.prefix}rules`) {
            await message.reply(config.rulesMessage);
            console.log('📋 Rules dikirim ke grup');
            return;
        }
        
        // Command .ping
        if (command === `${config.prefix}ping`) {
            const uptime = Math.floor(process.uptime() / 60);
            await message.reply(`🏓 *Pong!*\n\n✅ Bot aktif\n⏱️ Uptime: ${uptime} menit`);
            console.log('🏓 Ping command dijalankan');
            return;
        }
        
        // Command .serverlist
        if (command === `${config.prefix}serverlist`) {
            let serverList = '';
            if (allowedRobloxLinks.length === 0) {
                serverList = '_Tidak ada Private Server yang tersedia saat ini._';
            } else {
                allowedRobloxLinks.forEach((link, index) => {
                    serverList += `\n${index + 1}. [Server ${index + 1}](${link})`;
                });
            }
            
            const serverListMsg = config.serverListMessage.replace('{serverList}', serverList);
            await message.reply(serverListMsg);
            console.log('🎮 Server list dikirim ke grup');
            return;
        }
        
        // ========== COMMAND KHUSUS ADMIN ==========
        
        if (isUserAdmin) {
            // Command .status
            if (command === `${config.prefix}status`) {
                const status = `🤖 *Status Bot Roblox:*
                
✅ Bot aktif dan berjalan
👋 Welcome & Goodbye: Aktif
🚫 Anti-Link: ${antilinkEnabled ? 'Aktif' : 'Nonaktif'} (kecuali Roblox PS)
📊 Users dengan warning: ${warnings.size}
👥 Monitoring grup: ${chat.name}
⚡ Uptime: ${Math.floor(process.uptime() / 60)} menit

🎮 *Link Roblox PS Diizinkan:* ${allowedRobloxLinks.length} server`;
                
                await message.reply(status);
                console.log('📊 Status dikirim');
                return;
            }
            
            // Command .warnings
            if (command === `${config.prefix}warnings`) {
                let warningList = '📊 *Daftar Warning Aktif:*\n\n';
                if (warnings.size === 0) {
                    warningList += '_Tidak ada warning aktif saat ini._';
                } else {
                    let count = 1;
                    warnings.forEach(userId => {
                        const user = userId.split('@')[0];
                        warningList += `${count}. +${user}: 1/1 warning (kick next time)\n`;
                        count++;
                    });
                }
                await message.reply(warningList);
                console.log('📊 Warning list dikirim');
                return;
            }
            
            // Command .reset @user
            if (command.startsWith(`${config.prefix}reset `)) {
                const mentionedNumbers = message.mentionedIds.map(id => id._serialized);
                if (mentionedNumbers.length === 0) {
                    await message.reply('❌ Silakan mention user yang ingin direset warningnya.');
                    return;
                }
                
                mentionedNumbers.forEach(userId => {
                    warnings.delete(userId);
                });
                await message.reply(`✅ Warning direset untuk ${mentionedNumbers.length} user.`);
                console.log(`✅ Warning direset untuk ${mentionedNumbers.length} user`);
                return;
            }
            
            // Command .clearwarnings
            if (command === `${config.prefix}clearwarnings`) {
                const warningCount = warnings.size;
                warnings.clear();
                await message.reply(`✅ Semua warning telah direset. Total ${warningCount} warning dihapus.`);
                console.log(`✅ Semua warning direset (${warningCount} warning)`);
                return;
            }
            
            // Command .addlink
            if (command.startsWith(`${config.prefix}addlink `)) {
                const newLink = message.body.substring(9).trim();
                if (newLink.includes('roblox.com/share') && newLink.includes('type=Server')) {
                    allowedRobloxLinks.push(newLink);
                    await message.reply(`✅ Link Roblox PS baru ditambahkan:\n${newLink}\n\nTotal: ${allowedRobloxLinks.length} server`);
                    console.log('✅ Link Roblox PS baru ditambahkan');
                } else {
                    await message.reply('❌ Link harus berupa Roblox Private Server yang valid!');
                }
                return;
            }
            
            // Command .removelink
            if (command.startsWith(`${config.prefix}removelink `)) {
                const index = parseInt(message.body.substring(12).trim()) - 1;
                if (index >= 0 && index < allowedRobloxLinks.length) {
                    const removedLink = allowedRobloxLinks.splice(index, 1);
                    await message.reply(`✅ Link berhasil dihapus dari daftar.\n\nTotal server tersisa: ${allowedRobloxLinks.length}`);
                    console.log('✅ Link dihapus dari daftar');
                } else {
                    await message.reply(`❌ Nomor tidak valid. Gunakan nomor 1-${allowedRobloxLinks.length}`);
                }
                return;
            }
            
            // Command .links
            if (command === `${config.prefix}links`) {
                let linkList = '🎮 *Daftar Link Roblox PS yang Diizinkan:*\n\n';
                if (allowedRobloxLinks.length === 0) {
                    linkList += '_Tidak ada link yang diizinkan saat ini._';
                } else {
                    allowedRobloxLinks.forEach((link, index) => {
                        const shortCode = link.match(/code=([a-f0-9]+)/)?.[1]?.substring(0, 8) || 'unknown';
                        linkList += `${index + 1}. Server ${shortCode}...\n`;
                    });
                }
                await message.reply(linkList);
                console.log('🎮 Link list dikirim');
                return;
            }
            
            // Command .kick @user
            if (command.startsWith(`${config.prefix}kick `)) {
                const mentionedNumbers = message.mentionedIds;
                if (mentionedNumbers.length === 0) {
                    await message.reply('❌ Silakan mention user yang ingin di-kick.');
                    return;
                }
                
                try {
                    await chat.removeParticipants(mentionedNumbers);
                    await message.reply(`✅ ${mentionedNumbers.length} user berhasil di-kick dari grup.`);
                    console.log(`✅ ${mentionedNumbers.length} user di-kick`);
                } catch (error) {
                    await message.reply('❌ Gagal kick user. Pastikan bot memiliki izin admin.');
                    console.error('Error kick user:', error);
                }
                return;
            }
            
            // Command .antilink on/off
            if (command.startsWith(`${config.prefix}antilink `)) {
                const status = message.body.substring(10).trim().toLowerCase();
                if (status === 'on') {
                    antilinkEnabled = true;
                    await message.reply('✅ Fitur anti-link telah *DIAKTIFKAN*');
                    console.log('✅ Anti-link diaktifkan');
                } else if (status === 'off') {
                    antilinkEnabled = false;
                    await message.reply('⚠️ Fitur anti-link telah *DINONAKTIFKAN*');
                    console.log('⚠️ Anti-link dinonaktifkan');
                } else {
                    await message.reply('❌ Gunakan: .antilink on/off');
                }
                return;
            }
            
            // Command .setwelcome
            if (command.startsWith(`${config.prefix}setwelcome `)) {
                const newWelcome = message.body.substring(12).trim();
                if (newWelcome) {
                    config.welcomeMessage = newWelcome;
                    await message.reply('✅ Pesan welcome berhasil diubah!');
                    console.log('✅ Welcome message diubah');
                } else {
                    await message.reply('❌ Pesan welcome tidak boleh kosong!');
                }
                return;
            }
            
            // Command .setgoodbye
            if (command.startsWith(`${config.prefix}setgoodbye `)) {
                const newGoodbye = message.body.substring(12).trim();
                if (newGoodbye) {
                    config.goodbyeMessage = newGoodbye;
                    await message.reply('✅ Pesan goodbye berhasil diubah!');
                    console.log('✅ Goodbye message diubah');
                } else {
                    await message.reply('❌ Pesan goodbye tidak boleh kosong!');
                }
                return;
            }
        }
        
        // ========== ANTI-LINK SYSTEM ==========
        
        // Skip jika pengirim adalah admin
        if (isUserAdmin) return;
        
        // Cek apakah pesan mengandung link yang tidak diizinkan
        if (containsDisallowedLink(message.body)) {
            const contact = await message.getContact();
            console.log(`🔗 Link terlarang terdeteksi dari ${contact.pushname || contact.number}: ${message.body}`);
            
            // Hapus pesan
            await message.delete(true);
            
            const userId = contact.id._serialized;
            
            // Cek apakah user sudah pernah dapat warning
            if (warnings.has(userId)) {
                // Sudah pernah warning, langsung kick
                try {
                    await chat.removeParticipants([contact.id._serialized]);
                    console.log(`🚫 ${contact.pushname || contact.number} di-kick dari grup ${chat.name} (peringatan ke-2)`);
                    
                    // Hapus warning setelah kick
                    warnings.delete(userId);
                    
                    // Kirim notifikasi kick
                    const kickMsg = config.finalKick.replace('{user}', contact.number);
                    await chat.sendMessage(kickMsg, {
                        mentions: [contact]
                    });
                    
                } catch (kickError) {
                    console.error('❌ Error saat kick member:', kickError);
                    await chat.sendMessage('❌ Gagal kick member. Pastikan bot memiliki izin admin di grup ini.');
                }
            } else {
                // Pertama kali, kasih warning
                warnings.add(userId);
                
                const warningMsg = config.linkWarning.replace('{user}', contact.number);
                await chat.sendMessage(warningMsg, {
                    mentions: [contact]
                });
                
                console.log(`⚠️ Warning pertama diberikan ke ${contact.pushname || contact.number}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error saat memproses pesan:', error);
    }
});

// Error handling
client.on('auth_failure', () => {
    console.error('❌ Autentikasi gagal!');
});

client.on('disconnected', (reason) => {
    console.log('📱 Client terputus:', reason);
});

process.on('SIGINT', async () => {
    console.log('\n🛑 Menghentikan bot...');
    await client.destroy();
    process.exit(0);
});

// Mulai bot
console.log('🚀 Memulai bot WhatsApp Roblox...');
console.log('🎮 Fitur: Welcome, Goodbye, Anti-Link, Menu System');
console.log(`📝 Prefix command: ${config.prefix}`);
client.initialize();
