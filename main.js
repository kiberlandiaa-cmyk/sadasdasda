const btn = document.querySelector(".btn")
const input = document.querySelector(".input")
const messagesDiv = document.querySelector(".messages")


const socket = new WebSocket("ws://localhost:3000")
socket.onopen = ()=>{
    console.log("connection success")
}

btn.addEventListener("click", ()=>{
    const message = input.value
    socket.send(message)
})

messagesDiv.addEventListener("click", (e)=>{
    if (!e.target.id){ 
        return
    }
    socket.send(JSON.stringify({ type: "delete", div: e.target.id }))
})
 
socket.onmessage = (e)=>{
    let data = null
    try { data = JSON.parse(e.data) } 
    catch { data = null }

    if (data && data.type == "delete") {
        document.getElementById(data.div).remove()
        return
    }

    if (data && data.type == "message") {
        messagesDiv.insertAdjacentHTML("beforeend", `<div class="msg" id="${data.id}">${data.text}</div>`)
        return
    }
}
