import express from 'express';
import { FlowerRecord } from '../records/flower.record';
import { FlowerEntity, FLowerUpdateDateReq } from '../types';
import { ValidationError } from '../utils/errors';
import { UserRecord } from '../records/user.record';

export const flowerRouter = express.Router();

flowerRouter
  .get('/', async (req, res) => {
    const { user: userId } = req.query as { user: string };
    const user = await UserRecord.getUserById(userId);
    if (user !== null) {
      const flowersList = await FlowerRecord.listAllByUserId(userId);
      res.json(
        flowersList as FlowerEntity[],
      );
    } else {
      res.sendStatus(404);
    }
  });

flowerRouter
  .get('/:flowerId', async (req, res) => {
    const { user: userId } = req.query as { user: string };
    const flowerEntity = await FlowerRecord.getOne(req.params.flowerId);

    if (flowerEntity === null) {
      res.sendStatus(404);
      throw new ValidationError('Ops, something went wrong: flower with this id does not exist. Please try again.');
    }

    if (flowerEntity.userId === userId) {
      res.json(flowerEntity);
    } else {
      res.sendStatus(404);
    }
  });

flowerRouter
  .post('/', async (req, res) => {
    const user = await UserRecord.getUserById(req.body.userId);
    if (user !== null) {
      const addedFlower = new FlowerRecord(req.body as FlowerEntity);
      await addedFlower.insert();
      res.json(addedFlower);
    } else {
      res.sendStatus(404);
    }
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
    if (flower.userId === body.userId) {
      const data = await flower.updateFlowerInfo(body);
      res.json(data);
    } else {
      res.sendStatus(404);
    }
  });

flowerRouter
  .patch('/:id', async (req, res) => {
    const { body }: {
      body: FLowerUpdateDateReq
    } = req;
    const flower = await FlowerRecord.getOne(req.params.id);
    if (flower === null) {
      throw new ValidationError('There is no flower with this ID. Try again.');
    }
    if (flower.userId === body.userId) {
      const nextWaterAt = await flower.updateDate(body.wateredAt);
      res.json(nextWaterAt);
    } else {
      res.sendStatus(404);
    }
  });

flowerRouter
  .delete('/:id', async (req, res) => {
    const { user: userId } = req.query as { user: string };
    const flowerToDelete = await FlowerRecord.getOne(req.params.id);
    if (!flowerToDelete) throw new ValidationError('Ops, something went wrong: flower with this id does not exist. Please try again.');
    if (flowerToDelete.userId === userId) {
      await flowerToDelete.delete();
      res.end();
    } else {
      res.sendStatus(404);
    }
  });
