import { Update, receiveUpdates, sendableUpdates, collab, getSyncedVersion } from "@codemirror/collab"
import { basicSetup } from "codemirror"
import { ChangeSet, EditorState, Text } from "@codemirror/state"
import { EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view"

type updatesType = Array<{
    version: number,
    update: ReturnType<typeof sendableUpdates>
}>

export function pack(target: [], callback?: (arr: any) => void) {
    return new Proxy(target, {
        set(target, key: string, value: any) {
            if (key !== 'length') {
                callback && callback(value)
            }

            const result = Reflect.set(target, key, value)
            return result
        }
    })
}

export function setListener(updates: updatesType, cb:(v:EditorView) => void) {
    const extension = ViewPlugin.fromClass(class {
        constructor(private view: EditorView) {
            this.pull()
        }
        update(update: ViewUpdate) {
            if (update.docChanged) {
                this.push()
            }
        }
        push() {
            const update = sendableUpdates(this.view.state)
            const version = getSyncedVersion(this.view.state)
            updates.push({
                version,
                update
            })
        }

        pull() {
            // const version = getSyncedVersion(this.view.state)
            // 远程获取改变
            cb(this.view)
            // while (1) {
            //     const updates = await cb(version)

            //     let update: readonly Update[] = updates.map(el => {
            //         return {
            //             changes: el.changes.toJSON(),
            //             clientID: el.clientID
            //         }
            //     })
            //     this.view.dispatch(receiveUpdates(this.view.state, update))
            // }




        }

    })

    return extension
}





