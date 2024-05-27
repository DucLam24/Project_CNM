var zegoCall = undefined;
function updateZego(zg) {
  try {
    zegoCall = zg;
    zg.setCallInvitationConfig({
      // The callee will receive the notification through this callback when receiving a call invitation.
      onIncomingCallReceived: (callID, caller, callType, callees) => {
        console.log(
          "Incoming call received",
          callID,
          caller,
          callType,
          callees
        );
      },

      // The callee will receive the notification through this callback when the caller canceled the call invitation.
      onIncomingCallCanceled: (callID, caller) => {
        console.log("Incoming call canceled", callID, caller);
      },

      // The caller will receive the notification through this callback when the callee accepts the call invitation.
      onOutgoingCallAccepted: (callID, callee) => {
        console.log("Outgoing call accepted", callID, callee);
      },

      // The caller will receive the notification through this callback when the callee is on a call.
      onOutgoingCallRejected: (callID, callee) => {
        console.log("Outgoing call rejected", callID, callee);
      },

      // The caller will receive the notification through this callback when the callee declines the call invitation.
      onOutgoingCallDeclined: (callID, callee) => {
        console.log("Outgoing call declined", callID, callee);
      },

      // The callee will receive the notification through this callback when he didn't respond to the call invitation.
      onIncomingCallTimeout: (callID, caller) => {
        console.log("Incoming call timeout", callID, caller);
      },

      // The caller will receive the notification through this callback when the call invitation timed out.
      onOutgoingCallTimeout: (callID, callees) => {
        console.log("Outgoing call timeout", callID, callees);
      },
    });
  } catch (error) {}
}

export { zegoCall, updateZego };
