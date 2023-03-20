import express from 'express';
import { FlowerRecord } from '../records/flower.record';
import { FlowerEntity } from '../types/flower/flower.entity';
import { ValidationError } from '../utils/errors';

export const flowerRouter = express.Router();

flowerRouter
  .get('/', async (req, res) => {
    const flowersList = await FlowerRecord.listAll();
    console.log(flowersList);
    res.json(
      flowersList as FlowerEntity[],
    );
  });

flowerRouter
  .get('/:flowerId', async (req, res) => {
    const flowerEntity = await FlowerRecord.getOne(req.params.flowerId);
    if (flowerEntity === null) {
      throw new ValidationError('There is no child with this ID. Try again.');
    }
    res.json(flowerEntity);
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
