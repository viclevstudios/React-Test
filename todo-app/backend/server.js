import express from "express";
import cors from "cors";
import morgan from "morgan";
import pool from "./db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import authenticateToken from "./authenticateToken.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());


// GET
app.get('/api', authenticateToken, async (req, res) => {

  try {
    const userId = req.user.userId;

    const data = await pool.query("SELECT * FROM todos WHERE user_id = $1 ORDER BY id", [userId]);
    res.json(data.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Todos konnten nicht geladen werden. Versuche es später erneut" });
  }
})


// POST
app.post('/api', authenticateToken, async (req, res) => {

  try {

    const entry = req.body;
    const userId = req.user.userId;

    // Prüfen, ob der Body oder alle Felder leer sind
    if (!entry || entry === {} || ((!entry.name || entry.name.trim() === "") && (!entry.deadline || entry.deadline.trim() === ""))) {
      return res.status(400).json({ name: "Bitte gib einen Namen für den Todo-Eintrag an", deadline: "Bitte gib eine Deadline für den Todo-Eintrag an" });
    }

    // Prüfen, ob der neue Name gültig ist
    if (!entry.name || entry.name.trim() === "") {
      return res.status(400).json({ name: "Bitte gib einen Namen für den Todo-Eintrag an" });
    }
    // Überprüfen, ob ein solcher Eintrag bereits existiert
    const query = await pool.query("SELECT * FROM todos WHERE name = $1 AND user_id = $2", [entry.name, userId]);
    if (query.rowCount !== 0) {
      return res.status(409).json({ name: "Es gibt bereits ein Todo-Eintrag mit diesem Namen" });
    }

    // Prüfen, ob die neue Deadline gültig ist
    if (!entry.deadline || entry.deadline.trim() === "") {
      return res.status(400).json({ deadline: "Bitte gib eine Deadline für den Todo-Eintrag an" });
    }

    // Neuen Eintrag zur Datenbank hinzufügen
    await pool.query(`INSERT INTO todos(name, deadline, user_id) VALUES ($1, $2, $3)`, [entry.name, entry.deadline, userId]);
    console.log("Neuer Eintrag hinzugefügt: " + entry.name);

    // Erfolgsmeldung
    const id = await pool.query("SELECT id FROM todos WHERE name = $1 AND user_id = $2", [entry.name, userId]);
    res.status(201).json({ id: id, name: entry.name, deadline: entry.deadline });
  } catch (err) {

    // Fehlermeldung
    console.error(err);
    return res.status(500).json({ general: "Todo konnte nicht erstellt werden. Versuche es später erneut" });
  }
});


// DELETE
app.delete('/api/:id', authenticateToken, async (req, res) => {

  try {

    const id = parseInt(req.params.id);
    const userId = req.user.userId;

    // Prüfen, ob das Element existiert, das gelöscht werden soll
    const query = await pool.query("SELECT * FROM todos WHERE id = $1 AND user_id = $2", [id, userId]);
    if (!query.rowCount === 0) {
      return res.status(404).json({ error: "Der zu löschende Todo-Eintrag wurde nicht gefunden" });
    }

    // Das Element aus der Datenbank löschen
    await pool.query("DELETE FROM todos WHERE id = $1 AND user_id = $2", [id, userId])

    // Erfolgsmeldung
    res.status(201).json(id);
  } catch (err) {

    // Fehlermeldung
    console.error(err);
    return res.status(500).json({ error: "Todo konnte nicht gelöscht werden. Versuche es später erneut" });
  }
});


// PATCH
app.patch('/api/:id', authenticateToken, async (req, res) => {

  try {

    const id = parseInt(req.params.id);
    const userId = req.user.userId;
    const { newName, newDeadline } = req?.body ?? undefined;

    // Prüfen, ob das Element existiert, das verändert werden soll
    const query = await pool.query("SELECT * FROM todos WHERE id = $1 AND user_id = $2", [id, userId]);
    if (!query.rowCount === 0) {
      return res.status(404).json({ general: "Der zu bearbeitende Todo-Eintrag wurde nicht gefunden" });
    }

    // Prüfen, ob überhaupt Änderungen angegeben wurden
    if (!newName && !newDeadline) {
      return res.status(400).json({ general: "Keine gültige Änderung angegeben" });
    }

    // Prüfen, ob der angegebene neue Name gültig ist
    const oldName = query.rows[0].name;
    if (newName !== oldName) {
      if (typeof newName !== "string" || newName.trim() === "") {
        return res.status(400).json({ name: "Der neue Name ist ungültig" });
      }

      await pool.query("Update todos SET name = $1 WHERE id = $2 AND user_id = $3", [newName, id, userId]);
    }

    // Prüfen, ob die angegebene neue Deadline gültig ist
    const oldDeadline = query.rows[0].deadline;
    if (newDeadline !== undefined) {
      if (typeof newDeadline !== "string" || newDeadline.trim() === "") {
        return res.status(400).json({ deadline: "Die neue Deadline ist ungültig" });
      }

      await pool.query("Update todos SET deadline = $1 WHERE id = $2 AND user_id = $3", [newDeadline, id, userId]);
    }

    // Erfolgsmeldung
    res.status(201).json({ id: id, name: newName, deadline: newDeadline });
  } catch (err) {

    // Fehlermeldung
    console.error(err);
    return res.status(500).json({ general: "Todo konnte nicht erstellt werden. Versuche es später erneut" });
  }
});


// User erstellen 
app.post('/api/register', async (req, res) => {
  try {

    const username = req.body.username.trim();
    const password = req.body.password;

    // Prüfen, ob der Body oder alle Felder leer sind
    if (!req.body || req.body === {} || (!username || (username.trim() === "") && (!password || password.trim() === ""))) {
      return res.status(400).json({ username: "Bitte gib einen Username an", password: "Bitte gib ein Passwort an" });
    }

    // Prüfen, ob der Username gültig ist
    if (!username || username.trim() === "") {
      return res.status(400).json({ username: "Bitte gib einen gültigen Username an" });
    }
    const query = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (query.rowCount !== 0) {
      return res.status(409).json({ username: "Dieser Username ist bereits vergeben" });
    }
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ username: "Der Username muss zwischen 3 und 30 Zeichen lang sein" });
    }

    // Prüfen, ob das Passwort gültig ist
    if (!password || password.trim() === "") {
      return res.status(400).json({ password: "Bitte gib ein gültiges Passwort an" });
    }
    if (password.length < 8 || password.length > 100) {
      return res.status(400).json({ password: "Das Passwort muss zwischen 8 und 100 Zeichen lang sein" });
    }

    // Passwort hashen
    const passwordHash = await bcrypt.hash(password, 10);

    // Den Namen zur Datenbank hinzufügen
    await pool.query("INSERT INTO users(username, password_hash) VALUES ($1, $2)", [username, passwordHash])

    // Erfolgsmeldung
    res.status(201).json({ username, passwordHash });
  } catch (err) {

    // Fehlermeldung
    console.error(err);
    return res.status(500).json({ general: "Der Account konnte nicht erstellt werden. Probiere es später erneut" });
  }
});


// Login
app.post('/api/login', async (req, res) => {
  try {

    const username = req.body.username.trim();
    const password = req.body.password;

    // Prüfen, ob der Body oder alle Felder leer sind
    if (!req.body || req.body === {} || (!username || username === "") && (!password || password.trim() === "")) {
      return res.status(400).json({ username: "Bitte gib einen gültigen Username an", password: "Bitte gib ein gültiges Passwort an" });
    }

    // Prüfen, ob der Username gültig ist
    if (!username || username.trim() === "") {
      return res.status(400).json({ username: "Bitte gib einen gültigen Username an" });
    }
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (user.rowCount === 0) {
      return res.status(404).json({ username: "Der eingegebene Username existiert nicht" });
    }

    // Prüfen, ob das Passwort gültig ist
    if (!password || password.trim() === "") {
      return res.status(400).json({ password: "Bitte gib ein gültiges Passwort an" });
    }
    const passwordMatch = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ general: "Username und Passwort stimmen nicht überein" });
    }

    // JWT generieren
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        userId: user.rows[0].id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m"
      }
    );

    // Als HTTP-only-Cookie speichern
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });

    // Erfolgsmeldung
    res.status(200).json({
      message: "Login erfolgreich"
    });
  } catch (err) {

    // Fehlermeldung
    console.error(err);
    return res.status(500).json({ general: "Anmeldung fehlgeschlagen. Versuche es später erneut" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on Port 3000");
});