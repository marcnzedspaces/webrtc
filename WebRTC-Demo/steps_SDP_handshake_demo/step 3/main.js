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
let offerSDPTextArea = document.getElementById('offer-sdp');
createOfferButton.addEventListener('click', createOffer)

async function createOffer(){
    peerConnection.onicecandidate = async (event) => {
        console.log('createOffer: onicecandidate event', event);
        if(event.candidate){
            offerSDPTextArea.value = JSON.stringify(peerConnection.localDescription)
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('Offer', offer);
}