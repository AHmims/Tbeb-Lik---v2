class client {
    constructor(clientId, clientName, clientTel, clientEmail, clientDispo, clientPass, clientDateCreation, clientDateTimeZone) {
        this.clientId = clientId;
        this.clientName = clientName;
        this.clientTel = clientTel;
        this.clientEmail = clientEmail;
        this.clientDispo = clientDispo;
        this.clientPass = clientPass;
        this.clientDateCreation = clientDateCreation;
        this.clientDateTimeZone = clientDateTimeZone;
    }
}
// 
class visitor {
    constructor(visitorId, visitorName, visitorEmail, visitorPass, visitorTel, visitorSexe) {
        this.visitorId = visitorId;
        this.visitorName = visitorName;
        this.visitorEmail = visitorEmail;
        this.visitorPass = visitorPass;
        this.visitorTel = visitorTel;
        this.visitorSexe = visitorSexe;
    }
}
// 
class attachment {
    constructor(attachmentName, attachmentSender, attachmentDateCreation, attachmentDateTimeZone, preConsId) {
        this.attachmentName = attachmentName;
        this.attachmentSender = attachmentSender;
        this.attachmentDateCreation = attachmentDateCreation;
        this.attachmentDateTimeZone = attachmentDateTimeZone;
        this.preConsId = preConsId;
    }
}
// 
class consultation {
    constructor(consulState, consulDate, consulTimeZone, consulComment, clientId, preConsId) {
        this.consulState = consulState;
        this.consulDate = consulDate;
        this.consulTimeZone = consulTimeZone;
        this.consulComment = consulComment;
        this.clientId = clientId;
        this.preConsId = preConsId;
    }
}
// 
class preConsultation {
    constructor(preConsId, preConsDateCreation, preConsDateTimeZone, preConsTitle, preConsDesc, preConsAccepted, visitorId) {
        this.preConsId = preConsId;
        this.preConsDateCreation = preConsDateCreation;
        this.preConsDateTimeZone = preConsDateTimeZone;
        this.preConsTitle = preConsTitle;
        this.preConsDesc = preConsDesc;
        this.preConsAccepted = preConsAccepted;
        this.visitorId = visitorId;
    }
}
// 
class room {
    constructor(roomId, roomVisitorId, roomClientId) {
        this.roomId = roomId;
        this.roomVisitorId = roomVisitorId;
        this.roomClientId = roomClientId;
    }
}
// 
class appUser {
    constructor(userId, userType, socket, online, linkToClient, roomId, companyId) {
        this.userId = userId;
        this.userType = userType;
        this.socket = socket;
        this.online = online;
        this.linkToClient = linkToClient;
        this.roomId = roomId;
        this.companyId = companyId;
    }
    // 
    getStatus() {
        return {
            userId: this.userId,
            online: this.online
        }
    }
}
// 
class message {
    constructor(msgSender, msgContent, roomId, msgDate, msgDateTimeZone, msgType, msgFilePath) {
        this.msgSender = msgSender;
        this.msgContent = msgContent;
        this.roomId = roomId; // CHANGE LINK FROM ROOM TO PRECONSultation
        this.msgDate = msgDate;
        this.msgDateTimeZone = msgDateTimeZone;
        this.msgType = msgType;
        this.msgFilePath = msgFilePath;
    }
}
// 
class clientInbox {
    constructor(preConsId, clientId) {
        this.preConsId = preConsId;
        this.clientId = clientId;
    }
}
// 
class companyExpertise {
    constructor(expertiseId, expertiseName) {
        this.expertiseId = expertiseId;
        this.expertiseName = expertiseName;
    }
}
// 
class appCompany {
    constructor(companyName, companyDesc, companyTel, companyEmail, companyFJ, companyAdrs, companyDateCreation, companyDateTimeZone, expertiseId) {
        // this.companyId = companyId;
        this.companyName = companyName;
        this.companyDesc = companyDesc;
        this.companyTel = companyTel;
        this.companyEmail = companyEmail;
        this.companyFJ = companyFJ;
        this.companyAdrs = companyAdrs;
        this.companyDateCreation = companyDateCreation;
        this.companyDateTimeZone = companyDateTimeZone;
        this.expertiseId = expertiseId;
    }
}
// 
class referral {
    constructor(refCode, refDate, refTimeZone, clientId) {
        this.refCode = refCode;
        this.refDate = refDate;
        this.refTimeZone = refTimeZone;
        this.clientId = clientId;
    }
}
// 
module.exports = {
    client,
    visitor,
    attachment,
    consultation,
    preConsultation,
    room,
    appUser,
    message,
    clientInbox,
    companyExpertise,
    appCompany,
    referral
}