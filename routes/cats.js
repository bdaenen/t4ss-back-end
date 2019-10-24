let express = require('express');
let router = express.Router();
let Cat = require('../db/models/Cat');
let fs = require('fs');

router.get('/', async function(req, res) {
    let cats = await Cat.query()
        //.eager('[sire, dam, damOf, sireOf]')
        .orderBy('id');
    res.json(cats);
});

/**
 *
 */
router.get('/:id(\\d+)', async function(req, res) {
    res.json(
        await Cat.query()
          .eager('[sire.[sire.^, dam.^], dam.[sire.^, dam.^], damOf, sireOf]')
          .where('id', req.params.id)
    );
});

router.put('/:id(\\d+)', async function(req, res) {
    res.json(
      await Cat.query()
        .updateAndFetchById(req.params.id, req.body)
    );
});

router.patch('/:id(\\d+)', async function (req, res) {
    res.json(
      await Cat.query()
        .patchAndFetchById(req.params.id, req.body)
    );
});

router.delete('/:id(\\d+)', async function(req, res) {
    let success = await Cat.query()
        .deleteById(req.params.id) === 1;

    res.json({success});
});

/**
 *
 */
router.post('/add', async function(req, res) {
    try {
        let newCat = await Cat.query().insert(req.body);

        if (newCat) {
            res.json(newCat);
        }
        else {
            throw new Error('Something went wrong while inserting a cat.');
        }
    }
    catch (error) {
        res.status(400);
        res.json({success: false, error: error.message});
    }
});

router.post('/:id(\\d+)/addPhoto', async function (req, res) {
    try {
        let cat = await Cat.query()
          .where('id', req.params.id)
          .first();

        if (!cat) {
            res.status(400).json({success: false, error: 'The given ID does not exist.'});
            return;
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).json({success: false, error: 'No files were uploaded.'});
            return;
        }

        let fileNames = Object.keys(req.files);

        let file = req.files[fileNames[0]];
        let uploadDir = `${__dirname}/../public`;
        let uploadName = `${Date.now()}_${file.name}`;
        let uploadPath = `${uploadDir}/${uploadName}`;
        let uploadUrl = `${process.env.HTTP_DOMAIN}/${uploadName}`;

        try {
            await fs.promises.lstat(uploadDir);
        } catch (e) {
            await fs.promises.mkdir(uploadDir);
        }

        file.mv(uploadPath, async function (err) {
            if (err) {
                return res.status(500).send(err);
            }

            cat.photoLink = uploadUrl;
            res.json(
              await cat.$query().updateAndFetch(cat)
            );
        });

    } catch (error) {
        res.status(400);
        res.json({success: false, error: error.message});
    }
});

module.exports = router;
