import React, { useEffect, useState, useContext, useCallback } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { GlobalContext } from '#/contexts/GlobalContext';
import { post } from '#/axios';

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

  const getConversationId = () => {
    const href = window.location.href;
    const lastSlashIndex = href.lastIndexOf("/");
    const slug = href.substring(lastSlashIndex + 1);
    return slug;
  }

  const myMeeting = useCallback(async (element) => {
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
    await post(`/conversations/${getConversationId()}/startVideoCall`, {
      content: message,
    });
  }, [getConversationId()]);

  return (
    <>

      <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ width: '100vw', height: '90vh' }}
      ></div>
    </>
  );
}
