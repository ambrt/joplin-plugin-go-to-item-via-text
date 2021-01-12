module.exports = {
	default: function(context) { 
		return {
			plugin: function(CodeMirror) {
				/*
				CodeMirror.hint.javascript = function (editor) {
					//search here
					//var list = await context.postMessage('messageFromCodeMirrorContentScript');
					var list = [{ text: '[#asdf](:/#asdf)', displayText: 'asdf' },{ text: '[#asdf22](:/#asdf222)', displayText: 'asdf22222222' }]


					var cursor = editor.getCursor();
					var currentLine = editor.getLine(cursor.line);
					var start = cursor.ch;
					var end = start;
					while (end < currentLine.length && /[\w$]+/.test(currentLine.charAt(end))) ++end;
					while (start && /[\w$]+/.test(currentLine.charAt(start - 1))) --start;
					var curWord = start != end && currentLine.slice(start, end);
					var regex = new RegExp('^' + curWord, 'i');
					let type = curWord.substr(0,1)
					console.log("type")
					console.log(linkType)
					
			
					var result = {
						list: (!curWord ? list : list.filter(function (item) {
							return item.displayText.match(regex);
						})).sort(),
						from: CodeMirror.Pos(cursor.line, start-1),
						to: CodeMirror.Pos(cursor.line, end)
					};
			
					return result;
				};
*/

				/*var orig = CodeMirror.hint.javascript;
				CodeMirror.hint.javascript = function(cm) {
				  var inner = orig(cm) || {from: cm.getCursor(), to: cm.getCursor(), list: []};
				  inner.list.push("bozo");
				  return inner;
				};
				*/
				CodeMirror.commands.autocomplete = function(cm) {
					CodeMirror.showHint(cm, CodeMirror.hint.javascript);
				};
				CodeMirror.defineOption('inlineTags', [], function(cm, value, prev) {
					console.info('Registering CM Plugin');
			
					cm.on('inputRead', async function (cm1, change) {
						console.log("input received");
						
							if (change.text[0] === '#' || change.text[0]==="@") {
								//CodeMirror.commands.autocomplete(cm1, change.text[0]);
								
								//CodeMirror.showHint(cm1, CodeMirror.hint.javascript);
								let linkType = change.text[0];
							

							CodeMirror.showHint(cm1, function (editor) {
								
								
								var list = [{ text: '[#asdf](:/#asdf)', displayText: 'asdf' },{ text: '[#asdf22](:/#asdf222)', displayText: 'asdf22222222' }]
			
			
								var cursor = editor.getCursor();
								var currentLine = editor.getLine(cursor.line);
								var start = cursor.ch;
								var end = start;
								while (end < currentLine.length && /[\w$]+/.test(currentLine.charAt(end))) ++end;
								while (start && /[\w$]+/.test(currentLine.charAt(start - 1))) --start;
								var curWord = start != end && currentLine.slice(start, end);
								var regex = new RegExp('^' + curWord, 'i');
								
								console.log("type")
								console.log(linkType)
								console.log("word")
								console.log(curWord)
								/*
								const contentScriptId = context.contentScriptId
								var result = {
									list: await context.postMessage(contentScriptId,{type:linkType,curWord:curWord}),
									from: CodeMirror.Pos(cursor.line, start-1),
									to: CodeMirror.Pos(cursor.line, end)
								};
								*/
						
								var result = {
									list: (!curWord ? list : list.filter(function (item) {
										return item.displayText.match(regex);
									})).sort(),
									from: CodeMirror.Pos(cursor.line, start-1),
									to: CodeMirror.Pos(cursor.line, end)
								};
						
								return result;
							});
						
			
						}


					  console.info('contentScriptCodeMirror.js: Sending message...2');
  
  


							//const response = await context.postMessage('messageFromCodeMirrorContentScript');
							//console.info('contentScriptCodeMirror.js: Got response', response);
						
					})
				});
			},
			codeMirrorResources: ['addon/hint/show-hint','addon/hint/javascript-hint','addon/selection/active-line'],
			assets: function() {
				return [
					{ name:'./show-hint.css' }
					// { inline: true,
						// text: '.cm-matchhighlight {	background-color: lightgreen;}',
						// mime: 'text/css',
					// }
				];
			},
		}
	},
}