import util from './util.mjs'
const config={}
config.api='https://www.youtube.com/iframe_api'
export default async function youtube()
{
	const {error}=await new Promise(async function(res,rej)
	{
		window.onYouTubeIframeAPIReady=()=>res({})
		const {error}= await util.loadScript(config.api)
		if(error) rej({error})
	})
	if(error) return {error}
	const player=new YT.Player(document.querySelector('#player'),
	{
		height:'390',
		width:'640',
		videoId:'PUv66718DII',
		events:
		{
			'onReady':function({target})
			{
				target.playVideo()
			},
			'onStateChange':function({data})
			{
				//if (data==YT.PlayerState.PLAYING) 'do something'
			}
		}
	})
}