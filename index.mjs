import {config,output,util} from './output.mjs'
const input={}
input.state=function(viewer)
{
	viewer.state.video_id=viewer.player.getVideoData().video_id,
	viewer.state.time=viewer.player.getCurrentTime()
	output.event(viewer,'pause',{time:viewer.time})
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
	const
	importFile=path=>fetch(path).then(x=>x.text()),
	files=['css','html'].map(ext=>url+'index.'+ext),
	[css,html]=await Promise.all(files.map(importFile))
	config.dom=`<style>${css}</style>${html}`
	customElements.define('youtube-player',youtube.player)
}
youtube.player=class extends HTMLElement
{
	constructor()
	{
		super()
		const shadow=this.attachShadow({mode:'open'})
		shadow.innerHTML=config.dom
		this.player=null
		this.state=Object.assign({},config.state)
	}
	connectedCallback()//@todo find a less hackish way to do this
	{
		const
		viewer=this,
		iframe=this.shadowRoot.querySelector('#youtube-player')
		document.body.append(iframe)//moved outside shadow dom to initalize
		this.player=new util.yt.Player(iframe,
		{
			height:'390',
			width:'640',
			videoId:viewer.state.video_id,
			events:
			{
				'onReady':({target})=>output.render(this),
				'onStateChange':function(evt)
				{
					console.log(evt)
					//if (data==YT.PlayerState.PLAYING) 'do something'
				}
			}
		})
		//@todo use this.player.a instead of query selector?
		this.shadowRoot.append(document.querySelector('#youtube-player'))
	}
	adoptedCallback()
	{
		console.error('add adoptedCallback behavior')
	}
	disconnectedCallback()
	{
		console.error('add disconnectedCallback behavior')
	}
}