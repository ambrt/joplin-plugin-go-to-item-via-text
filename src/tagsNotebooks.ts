function plugin(markdownIt, _options) {
    var defaultRender = markdownIt.renderer.rules.link_open;
    const contentScriptId = _options.contentScriptId;
    //console.log(_options)
    markdownIt.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        var token = tokens[idx];
        console.log(token)
        console.info(token)
        let aIndex = token.attrIndex('href');
        console.log(aIndex)
        if(token.attrs[aIndex][1].substr(0,3)==":/#"){
            
            //token.attrs.push(['js', "webviewApi.executeCommand('testCommand', 'one', 'two'); return false;"]);
            let resourceIdAttr = '';
            let icon = '';
            let hrefAttr = '#';
            let mime = '';
            let resourceId = '';
            let resource = null;
            //let js = `onclick="webviewApi.executeCommand('goToTag', '${token.attrs[aIndex][1].substr(3)}'); return false;"`;
            let js = `webviewApi.postMessage('${contentScriptId}', {type:'tag', tagId:'${token.attrs[aIndex][1].substr(3)}'})`
            const attrHtml = [];
            attrHtml.push(`href='${hrefAttr}'`);
            if (js) attrHtml.push(js);
            
            let replacement={html:`<a ${attrHtml.join(' ')}>`,}

            _options.context.currentLinks.push({
                href: "#",
                resource: resource,
                resourceReady: true,
                resourceFullPath: null
            });
    
            return replacement.html;
            
            
        }
        if(token.attrs[aIndex][1].substr(0,3)==":/@"){
            
            //token.attrs.push(['js', "webviewApi.executeCommand('testCommand', 'one', 'two'); return false;"]);
            let resourceIdAttr = '';
            let icon = '';
            let hrefAttr = '#';
            let mime = '';
            let resourceId = '';
            let resource = null;
            //let js = `onclick="webviewApi.executeCommand('goToNotebook', '${token.attrs[aIndex][1].substr(3)}'); return false;"`;
            let js = `webviewApi.postMessage('${contentScriptId}', {type:'folder', folderId:'${token.attrs[aIndex][1].substr(3)}'})`
            const attrHtml = [];
            attrHtml.push(`href='${hrefAttr}'`);
            if (js) attrHtml.push(js);
            
            let replacement={html:`<a ${attrHtml.join(' ')}>`,}

            _options.context.currentLinks.push({
                href: "#",
                resource: resource,
                resourceReady: true,
                resourceFullPath: null
            });
    
            return replacement.html;
            
            
        }


        //     return '<div class="embed-responsive embed-responsive-16by9">\n' +
        //            '  <iframe class="embed-responsive-item" src="//player.vimeo.com/video/' + id + '"></iframe>\n' +
        //            '</div>\n';
        //   }
        
        // if (vimeoRE.test(token.attrs[aIndex][1])) {
	
        //     var id = token.attrs[aIndex][1].match(vimeoRE)[2];
        
        //     return '<div class="embed-responsive embed-responsive-16by9">\n' +
        //            '  <iframe class="embed-responsive-item" src="//player.vimeo.com/video/' + id + '"></iframe>\n' +
        //            '</div>\n';
        //   }
        
        return defaultRender(tokens, idx, options, env, self);

    }

    // console.log('asdf')
    //     console.info('asdf')
	// const defaultRender = markdownIt.renderer.rules.fence || function(tokens, idx, options, env, self) {
	// 	return self.renderToken(tokens, idx, options, env, self);
	// };

	// markdownIt.renderer.rules.fence = function(tokens, idx, options, env, self) {
    //     const token = tokens[idx];
    //     console.log(token)
    //     console.info(token)
    //     // if (token.info !== 'justtesting') return defaultRender(tokens, idx, options, env, self);
        
	// 	return `
	// 		<div class="just-testing">
	// 			<p>JUST TESTING: ${token.content}</p>
	// 			<p><a href="#" onclick="webviewApi.executeCommand('testCommand', 'one', 'two'); return false;">Click to send "testCommand" to plugin</a></p>
	// 			<p><a href="#" onclick="webviewApi.executeCommand('testCommandNoArgs'); return false;">Click to send "testCommandNoArgs" to plugin</a></p>
	// 		</div>
	// 	`;
	// };
}

module.exports = {
	default: function(_context) { 
		return {
			plugin: plugin,
			
		}
	},
}