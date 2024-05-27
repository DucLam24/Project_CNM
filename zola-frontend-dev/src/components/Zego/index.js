import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { GlobalContext } from '#/contexts/GlobalContext';
import { get, post } from '#/axios';

function randomID(len) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

function getUrlParams(url = window.location.href) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

export default function Zego() {
  const { user } = useContext(GlobalContext);
  const [conversationId, setConversationId] = useState("");
  const [conversation, setConversation] = useState({});
  const [callInitiated, setCallInitiated] = useState(false);

  useEffect(() => {
    getConversation();
  }, [conversationId])

  const getConversationId = () => {
    const href = window.location.href;
    const lastSlashIndex = href.lastIndexOf("/");
    const slug = href.substring(lastSlashIndex + 1);
    return slug;
  }

  const getConversation = async () => {
    try {
      let id = getConversationId();
      setConversationId(id);
      if (id) {
        const response = await get(`/conversations/${id}`);
        if (response.status === 200) {
          setConversation(response.data);
          return response.data;
        }
      }
    } catch (error) { }
  };

  const checkInRoom = (conversation, userId) => {
    if (!conversation || !conversation.participants || !Array.isArray(conversation.participants)) {
      return false;
    }
    for (let participant of conversation.participants) {
      if (participant.id === userId) {
        return true;
      }
    }
    return false;
  }

  const myMeeting = useCallback(async (element) => {
    if (!callInitiated && checkInRoom(conversation, user?.id)) {
      setCallInitiated(true);
      const roomID = getUrlParams().get('roomID') || randomID(5);
      const appID = 49365051;
      const serverSecret = "352f68b05ab78fd52fa2db0cce0b4bb7";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), randomID(5));

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      const urlGroup = window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID;

      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Share Call',
            url: urlGroup,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
      });

      const message = urlGroup;
      const urlParams = getUrlParams();
      const currentRoomID = urlParams.get('roomID');
      if (checkInRoom(conversation, user?.id) && currentRoomID !== roomID && checkInRoom(conversation, user?.id)) {
        await post(`/conversations/${conversationId}/startVideoCall`, {
          content: message,
        });
      }
    }
  }, [callInitiated, user, conversation]);

  return (
    <>
      {checkInRoom(conversation, user?.id) ?
        (
          <div
            className="myCallContainer"
            ref={myMeeting}
            style={{ width: '100vw', height: '90vh' }}
          ></div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <div>
                <h1 style={{ color: 'black', fontSize: '30px' }}>You are not in this conversation</h1>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px' }}>
                  <button
                    onClick={() => window.location.href = "/"}
                    style={{ backgroundColor: '#0070f3', color: 'black', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
