import silo from './output.mjs'
const
{config,logic,output,util}=silo,
{truth,v}=util
//-1 – unstarted
// 0 – ended
// 1 – playing
// 2 – paused
// 3 – buffering
// 5 – video queued
function input({data},viewer)
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
export default async function youtube(url='/node_modules/youtube-player/')
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
}
youtube.player=class extends silo.viewer
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
			onReady:({target})=>output.render(this),
			onStateChange:evt=>input(evt,this)
		},
		opts={events,height,videoId,width}

		this.player=new util.yt.Player(shadowRoot.querySelector('#player'),opts)
	}
}
Object.assign(youtube,silo)