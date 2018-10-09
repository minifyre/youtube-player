import silo from './output.mjs'
const
{config,logic,output,util}=silo,
{truth,v}=util
//-1 – unstarted
// 0 – ended
// 1 – playing
// 2 – paused
// 3 – buffering
// 5 – video cued
function input({data},viewer)
{//@todo move into different file & put intput into import statement here
	const
	{player}=viewer,
	time=player.getCurrentTime()
	console.log(player.getVideoData())
	viewer.state.pause=data===util.yt.PlayerState.PAUSED
	viewer.state.video_id=player.getVideoData().video_id,
	viewer.state.time=time
	console.log(viewer.state)
	output.event(viewer,'pause',{time})//@todo handle non-pause events
}
export default async function youtube(url='/node_modules/youtube-viewer/')
{
	const {error}=await new Promise(async function(res,rej)
	{
		window.onYouTubeIframeAPIReady=()=>res({})
		const {error}=await util.loadScript(config.api)
		if(error) rej({error})
	})
	if(error) return {error}
	util.yt=window.YT
	//@todo rename youtube-viewer to youtube-player
	await silo(url,'youtube-viewer',youtube.player)
}
youtube.player=class extends silo.viewer
{
	constructor(opts={})
	{
		const state=truth(logic(opts))
		super(opts)
		let renderer=x=>x
		this.state=state//,(...args)=>renderer(args))
		renderer=v.render(this.shadowRoot,this,output)
		this.player=null
		this.state=youtube.logic(state)
	}
	connectedCallback()
	{
		const
		{shadowRoot,state}=this,
		{height,video_id:videoId,width}=state,
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