const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateJWT = require('./middleware/auth');
const { PrismaClient } = require('@prisma/client');
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ userId: user.id }, 'your-secret-key');
  res.json({ token });
});

// Get all students
app.get('/students', async (req, res) => {
  const students = await prisma.student.findMany();
  res.json(students);
});

// Get a student by ID
app.get('/students/:id', async (req, res) => {
  const { id } = req.params;
  const student = await prisma.student.findUnique({ where: { id: parseInt(id) } });
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(student);
});

// Create a new student
app.post('/students', async (req, res) => {
  const { name, age, grade } = req.body;
  const student = await prisma.student.create({ data: { name, age: parseInt(age), grade } });
  res.json(student);
});

// Update a student
app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, grade } = req.body;
  const updatedStudent = await prisma.student.update({
    where: { id: parseInt(id) },
    data: { name, age: parseInt(age), grade },
  });
  res.json(updatedStudent);
});

// Delete a student
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.student.delete({ where: { id: parseInt(id) } });
  res.json({ message: 'Student deleted successfully' });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
