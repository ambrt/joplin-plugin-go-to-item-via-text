import joplin from 'api';
import { MenuItemLocation, ToolbarButtonLocation, ContentScriptType } from 'api/types';


function escapeTitleText(text: string) {
	return text.replace(/(\[|\])/g, '\\$1');
}

joplin.plugins.register({
	onStart: async function () {
		async function findTag(tagName) {
			console.log(tagName)
			let tagId = ''
			let page = 1
			let tags
			let has_more = true
			while (has_more) {
				tags = await joplin.data.get(['tags'], { page: page });

				for (let i = 0; i < tags.items.length; i++) {
					let element = tags.items[i]
					console.log(element)
					if (element.title == tagName) {
						console.log('open ' + element.id)
						tagId = element.id
						return tagId
					}
				}
				/*tags.items.forEach(element => {
					console.log(element)
					if (element.title==tagName){
						console.log('open '+element.id)
						tagId = element.id
						return tagId
					}
				});
				*/
				if (tags.has_more) { page = page + 1 } else { has_more = false }

			}

		}
		async function findNotebook(notebookName) {
			let notebookId = ''
			let page = 1
			let folders

			let has_more = true
			while (has_more) {
				folders = await joplin.data.get(['folders'], { page: page });


				for (let i = 0; i < folders.items.length; i++) {
					let element = folders.items[i]
					console.log(element)
					if (element.title == notebookName) {
						console.log('open ' + element.id)
						notebookId = element.id
						return notebookId
					}
				} if (folders.has_more) { page = page + 1 } else { has_more = false }

			}
		}
		await joplin.commands.register({
			name: 'goToItemViaText',
			label: 'Go to item via highlighted text ',
			iconName: 'fas fa-anchor',
			execute: async () => {
				//Get selected text
				const selectedText = (await joplin.commands.execute('selectedText') as string);

				try {
					let first = selectedText.substr(0, 1);
					if (first == "#") {

						let tagId = await findTag(selectedText.substr(1))

						await joplin.commands.execute('openTag', tagId);

					}
					else if (first == "@") {

						let folderId = await findNotebook(selectedText.substr(1))
						//console.info(folders);
						await joplin.commands.execute('openFolder', folderId);


					}
					else {
						await joplin.commands.execute('openNote', selectedText);
					}

				}
				catch (err) {
					console.log(err)
					let dialog = await joplin.views.dialogs.create('wrongText')
					await joplin.views.dialogs.setHtml(dialog, "Seems like text is not an exact id,tag or folder<br>Or other error occured");
					await joplin.views.dialogs.setButtons(dialog, [{ id: "ok" }]);
					await joplin.views.dialogs.open(dialog);
				}


			}
		})

		await joplin.commands.register({
			name: 'convertTextToItem',
			label: 'Convert text to tag or notebook',
			iconName: 'fas fa-anchor',
			execute: async () => {
				//Get selected text
				
				const selectedText = (await joplin.commands.execute('selectedText') as string);
				
				

				try {
					let first = selectedText.substr(0, 1);
					if (first == "#") {

						let tagId = await findTag(selectedText.substr(1))

						await joplin.commands.execute('replaceSelection', `[${escapeTitleText(selectedText)}](:/#${tagId})`);

					}
					else if (first == "@") {

						let notebookId = await findNotebook(selectedText.substr(1))

						await joplin.commands.execute('replaceSelection', `[${escapeTitleText(selectedText)}](:/@${notebookId})`);


					}
					else {
						await joplin.commands.execute('openNote', selectedText);
					}

				}
				catch (err) {
					console.log(err)
					let dialog = await joplin.views.dialogs.create('wrongText')
					await joplin.views.dialogs.setHtml(dialog, "Seems like text is not an exact id,tag or folder<br>Or other error occured");
					await joplin.views.dialogs.setButtons(dialog, [{ id: "ok" }]);
					await joplin.views.dialogs.open(dialog);
				}


			}
		})

		await joplin.views.menuItems.create('goToViaTextMenuItem', 'goToItemViaText', MenuItemLocation.EditorContextMenu);
		await joplin.views.menuItems.create('convertTextToItemMenuItem', 'convertTextToItem', MenuItemLocation.EditorContextMenu);
		await joplin.views.toolbarButtons.create('Go to item via text', 'goToItemViaText', ToolbarButtonLocation.EditorToolbar);

		await joplin.commands.register({
			name: 'goToTag',
			label: 'Go to tag from render view',
			execute: async (...args) => {
				//alert('Going to tag' + JSON.stringify(args));
				await joplin.commands.execute('openTag', args[0]);
			},
		});
		await joplin.commands.register({
			name: 'goToNotebook',
			label: 'Got to notebook from render view',
			execute: async (...args) => {
				await joplin.commands.execute('openFolder', args[0]);
			},
		});
		await joplin.plugins.registerContentScript(
			ContentScriptType.MarkdownItPlugin,
			'tagsandnotebookaslinks',
			'./TagsAndNotebookAsLinks.js'
		);

	}

});

