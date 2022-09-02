import { Update, receiveUpdates, sendableUpdates, collab, getSyncedVersion } from "@codemirror/collab"
import { basicSetup } from "codemirror"
import { ChangeSet, EditorState, Text } from "@codemirror/state"
import { EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view"
import { ref } from 'vue'

let View = init('a' as unknown as HTMLDivElement)

function init(dom: HTMLDivElement) {
    let view: EditorView | null = null;
    let state = EditorState.create({
        doc: '',
        extensions: [basicSetup,]
    })
    view = new EditorView({
        state,
        parent: dom
    })
    return view
}

function getVersion(roomId: string) {
    return {
        version: 0,
        doc: 'qqq'
    }
}





function getUpdates() {
    // updates => updates.map(u => ({
    //     changes: ChangeSet.fromJSON(u.changes),
    //     clientID: u.clientID
    //   }))
}


function insertRoom(roomId: string) {
    const { version, doc } = getVersion('001')
    const plugin1 = collab({ startVersion: version })

}


let plugin = ViewPlugin.fromClass(class {
    constructor(private view: EditorView) {

    }
    update(update: ViewUpdate) {
        if (update.docChanged) {
            this.push()
        }
    }
    push() {
        // {type, version, updates}
        const updates = sendableUpdates(View.state)
        const version = getSyncedVersion(View.state)
        // 推送给服务端 request

        if (sendableUpdates(View.state).length) {
            this.push()
        }
    }

    pull() {
        const version = getSyncedVersion(View.state)
        const updates = getUpdates()
        View.dispatch(receiveUpdates(View.state, updates))
    }
})
