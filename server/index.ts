import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import timeout from 'connect-timeout';

dotenv.config();

import chatHandler from './chat';
import listIndexesHandler from './listIndexes';

import promptHandler from './chronicles/prompt';
import characterHandler from './chronicles/character';
import imageGenerationHandler from './chronicles/leonardo';
import synthesizeHandler from './chronicles/synthesize';
import youTubeChatHandler from './chronicles/liveChat';
import introHandler from './chronicles/intro';
import outroHandler from './chronicles/outro';
import elevenlabsHandler from './chronicles/elevenlabs';

const app = express();

app.use(express.json());
app.use(timeout('60s'));
app.use(
	cors({
		origin: '*',
		optionsSuccessStatus: 200,
	}),
);

app.set('port', process.env.PORT);

app.get('/', (req: Request, res: Response) => {
	res.send('Hello');
});

app.post('/chat', chatHandler);
app.post('/list-indexes', listIndexesHandler);

// Chronicles
app.post('/chronicles/prompt', promptHandler);
app.get('/chronicles/character', characterHandler);
app.post('/chronicles/image', imageGenerationHandler);
app.post('/chronicles/synthesize', synthesizeHandler);
app.post('/chronicles/livechat', youTubeChatHandler);
app.post('/chronicles/intro', introHandler);
app.get('/chronicles/outro', outroHandler);
app.post('/chronicles/elevenlabs', elevenlabsHandler);

app.listen(app.get('port'), () => {
	console.log(`Server is running on port ${app.get('port')}`);
});
