import { Request, Response } from 'express';
import { google } from 'googleapis';

const youtube = google.youtube({
	version: 'v3',
	auth: process.env.YOUTUBE_API_KEY,
});

export default async function youTubeChatHandler(req: Request, res: Response) {
	try {
		const videoId = req.body.videoId;

		// Get Live Chat ID
		const response = await youtube.videos.list({
			id: [videoId],
			part: ['liveStreamingDetails'],
		});

		if (
			!response.data.items ||
			!response.data.items[0] ||
			!response.data.items[0].liveStreamingDetails
		) {
			throw new Error(JSON.stringify(response));
		}

		const liveChatId =
			response.data.items[0].liveStreamingDetails.activeLiveChatId || '';

		// Get chat messages
		const chatResponse = await youtube.liveChatMessages.list({
			liveChatId,
			part: ['snippet', 'authorDetails'],
		});

		const messages = chatResponse.data.items?.map((item: any) => {
			const formattedMessage = item.snippet.displayMessage
				.toLowerCase()
				.replace(/\s/g, '');

			const includesTaggedUser =
				formattedMessage.includes('@48chronicles') ||
				formattedMessage.includes('@48c');

			return {
				message: item.snippet.displayMessage,
				username: item.authorDetails.displayName,
				timestamp: item.snippet.publishedAt,
				includesTaggedUser,
			};
		});

		const currentTime = Date.now();

		const recentChats = messages?.filter((message: any) => {
			const messageTime = Date.parse(message.timestamp);
			return currentTime - messageTime <= 60000;
		});

		res.status(200).json({ messages: recentChats });
	} catch (error: any) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
}
