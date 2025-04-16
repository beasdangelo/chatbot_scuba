const qrcode = require('qrcode-terminal');
const { Client, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');

const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

// Função para enviar o menu
async function enviarMenu(from, nome) {
    await client.sendMessage(from,
`🌊 *Olá ${nome || ''}! Bem-vindo(a) à SCUBA!* 🤿

Sou o assistente virtual do nosso Curso de Mergulho.

👇 Escolha uma das opções abaixo e envie apenas o número:

1️⃣ - Como funciona o curso  
2️⃣ - Valores  
3️⃣ - Benefícios  
4️⃣ - Como se inscrever  
5️⃣ - Outras dúvidas  
6️⃣ - Falar com um atendente 🤝

Estamos prontos para te levar ao fundo do mar! 🐠🐢`);
}

client.on('message', async msg => {
    const text = msg.body.trim().toLowerCase();
    const from = msg.from;
    const contact = await msg.getContact();
    const name = contact.pushname?.split(" ")[0] || 'mergulhador(a)';

    // Lista de opções válidas
    const opcoesValidas = ['1', '1️⃣', '2', '2️⃣', '3', '3️⃣', '4', '4️⃣', '5', '5️⃣', '6', '6️⃣'];

    // Ativador (primeiro contato ou palavras soltas)
    if (text.includes('mergulho') || text.includes('curso') || text.includes('noite') || text.includes('tarde') || text.includes('dia')) {
        await enviarMenu(from, name);
        return;
    }

    // Respostas das opções
    if (text === '1' || text === '1️⃣') {
        await client.sendMessage(from,
`📘 *Como funciona o curso:*

O Curso de Mergulho Básico (Open Water Diver) tem duas etapas:

1️⃣ *Teoria + Piscina* (São Paulo): Aprenda a usar os equipamentos e técnicas em ambiente controlado.  
2️⃣ *Mergulhos no mar* (Paraty - RJ): 4 mergulhos no mar para validação do seu aprendizado.

✅ Ao final, você recebe uma *Certificação Internacional*! 🌍`);
        return;
    }

    if (text === '2' || text === '2️⃣') {
        await client.sendMessage(from,
`💰 *Valores do Curso SCUBA:*

📘 *Etapa I* (Teoria + Piscina): R$ 1.500,00  
🌊 *Etapa II* (Check-Out no mar): R$ 3.000,00 *(sem hospedagem)*  
📄 *Certificação Internacional*: R$ 400,00

✅ Todos os equipamentos estão inclusos!`);
        return;
    }

    if (text === '3' || text === '3️⃣') {
        await client.sendMessage(from,
`🌟 *Benefícios do curso SCUBA:*

✅ Certificação internacional  
✅ Equipamentos inclusos  
✅ Aulas com horários flexíveis  
✅ Mergulhos reais no mar em Paraty  
✅ Instrutores experientes  

💬 Ideal pra quem quer iniciar no mundo do mergulho com segurança e aventura!`);
        return;
    }

    if (text === '4' || text === '4️⃣') {
        await client.sendMessage(from,
`📝 *Como se inscrever:*

📍 Nossa sede fica na Rua Canário, 422 - Moema - São Paulo/SP  
📞 Telefones: (11) 3045-1180 / 3045-0465  

⚠️ *Atendimento presencial somente com horário marcado.*  
Agendamentos de segunda a sexta, das *10h às 16h*.  

📎 Enviando agora o PDF com todos os detalhes...`);

        const filePath = path.join(__dirname, 'APRESENTACAO SCUBA - 2025.pdf');
        if (fs.existsSync(filePath)) {
            const media = MessageMedia.fromFilePath(filePath);
            await client.sendMessage(from, media);
        } else {
            await client.sendMessage(from, '⚠️ Não encontrei o PDF. Verifique se ele está na mesma pasta que o bot.');
        }
        return;
    }

    if (text === '5' || text === '5️⃣') {
        await client.sendMessage(from,
`❓ *Outras dúvidas:*

Pode me mandar sua pergunta por aqui mesmo! 😊

📞 Telefones: (11) 3045-1180 / 3045-0465  
📍 Rua Canário, 422 - Moema - São Paulo/SP  

Será um prazer te ajudar! 🤿`);
        return;
    }

    if (text === '6' || text === '6️⃣' || text.includes('atendente')) {
        await client.sendMessage(from,
`🤝 *Falar com um atendente:*

Assim que um de nossos atendentes estiver disponível, ele vai te responder por aqui. 😊

🕐 *Horário de atendimento:*  
Segunda a sexta, das *10h às 16h*.`);
        return;
    }

    // Qualquer outra resposta = não entendeu
    if (!opcoesValidas.includes(text)) {
        await client.sendMessage(from,
`⚠️ *Não entendi sua resposta.* Mas estou aqui pra te ajudar!`);

        await delay(1500);

        await client.sendMessage(from,
`📍 *Nosso horário de atendimento é de segunda a sexta, das 10h às 16h.*  
Se quiser falar com um atendente, digite *6*.

Segue novamente o menu abaixo para te ajudar:`);
        await enviarMenu(from, name);
    }
});
