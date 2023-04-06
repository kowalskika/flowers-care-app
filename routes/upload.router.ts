import express from 'express';
import { uploadImage, uploadMultipleImages } from '../utils/uploadImage';
import { FlowerRecord } from '../records/flower.record';

export const uploadRouter = express.Router();

uploadRouter
  .delete('/:flowerId/:photoUrl', async (req, res) => {
    const { user: userId } = req.query as { user: string };
    const { flowerId, photoUrl } = req.params;
    const flowerEntity = await FlowerRecord.getOne(flowerId);
    if (flowerEntity.userId === userId) {
      console.log('heheh');
      const urlArr = JSON.parse(flowerEntity.photosUrl as string).filter((string: string) => {
        return string !== `https://res.cloudinary.com/dkcqqmbge/image/upload/${photoUrl.replace('*', '/')}`;
      });
      await flowerEntity.updateFlowerInfo({
        ...flowerEntity,
        photosUrl: JSON.stringify(urlArr),
      });
      res.send(urlArr);
    } else {
      res.status(404);
      res.send('err');
      res.end();
    }
  })
  .post('/many/:flowerId', async (req, res) => {
    const { user: userId } = req.query as { user: string };
    const flowerEntity = await FlowerRecord.getOne(req.params.flowerId);
    if (flowerEntity.userId !== userId) {
      res.status(404);
      res.send('err');
      res.end();
    }
    const data = await uploadMultipleImages(req.body.images);
    const copyArr = flowerEntity.photosUrl.length > 0 ? JSON.parse(flowerEntity.photosUrl as string) : [];
    data.forEach((el) => copyArr.push(el));
    console.log(JSON.stringify(data));
    await flowerEntity.updateFlowerInfo({
      ...flowerEntity,
      photosUrl: JSON.stringify(copyArr),
    });
    res.send(copyArr);
  })
  .post('/:flowerId', async (req, res) => {
    const { user: userId } = req.query as { user: string };
    const flowerEntity = await FlowerRecord.getOne(req.params.flowerId);
    if (flowerEntity.userId !== userId) {
      res.status(404);
      res.send('err');
      res.end();
    }
    const data = await uploadImage(req.body.image);
    const copyArr = flowerEntity.photosUrl.length > 0 ? JSON.parse(flowerEntity.photosUrl as string) : [];
    copyArr.push(data);
    await flowerEntity.updateFlowerInfo({
      ...flowerEntity,
      photosUrl: JSON.stringify(copyArr),
    });
    res.send(copyArr);
  });
