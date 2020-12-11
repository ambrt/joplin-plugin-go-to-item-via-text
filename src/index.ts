import joplin from 'api';
import { MenuItemLocation, ToolbarButtonLocation } from 'api/types';


function escapeTitleText(text: string) {
	return text.replace(/(\[|\])/g, '\\$1');
}

joplin.plugins.register({
	onStart: async function () {
		await joplin.commands.register({
			name: 'goToItemViaText',
			label: 'Go to note via highlighted text',
			iconName: 'fas fa-anchor',
			execute: async () => {
				//Get selected text
				const selectedText = (await joplin.commands.execute('selectedText') as string);

				try {
					let first = selectedText.substr(0,1);
					if(first == "#"){
						let tagId =''
						let page = 1
						let tags
						console.info(tags);
						let has_more = true
						while(has_more){
						tags = await joplin.data.get(['tags'], {page:page});
						tags.items.forEach(element => {
							console.log(element)
							if (element.title==selectedText.substr(1)){
								console.log('open '+element.id)
								tagId = element.id
							}
						});
						if(tags.has_more) {page=page+1} else {has_more=false}
						
					}
							
							
						await joplin.commands.execute('openTag',tagId);		
						
						
					}
					else if(first =="@"){
						let folderId =''
						let page = 1
						let folders
						
						let has_more = true
						while(has_more){
						folders = await joplin.data.get(['folders'], {page:page});
						folders.items.forEach(element => {
							console.log(element)
							if (element.title==selectedText.substr(1)){
								console.log('open '+element.id)
								folderId = element.id
							}
						});
						if(folders.has_more) {page=page+1} else {has_more=false}
						
					}
						
					console.info(folders);
					await joplin.commands.execute('openFolder',folderId);		
						
						
					}
					else{
						await joplin.commands.execute('openNote',selectedText);
					}
				
				}
				catch(err)
				{	
					console.log(err)
					let dialog = await joplin.views.dialogs.create('wrongText')					
					await joplin.views.dialogs.setHtml(dialog, "Seems like text is not an exact id,tag or folder<br>Or other error occured");
					await joplin.views.dialogs.setButtons(dialog,[{id:"ok"}]);
					await joplin.views.dialogs.open(dialog);
				}
				

			}
		})
		await joplin.views.menuItems.create('goToViaTextMenuItem', 'goToItemViaText', MenuItemLocation.EditorContextMenu);
		await joplin.views.toolbarButtons.create('Go to item via text', 'goToItemViaText',ToolbarButtonLocation.EditorToolbar);
		
	}

});

