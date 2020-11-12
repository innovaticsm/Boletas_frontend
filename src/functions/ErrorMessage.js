import { Dialog, Loading } from 'quasar'
export function ShowDialog(Title, Message) {
    Loading.hide()
    Dialog.create({
        title: Title,
        message: Message,
        html: true,
        persistent: true
    })
}