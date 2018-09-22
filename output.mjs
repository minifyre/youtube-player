import config from './config.mjs'
import util from './util.mjs'
const output={}
output.event=(el,type,evt)=>el.dispatchEvent(new CustomEvent(type,evt))
output.player=function(el)
{
	return new util.yt.Player(el,
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
output.render=function({player,state})
{
	const {time,video_id}=state
	player.loadVideoById(video_id,time)
	player.pauseVideo()
}
export {config,output,util}