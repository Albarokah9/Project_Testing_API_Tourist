const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Albareizy942!**', // Ganti dengan password MySQL kamu
    database: 'tourist_api',
};

let db;

// Connect to database
async function connectDB() {
    try {
        db = await mysql.createConnection(dbConfig);
        console.log('✅ MySQL Connected');
    } catch (error) {
        console.error('❌ MySQL Error:', error);
    }
}

// Routes
app.get('/tourist', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM tourist ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/tourist/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM tourist WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Tourist not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/tourist', async (req, res) => {
    try {
        const { tourist_name, tourist_email, tourist_location } = req.body;

        if (!tourist_name || !tourist_email || !tourist_location) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const [result] = await db.execute(
            'INSERT INTO tourist (tourist_name, tourist_email, tourist_location) VALUES (?, ?, ?)',
            [tourist_name, tourist_email, tourist_location],
        );

        const [newTourist] = await db.execute('SELECT * FROM tourist WHERE id = ?', [
            result.insertId,
        ]);
        res.status(201).json(newTourist[0]);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

app.put('/tourist/:id', async (req, res) => {
    try {
        const { tourist_name, tourist_email, tourist_location } = req.body;

        const [result] = await db.execute(
            'UPDATE tourist SET tourist_name = ?, tourist_email = ?, tourist_location = ? WHERE id = ?',
            [tourist_name, tourist_email, tourist_location, req.params.id],
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Tourist not found' });
        }

        const [updated] = await db.execute('SELECT * FROM tourist WHERE id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/tourist/:id', async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM tourist WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Tourist not found' });
        }

        res.json({ message: 'Tourist deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
