"use strict";
// Types for Inbound/Outbound Call Services
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallEvents = void 0;
// ============= WebSocket Event Types =============
var CallEvents;
(function (CallEvents) {
    CallEvents["CALL_INCOMING"] = "call:incoming";
    CallEvents["CALL_STARTED"] = "call:started";
    CallEvents["CALL_ANSWERED"] = "call:answered";
    CallEvents["CALL_ENDED"] = "call:ended";
    CallEvents["CALL_FAILED"] = "call:failed";
    CallEvents["CALL_TRANSFERRED"] = "call:transferred";
    CallEvents["TRANSCRIPT_UPDATE"] = "transcript:update";
    CallEvents["QUEUE_UPDATE"] = "queue:update";
    CallEvents["CAMPAIGN_UPDATE"] = "campaign:update";
    CallEvents["CAMPAIGN_COMPLETED"] = "campaign:completed";
})(CallEvents || (exports.CallEvents = CallEvents = {}));
//# sourceMappingURL=calls.js.map