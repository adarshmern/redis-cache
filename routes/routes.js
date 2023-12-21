const express = require('express');
const router = express.Router();
const client = require('../config/redisConnection');
const axios = require('axios')

router.post('/', async (req, res) => {
    const { key, value } = req.body;
    client.set(key, value).then(respo => {
        return res.json(respo)
    }).catch(err => {
        return res.json({ error: err.message })
    })
})

router.get('/', async (req, res) => {
    const { key } = req.body;
    client.get(key).then(respo => {
        return res.json(respo)
    }).catch(err => {
        return res.json({ error: err.message })
    })
})

router.get('/posts/:id', async (req, res) => {
    const id = req.params.id;
    try {
        client.get(`post-${id}`).then(async(respo) => {
            console.log(respo);
            if (respo) {
                console.log('cached');
                return res.json(JSON.parse(respo))
            }
            else {
                const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
                client.set(`post-${id}`, JSON.stringify(response.data)).then(respo => {
                }).catch(err => {
                    return res.json({ error: err.message })
                })
                return res.json(response.data);
            }
        })

    } catch (err) {
        return res.json({ message: err.message });
    }
})


module.exports = router;