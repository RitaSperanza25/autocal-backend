const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Permette le richieste da Vercel (CORS)
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.get('/', (req, res) => {
  res.send('Server AutoCal AI Online e Funzionante!');
});

app.post('/api/parse-event', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt mancante' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(`Estrai i dettagli dell'evento dal testo: "${prompt}". Rispondi in JSON con i campi: title, date, time, location.`);
    const responseText = await result.response.text();

    res.json({ success: true, data: responseText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore interno del server backend' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server attivo sulla porta ${PORT}`);
});
