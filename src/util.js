util.loadScript=function(src)//for old timey scripts that pollute global scope
{
	return new Promise(function(res,rej)
	{
		document.head.appendChild(Object.assign
		(
			document.createElement('script'),
			{
				onerror:err=>rej({err}),
				onload:data=>res({data}),
				src
			}
		))
	})
}