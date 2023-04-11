let user1Video = document.getElementById('user-1');
let user2Video = document.getElementById('user-2');
let peerConnection;
let localStream;
let remoteStream;

init()

async function init(){
    peerConnection = new RTCPeerConnection()
    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    remoteStream = new MediaStream()
    user1Video.srcObject = localStream
    user2Video.srcObject = remoteStream

    localStream.getTracks().forEach((track) => {
        console.log('getTracks track', track);
        peerConnection.addTrack(track, localStream);
    });

    
    // remoteStream event listener 
    peerConnection.ontrack = (event) => {
        console.log('ontrack event', event);
        event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
        });
    };
}

let createOfferButton = document.getElementById('create-offer');
createOfferButton.addEventListener('click', createOffer)

let offerSDPTextArea = document.getElementById('offer-sdp');

async function createOffer(){
    createOfferButton.style.background = "red";
    createOfferButton.style.color = "white";

    peerConnection.onicecandidate = async (event) => {
        console.log('createOffer: onicecandidate event', event);
        //Event that fires off when a new offer ICE candidate is created
        if(event.candidate){
            offerSDPTextArea.value = JSON.stringify(peerConnection.localDescription)
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('Offer', offer);
}

let createAnswerButton = document.getElementById('create-answer');
createAnswerButton.addEventListener('click', createAnswer)

let answerSDPTextArea = document.getElementById('answer-sdp');

async function createAnswer(){
    createAnswerButton.style.background = "red";
    createAnswerButton.style.color = "white";
    let offer = JSON.parse(offerSDPTextArea.value)

    peerConnection.onicecandidate = async (event) => {
        console.log('createAnswer: onicecandidate event', event);
        //Event that fires off when a new answer ICE candidate is created
        if(event.candidate){
            console.log('Adding answer candidate...:', event.candidate)
            answerSDPTextArea.value = JSON.stringify(peerConnection.localDescription)
        }
    };

    await peerConnection.setRemoteDescription(offer);
    console.log('Offer', offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer); 
}

let addAnswerButton = document.getElementById('add-answer');

addAnswerButton.addEventListener('click', addAnswer)

async function addAnswer(){
    addAnswerButton.style.background = "red";
    addAnswerButton.style.color = "white";
    console.log('Add answer triggerd')
    let answer = JSON.parse(answerSDPTextArea.value)
    if (!peerConnection.currentRemoteDescription){
        peerConnection.setRemoteDescription(answer);
    }
    console.log('answer:', answer)
}
