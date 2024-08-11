import { getModels, resultExtractor } from './groqHandler.js';
import fetch from 'node-fetch';
import markdownit from 'markdown-it';

const md = markdownit({
	html: true,
	linkify: true,
	typographer: true
});

export const renderHandler = (req, res, next) => {
	const features = {
		title: 'Generative AI Showcase'
	}
	res.render('index', { features, form: true });
}

export const textgenerationHandler = async (req, res, next) => {
	const userInput = req.body.userInput;
	// Select Type is either "RAG" or "Non - RAG"
	const selectedType = req.body.selectedType;
	let promptArray;
	if (selectedType === "rag") {
		// Make a call to Rag Pipeline to retrieve context
		const url = `http://localhost:3001/get-context?question=${userInput}`;
		const apiCallResp = await fetch(url);
		const apiResponseContext = await apiCallResp.json();
		// example of prompt crafting based on context
		promptArray = [
			{
				role: "system",
				content: `You are an assistant that use this context for responding.
				Context: ${apiResponseContext.join('\n')}
	
				Respond to below input using above Context and Web Search Result
				Input: ${userInput} 
				If there is no context simply respond "I am not able to respond"
				`
			},
		];
	} else {
		// example of using basic chat
		promptArray = [
			{ role: "user", content: userInput },
		];
	}
	let result = await resultExtractor(promptArray);
	result = md.render(result);
	res.json({ response: result });
}


export const modelHandler = (req, res, next) => {
	const features = {
		title: 'Generative AI Models'
	}
	// Getting list of all models available in groq
	const result = getModels();
	result.then((models) => {
		const modelslist = models.data;
		res.render('index', { features, listmodels: true, modelslist });
	});
}
