import express from 'express';

export const flowerRouter = express.Router();

flowerRouter
  .get('/', (req, res) => {
    res.json({ message: 'show all' });
  });

flowerRouter
  .get('/:id', async (req, res) => {
    res.json({ message: 'show one' });
  });

flowerRouter
  .post('/', (req, res) => {
    res.json({ message: 'add new' });
  });

flowerRouter
  .put('/:id', (req, res) => {
    res.json({ message: 'update data' });
  });

flowerRouter
  .patch('/:id', (req, res) => {
    res.json({ message: 'partial update data' });
  });

flowerRouter
  .delete('/:id', (req, res) => {
    res.json({ message: 'deleted one' });
  });
