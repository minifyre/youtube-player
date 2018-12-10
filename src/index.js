import silo from './node_modules/silo/index.js'
import truth from './node_modules/truth/truth.mjs'
import v from './node_modules/v/v.mjs'

const {config,util,logic,output,input}=silo

//-1 – unstarted
// 0 – ended
// 1 – playing
// 2 – paused
// 3 – buffering
// 5 – video queued
input.stateChange=function({data},viewer)
{//@todo move into different file & put intput into import statement here
	const
	{player}=viewer,
	time=player.getCurrentTime()
	console.log(player.getVideoData())
	viewer.state.file.pause=data===util.yt.PlayerState.PAUSED
	viewer.state.file.video_id=player.getVideoData().video_id,
	viewer.state.file.time=time
	output.event(viewer,'pause',{time})//@todo handle non-pause events
}
export default silo(async function youtube(url='/node_modules/youtube-player/')
{
	const {error}=await new Promise(async function(res,rej)
	{
		window.onYouTubeIframeAPIReady=()=>res({})
		const {error}=await util.loadScript(config.api)
		if(error) rej({error})
	})
	if(error) return {error}
	util.yt=window.YT
	await util.mkCustomEl(url,'youtube-player',youtube.player)
})
youtube.player=class extends silo.customElement
{
	constructor(state={})
	{
		super(state,silo)
	}
	connectedCallback()
	{
		const
		{shadowRoot,state}=this,
		{height,width}=state.view,
		videoId=state.file.video_id,
		events=
		{
			onReady:({target})=>output.video(this),
			onStateChange:evt=>input.stateChange(evt,this)
		},
		opts={events,height,videoId,width}

		this.player=new util.yt.Player(shadowRoot.querySelector('#player'),opts)
	}
}