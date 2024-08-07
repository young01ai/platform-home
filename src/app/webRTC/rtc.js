
import AgoraRTC from "agora-rtc-sdk-ng"

import { message } from 'antd'

import {
    quit_channel,
    muteVoice,
    unmuteVoice
  } from '@/api/voice'

function uint8ArrayToString(uint8Array) {
    // 创建一个TextDecoder实例，指定编码为UTF-8
    const decoder = new TextDecoder('utf-8')

    // 使用TextDecoder将Uint8Array解码为字符串
    const string = decoder.decode(uint8Array)

    return string//返回转换后的字符串
}

let rtc = {
    localAudioTrack: null,
    client: null,
    remoteAudioTrack: null,
}

let options = {
    // Pass your App ID here.
    appId: "",
    // Set the channel name.
    channel: "",
    // Pass your temp token here.
    token: "",
    // Set the user ID.
    uid: -1,
    index: 0
}


export const joinSession = async function (setMic) {
    // Join an RTC channel.
    await rtc.client.join(options.appId, options.channel, options.token, options.uid)
    // Create a local audio track from the audio sampled by a microphone.
    await createMic(setMic)

    // console.log("publish success!", rtc.localAudioTrack)
    message.success('join success')
}


export const createMic = async function (setMic) {
    return AgoraRTC.createMicrophoneAudioTrack().then((track) => {
        rtc.localAudioTrack = track
        console.log("createMicrophoneAudioTrack success!", rtc.localAudioTrack)
        // Publish the local audio tracks to the RTC channel.
        rtc.client.publish([rtc.localAudioTrack])
        setMic(true)
    }).catch(err => {
        console.error('createMicrophoneAudioTrack', err)
        setMic(false)
    })
}



export const leaveSession = async function () {
    rtc.localAudioTrack?.close()
    quit_channel({
        channel_id: options.channel,
        client_user_id: options.uid,
        index: options.index
    })

    // Leave the channel.
    await rtc.client.leave()
    console.log("leave success!")
}

export const mutedAudio = async function (flag) {
    if(rtc.localAudioTrack?.setMuted){
        rtc.localAudioTrack?.setMuted(flag)
        if (flag) {
            muteVoice({
                channel_id: options.channel,
                client_user_id: options.uid,
                index: options.index
            })
        } else {
            unmuteVoice({
                channel_id: options.channel,
                client_user_id: options.uid,
                index: options.index
            })
        }
    }
    
}


export async function startBasicCall({
    setRtcState,
    // setVolume,
    config,
    setMic,
    appendListById
}) {
    options.appId = config.app_id
    options.channel = config.channel_id
    options.token = config.token
    options.uid = config.client_user_id
    options.index = config.index

    // Create an AgoraRTCClient object.
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
    rtc.client.enableAudioVolumeIndicator()

    rtc.client.on('stream-message', function (uid, data) {
        const rt = JSON.parse(uint8ArrayToString(data))
        console.log('stream-message', uid, rt)
        appendListById(rt)
    })

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    rtc.client.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event
        await rtc.client.subscribe(user, mediaType)
        console.log("subscribe success", user, mediaType)

        // If the remote user publishes an audio track.
        if (mediaType === "audio") {
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            rtc.remoteAudioTrack = user.audioTrack
            // Play the remote audio track.
            rtc.remoteAudioTrack.play()
        }
    })
    // Listen for the "user-unpublished" event
    rtc.client.on("user-unpublished", async (user) => {
        // Unsubscribe from the tracks of the remote user.
        rtc.client.unsubscribe(user)
        leaveSession()
    })

    rtc.client.on("volume-indicator", function (result) {
        result.forEach(function (volume, index) {
            console.log(`${index} UID ${volume.uid} Level ${volume.level}`)
            if (volume.uid === options.uid) {
                // setVolume(volume.level)
            }
        })
    })
    rtc.client.on("connection-state-change", function (result) {
        console.log("connection-state-change", result)
        setRtcState(result)
        if(result === 'CONNECTED'){
            message.success('CONNECTED')
        } else if(result === 'DISCONNECTED'){
            message.error('DISCONNECTED')
        }  else if(result === 'CONNECTING'){
            // message.error('CONNECTING')
        }  else if(result === 'RECONNECTING'){
            // message.error('RECONNECTING')
        }
    })

    joinSession(setMic).then(res => {
        mutedAudio(true)
    })
}

