const {Configuration, OpenAIApi} = require('openai');

const configuration = new Configuration({
    apiKey :process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);
const generateImage = async (req,res) => {
    const {prompt} = req.body;
    try{
        const response = await openai.createImage({
            prompt,
            n:1,
            size: '512x512',
            response_format: 'b64_json'
        })

        const image = response.data.data[0].b64_json;

        const imageUrl = response.data.data[0].url
        res.status(200).json({
            success : true,
            data : imageUrl,
        photo : image})
    }
    catch(error){
        if(error.response){
            console.log(error.response.status)
            console.log(error.response.data)
        }
        else{
            console.log(error.message)
        }
        res.status(400).json({
            success : false,
            error : 'the image could not generate'})

    }
}

module.exports = {generateImage}