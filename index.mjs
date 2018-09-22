import util from './util.mjs'
const
config={},
output={}

config.api='https://www.youtube.com/iframe_api'
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
youtube.player=class extends HTMLElement
{
	constructor()
	{
		super()
		const shadow=this.attachShadow({mode:'open'})
		shadow.innerHTML=config.dom
		this.player=null
		this.state=//@todo wrap in config
		{
			time:0,
			video_id:'PUv66718DII'
		}
	}
	connectedCallback()
	{
		const iframe=this.shadowRoot.querySelector('#youtube-player')
		document.body.append(iframe)
		this.player=output.player(iframe)
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