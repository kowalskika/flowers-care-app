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
      const urlArr = JSON.parse(flowerEntity.photosUrl as string).filter((string: string) => {
        return string !== `https://res.cloudinary.com/dkcqqmbge/image/upload/${photoUrl.replace('*', '/')}`;
      });
      await flowerEntity.updatePhotosArr(JSON.stringify(urlArr), flowerId);
      res.send(urlArr);
    } else {
      res.status(404);
      res.send('err');
      res.end();
    }
  });

uploadRouter
  .post('/many/:flowerId', async (req, res) => {
    const { user: userId } = req.query as { user: string };
    const { flowerId } = req.params;

    const flowerEntity = await FlowerRecord.getOne(flowerId);

    if (flowerEntity.userId !== userId) {
      res.status(404);
      res.send('err');
      res.end();
    }
    const data = await uploadMultipleImages(req.body.base64s);
    const copyArr = flowerEntity.photosUrl.length > 0 ? JSON.parse(flowerEntity.photosUrl as string) : [];
    data.forEach((el) => copyArr.push(el));

    await flowerEntity.updatePhotosArr(JSON.stringify(copyArr), flowerId);

    res.send(copyArr);
  });

uploadRouter
  .post('/:flowerId', async (req, res) => {
    const { user: userId } = req.query as { user: string };
    const { flowerId } = req.params;
    const flowerEntity = await FlowerRecord.getOne(flowerId);

    if (flowerEntity.userId !== userId) {
      res.status(404);
      res.send('err');
      res.end();
    }
    const data = await uploadImage(req.body.image);
    const copyArr = flowerEntity.photosUrl.length > 0 ? JSON.parse(flowerEntity.photosUrl as string) : [];
    copyArr.push(data);
    await flowerEntity.updatePhotosArr(JSON.stringify(copyArr), flowerId);
    res.send(copyArr);
  });
