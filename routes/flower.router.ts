import express from 'express';
import { FlowerRecord } from '../records/flower.record';
import { FlowerEntity, CreateFlowerReq } from '../types';
import { ValidationError } from '../utils/errors';

export const flowerRouter = express.Router();

flowerRouter
  .get('/', async (req, res) => {
    const flowersList = await FlowerRecord.listAll();
    res.json(
      flowersList as FlowerEntity[],
    );
  });

flowerRouter
  .get('/:flowerId', async (req, res) => {
    const flowerEntity = await FlowerRecord.getOne(req.params.flowerId);
    if (flowerEntity === null) {
      throw new ValidationError('Ops, something went wrong: flower with this id does not exist. Please try again.');
    }
    res.json(flowerEntity);
  });

flowerRouter
  .post('/', async (req, res) => {
    const addedFlower = new FlowerRecord(req.body as CreateFlowerReq);
    await addedFlower.insert();
    res.json(addedFlower);
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
  .delete('/:id', async (req, res) => {
    const flowerToDelete = await FlowerRecord.getOne(req.params.id);
    if (!flowerToDelete) throw new ValidationError('Ops, something went wrong: flower with this id does not exist. Please try again.');

    await flowerToDelete.delete();
    res.end();
  });
