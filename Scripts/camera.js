let cameraF1;
let cameraF2;
let cameraF3;
let cameraF4;
const videoFeed = [];

document.addEventListener('DOMContentLoaded', (event) => {
    cameraF1 = document.getElementById('Camera1');
    cameraF2 = document.getElementById('Camera2');
    cameraF3 = document.getElementById('Camera3');
    cameraF4 = document.getElementById('Camera4');

    connectCameraInfo();
});

const cleanUp =(whichCamera) =>{
    try {
        const stream = whichCamera.srcObject;
        if(stream){
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
    } catch (error){
        console.error(error);
    }
}

//Connecting the cameras: The navigator basically checks the devices
//that are connected with your system and then connects

const connectCameraInfo = async () => {
    await navigator.mediaDevices.enumerateDevices().then(results => {
        results.forEach(result => {
            if (result.kind === 'videoinput'){
                console.log(result);
                videoFeed.push(result);
            }
        });
    }).catch(error => {
        console.log(error);
    });
}

//This allows you to start streaming your feed, also contains a message
//to help debug if the feed is not available
const startCamera = async (videoFeed, camera) => {
    if (videoFeed === undefined) {
        console.log('Feed is currently undefined/not available');
        return;
    }
    //Setting up the frame of the feed
    await navigator.mediaDevices.getUserMedia({
        video: {
            width: 400,
            height: 200,
            deviceId: videoFeed.deviceId
        }
    }).then(stream => {
        camera.srcObject = stream;
        camera.play();
    }).catch(error => {
        console.log(error);
    });
}
//Connects with your html button elements and sets up the script to run
//the camera feed code
const startView = (button) => {
    const id = button.id;
    switch (id){
        case 'openCamera1':
            cleanUp(cameraF1);
            startCamera(videoFeed[0], cameraF1);
            break;
        case 'openCamera2':
            cleanUp(cameraF2);
            startCamera(videoFeed[1], cameraF2);
            break;
        case 'openCamera3':
            cleanUp(cameraF3);
            startCamera(videoFeed[2], cameraF3);
            break;
        case 'openCamera4':
            cleanUp(cameraF4);
            startCamera(videoFeed[3], cameraF4);
            break;

    }
}
