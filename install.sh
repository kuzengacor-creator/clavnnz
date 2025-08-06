```bash
#!/bin/bash

echo "🤖 Installing WhatsApp Roblox Bot..."

# Update Termux packages
echo "📦 Updating packages..."
pkg update -y
pkg upgrade -y

# Install required packages
echo "⬇️ Installing Node.js and dependencies..."
pkg install -y nodejs npm git

# Install bot dependencies
echo "🔧 Installing bot dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Installation completed successfully!"
    echo ""
    echo "🎮 WhatsApp Roblox Bot is ready!"
    echo "Run 'npm start' to start the bot"
    echo ""
    echo "📱 Scan QR code yang muncul dengan WhatsApp Anda"
else
    echo "❌ Installation failed. Please try again."
    exit 1
fi
