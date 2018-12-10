import silo from './node_modules/pane-viewer/index.mjs'
const {config}=silo
config.api='https://www.youtube.com/iframe_api'
config.state=
{
	file:
	{
		paused:true,
		time:6,
		video_id:'PUv66718DII'
	},
	view:
	{
		height:390,
		type:'youtube-player',
		width:640
	}
}
export default silo