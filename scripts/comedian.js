/**
 * The Comedian Module
 * Gives the companion the ability make jokes, memes, silly words, or animated gifs
 */

function _handleJokeSkill(keywords) {
    const context = {
        humorApiFunction:'jokes/random',
        humorApiQueryString: `exclude-tags=nsfw,dark,racist,jewish,sexual&include-tags=${keywords.value}`
    }
    window.models_generic.SetCurrentModel('comedian:humorapi')
    window.models_generic.ApplyContextObject(context);
    window.models_generic.CallCurrentModel();
}

function _handleMemeSkill(keywords) {
    const context = {
        humorApiFunction:'memes/random',
        humorApiQueryString: `media-type=image&keywords=${keywords.value}`
    }
    window.models_generic.SetCurrentModel('comedian:humorapi')
    window.models_generic.ApplyContextObject(context);
    window.models_generic.CallCurrentModel();
}

function _handleApiResponse(response) {
    const responseObj = JSON.parse(response);
    const name = window.companion.GetCharacterAttribute('name');
    if (responseObj.url) {
        //Is a meme
        window.companion.SendMessage({ type: "WEB_IMAGE", user: name, value: responseObj.url, timestamp: Date.now(), alt: responseObj.description});
    } else {
        //Is a joke
        const joke = JSON.parse(response).joke.replace(/\\/g, '');
        window.hooks.emit('moemate_core:handle_skill_text', {name: name, value: joke});
    }
}

export function init() {
    window.hooks.on('comedian:handle_joke_skill', _handleJokeSkill)
    window.hooks.on('comedian:handle_meme_skill', _handleMemeSkill)
    window.hooks.on('models:response:comedian:humorapi', _handleApiResponse)
}