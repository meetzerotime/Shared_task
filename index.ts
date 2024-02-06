import express, { Request, Response } from 'express';
const PORT = 3000;
const app = express();
import bodyParser from 'body-parser';
import getdata from './solutioncode';

// Middleware
app.use(bodyParser.json());

// Define routes
app.post('/request', (req: Request, res: Response) => {
  getdata(req, res);
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
