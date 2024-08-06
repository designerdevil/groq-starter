import { getModels, resultExtractor } from './groqhandler.js';
import fs from 'fs';
import markdownit from 'markdown-it';

const md = markdownit({
	html: true,
	linkify: true,
	typographer: true
});


// function to encode file data to base64 encoded string
async function base64_encode(file) {
	// read binary data
	var bitmap = fs.readFileSync(file);
	// convert binary data to base64 encoded string
	return new Buffer.from(bitmap).toString('base64');
}

export const renderHandler = (req, res, next) => {
	const features = {
		title: 'Generative AI Showcase'
	}
	res.render('index', { features, form: true });
}

export const textgenerationHandler = async (req, res, next) => {
	const promptArray = [
		{ role: "user", content: req.body.userInput },
	];
	let result = await resultExtractor(promptArray);
	result = md.render(result);
	res.json({ response: result });
}

export const modelHandler = (req, res, next) => {
	const features = {
		title: 'Generative AI Models'
	}
	const result = getModels();
	result.then((models) => {
		const modelslist = models.data;
		res.render('index', { features, listmodels: true, modelslist });
	});
	
}
