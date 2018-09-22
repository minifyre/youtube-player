import config from './config.mjs'
import util from './util.mjs'
const output={}
output.event=(el,type,evt)=>el.dispatchEvent(new CustomEvent(type,evt))
output.render=function({player,state})
{
	const {paused,time,video_id}=state
	player.loadVideoById(video_id,time)
	if(paused) player.pauseVideo()
}
export {config,output,util}