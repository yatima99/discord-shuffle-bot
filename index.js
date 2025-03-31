const { Client, GatewayIntentBits, Partials, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

client.once('ready', () => {
  console.log(`${client.user.tag} が起動しました！`);
  
  const commands = [
    new SlashCommandBuilder()
      .setName('shuffle')
      .setDescription('ボイスチャンネルの参加者をランダムに並び替えます'),
  ];
  
  client.application.commands.set(commands)
    .then(() => console.log('スラッシュコマンドが登録されました'))
    .catch(console.error);
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  
  const { commandName } = interaction;
  
  if (commandName === 'shuffle') {
    const member = interaction.member;
    const voiceChannel = member.voice.channel;
    
    if (!voiceChannel) {
      return interaction.reply({
        content: 'このコマンドを使用するには、ボイスチャンネルに接続している必要があります。',
        ephemeral: true
      });
    }
    
    const members = voiceChannel.members.map(m => m.user.username);
    
    if (members.length <= 1) {
      return interaction.reply({
        content: 'ボイスチャンネルにはあなた以外のメンバーがいません。',
        ephemeral: true
      });
    }
    
    const shuffledMembers = shuffleArray([...members]);
    

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🎲 発表順が決まりました！')
      .setDescription(`**${voiceChannel.name}** のメンバー (${shuffledMembers.length}人)`)
      .addFields(
        shuffledMembers.map((username, index) => {
          return {
            name: `${index + 1}番目`,
            value: username,
            inline: true
          };
        })
      )
  
    await interaction.reply({ embeds: [embed] });
  }
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

client.login(process.env.TOKEN);