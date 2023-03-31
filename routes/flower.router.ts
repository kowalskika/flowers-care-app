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
      res.status(404);
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
  .put('/:id', async (req, res) => {
    const { body }: {
      body: FlowerEntity
    } = req;
    const flower = await FlowerRecord.getOne(req.params.id);
    if (flower === null) {
      throw new ValidationError('There is no flower with this ID. Try again.');
    }
    const data = await flower.updateFlowerInfo(body);
    res.json(data);
  });

flowerRouter
  .patch('/:id', async (req, res) => {
    const { body }: {
      body: any
    } = req;
    console.log(req.params.id);
    const flower = await FlowerRecord.getOne(req.params.id);
    if (flower === null) {
      throw new ValidationError('There is no flower with this ID. Try again.');
    }
    const nextWaterAt = await flower.updateData(body.wateredAt);
    res.json(nextWaterAt);
  });

flowerRouter
  .delete('/:id', async (req, res) => {
    const flowerToDelete = await FlowerRecord.getOne(req.params.id);
    if (!flowerToDelete) throw new ValidationError('Ops, something went wrong: flower with this id does not exist. Please try again.');

    await flowerToDelete.delete();
    res.end();
  });
