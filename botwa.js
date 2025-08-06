const { makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

// Database sederhana untuk menyimpan data grup
let groupSettings = {};

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('📱 Scan QR Code ini dengan WhatsApp:');
            qrcode.generate(qr, { small: true });
        }
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            console.log('🎮 WhatsApp Roblox Bot Connected!');
            console.log('✅ Bot siap digunakan untuk komunitas Roblox mabar!');
        }
    });

    // Handler untuk pesan masuk
    sock.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];
        if (!message.message) return;
        if (message.key.fromMe) return;
        
        const text = message.message.conversation || 
                    message.message.extendedTextMessage?.text || '';
        const from = message.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        
        // Anti-link feature
        if (isGroup && (text.includes('http') || text.includes('www.') || text.includes('.com'))) {
            try {
                await sock.sendMessage(from, {
                    text: '❌ Link tidak diperbolehkan di grup Roblox ini!\n🎮 Mari fokus diskusi gaming saja.'
                });
                // Hapus pesan (jika bot admin)
                await sock.sendMessage(from, {
                    delete: message.key
                });
            } catch (err) {
                console.log('Error menghapus link:', err);
            }
        }
        
        // Command system
        if (text.startsWith('!')) {
            const command = text.slice(1).toLowerCase();
            
            switch (command) {
                case 'ping':
                    await sock.sendMessage(from, {
                        text: '🏓 Pong! Bot Roblox aktif!'
                    });
                    break;
                    
                case 'help':
                    await sock.sendMessage(from, {
                        text: `🎮 *WhatsApp Roblox Bot Commands:*
                        
!ping - Cek status bot
!help - Lihat semua command
!mabar - Info jadwal mabar
!rules - Aturan grup
!roblox - Link komunitas Roblox
!admin - Panggil admin

*Anti-Link aktif di grup ini!*`
                    });
                    break;
                    
                case 'mabar':
                    await sock.sendMessage(from, {
                        text: `🎮 *Jadwal Mabar Roblox:*
                        
📅 Setiap Hari: 19.00 - 22.00 WIB
🎯 Game Popular: Adopt Me, Tower Defense, Bloxburg
👥 Min. 3 orang untuk mulai

Ketik !join untuk ikutan mabar!`
                    });
                    break;
                    
                case 'rules':
                    await sock.sendMessage(from, {
                        text: `📋 *Aturan Grup Roblox:*
                        
1. ❌ No spam/flood
2. ❌ No link tanpa izin
3. 🎮 Fokus diskusi Roblox
4. 🤝 Saling menghormati
5. 📢 Mabar sesuai jadwal
6. 👮‍♂️ Ikuti instruksi admin

*Melanggar = kick!*`
                    });
                    break;
                    
                case 'roblox':
                    await sock.sendMessage(from, {
                        text: `🎮 *Komunitas Roblox Mabar*
                        
🌟 Bergabunglah dengan komunitas gaming terbaik!
🎯 Main bareng setiap hari
👥 Member aktif dan friendly
🏆 Event mingguan dengan hadiah

*Mari bermain bersama!* 🚀`
                    });
                    break;
                    
                case 'admin':
                    await sock.sendMessage(from, {
                        text: '📢 Admin dipanggil! @admin tolong bantu disini 🙏'
                    });
                    break;
            }
        }
        
        // Auto reply untuk kata kunci tertentu
        if (text.toLowerCase().includes('roblox')) {
            await sock.sendMessage(from, {
                text: '🎮 Ada yang bahas Roblox! Ayo mabar bareng! Ketik !mabar untuk info jadwal 🚀'
            });
        }
    });

    // Handler untuk member join/leave
    sock.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;
        
        for (let participant of participants) {
            if (action === 'add') {
                // Welcome message
                await sock.sendMessage(id, {
                    text: `🎮 *Welcome to Roblox Mabar Group!* 
                    
Halo @${participant.split('@')[0]}! 👋

🌟 Selamat bergabung di komunitas Roblox terbaik!
🎯 Ketik !help untuk lihat semua command
📅 Ketik !mabar untuk info jadwal main bareng
📋 Ketik !rules untuk aturan grup

*Mari bermain dan bersenang-senang bersama!* 🚀`,
                    mentions: [participant]
                });
            } else if (action === 'remove') {
                // Goodbye message
                await sock.sendMessage(id, {
                    text: `👋 Member keluar dari grup. 
                    
Sampai jumpa di game Roblox! 🎮
Pintu selalu terbuka untuk kembali 🚪✨`
                });
            }
        }
    });
}

// Jalankan bot
startBot().catch(err => {
    console.error('Error starting bot:', err);
});
