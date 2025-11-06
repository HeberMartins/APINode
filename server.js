import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json()); //API Aceita Json

app.use(cors({
    origin: 'http://localhost:4200', //URL do Angular
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

//Conectar no MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { dbName: 'Aulas' })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.log('Erro na conexão', err.message));

// Modelo Aluno
const alunoSchema = new mongoose.Schema({
    nome: { type: String, required: true, trim: true, minlength: 2 },
    idade: { type: Number, required: true, min: 0, max: 120 },
    curso: { type: String, required: true, trim: true },
    notas: { type: [Number], default: [], validade: v => v.every(n => n => 0 && n <= 10) }
}, { collection: 'Alunos', timestamps: true });

const Aluno = mongoose.model('Aluno', alunoSchema, 'Alunos');

//Rota inicial 
app.get('/', (req, res) => res.json({ msg: 'API rodando' }));

//Cria aluno
app.post('/alunos', async (req, res) => {
    res.status(201).json(aluno);
})

//Listar alunos
app.get('/alunos', async (req, res) => {
    const alunos = await Aluno.find();
    res.json(alunos);
});


app.put('/alunos/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const aluno = await Aluno.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true, overwrite: true }
        );
        if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
        req.json(aluno);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/alunos/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const aluno = await Aluno.findByIdAndDelete(req.params.id);
        if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/alunos/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const aluno = await Aluno.findById(req.params.id);
        if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Iniciar servidor
app.listen(process.env.PORT, () =>
    console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
)