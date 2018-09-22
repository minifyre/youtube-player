import util from './util.mjs'
window.onload=async function()
{
	let player
	window.onYouTubeIframeAPIReady=function()
	{
		player=new YT.Player(document.querySelector('#player'),
		{
			height:'390',
			width:'640',
			videoId:'PUv66718DII',
			events:
			{
				'onReady':function(event)
				{
					event.target.playVideo()
				},
				'onStateChange':function({data})
				{
					if (data==YT.PlayerState.PLAYING) 'do something'
				}
			}
		})
	}
	util.loadScript('https://www.youtube.com/iframe_api')
}