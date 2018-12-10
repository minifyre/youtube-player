import silo from './util.mjs'
const
{config,input,logic,util}=silo,
{v}=util,
output=function(player)
{
	const {height,width}=player.state.view
	//generate v-based dom here
	return [v('style',{},config.css),
		v('div',{height,id:'player',width})
	]
}
//@todo put into silo-template
	// & change silo-template to assign silo.output.props to new output fn
output.event=(el,type,evt)=>el.dispatchEvent(new CustomEvent(type,evt))
output.render=function({player,state})
{
	const {paused,time,video_id}=state.file
	player.loadVideoById(video_id,time)
	if(paused) player.pauseVideo()
}
export default Object.assign(silo,{output})