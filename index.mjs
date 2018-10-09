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
function input(viewer,{data})
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
	constructor(state={})
	{
		super(state)
		// let renderer=x=>x
		// this.state=truth(logic(state),(...args)=>renderer(args))
		// renderer=v.render(this.shadowRoot,this,output)
		this.shadowRoot.innerHTML=`<style>${config.css}</style><div id=youtube-player></div>`
		this.player=null
		this.state=youtube.logic(state)
	}
	connectedCallback()//@todo find a less hackish way to do this
	{
		const
		viewer=this,
		iframe=this.shadowRoot.querySelector('#youtube-player')
		this.player=new util.yt.Player(iframe,
		{
			height:'390',
			width:'640',
			videoId:viewer.state.video_id,
			events:
			{
				'onReady':({target})=>output.render(this),
				'onStateChange':evt=>input(viewer,evt)
			}
		})
	}
}
Object.assign(youtube,silo)