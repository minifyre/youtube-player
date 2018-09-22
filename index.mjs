document.body.append
(
	Object.assign
	(
		document.createElement('script'),
		{src:'https://www.youtube.com/iframe_api'}
	)
)
let player
function onYouTubeIframeAPIReady()
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