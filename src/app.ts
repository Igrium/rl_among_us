import express from 'express';

const port = 5000;
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.use(express.static('public'));

app.listen(port, () => console.log(`Server started on port ${port}`));