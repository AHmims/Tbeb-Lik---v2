class medecin {
    constructor(Matricule_Med, ID_SPEC, ID_ADMIN, NOM_MED, TEL, EMAIL, DISPONIBLE, VILLE, PASSWORD) {
        this.Matricule_Med = Matricule_Med;
        this.ID_SPEC = ID_SPEC;
        this.ID_ADMIN = ID_ADMIN;
        this.NOM_MED = NOM_MED;
        this.TEL = TEL;
        this.EMAIL = EMAIL;
        this.DISPONIBLE = DISPONIBLE;
        this.VILLE = VILLE;
        this.PASSWORD = PASSWORD;
    }
}
// 
class patients {
    constructor(CIN, MATRICULE_PAT, NOM_PAT, Prenom_PAT, PASSWORD, Date_Emb, Tel, ADRESS, Date_Retrait, Direction, Genre) {
        this.CIN = CIN;
        this.MATRICULE_PAT = MATRICULE_PAT;
        this.NOM_PAT = NOM_PAT;
        this.Prenom_PAT = Prenom_PAT;
        this.PASSWORD = PASSWORD;
        this.Date_Emb = Date_Emb;
        this.Date_Naissence = Date_Naissence;
        this.Tel = Tel;
        this.ADRESS = ADRESS;
        this.Date_Retrait = Date_Retrait;
        this.Direction = Direction;
        this.Genre = Genre;
    }
}
// 
class certification_medical {
    constructor(ID, DOCUMENT, ID_Sender) {
        this.ID = ID;
        this.DOCUMENT = DOCUMENT;
        this.ID_Sender = ID_Sender;
    }
}
// 
class consultation {
    constructor(JOUR_REPOS, DATE_CONSULTATION, Matricule_Med, commentaire, idPreCons) {
        this.JOUR_REPOS = JOUR_REPOS;
        this.DATE_CONSULTATION = DATE_CONSULTATION;
        this.Matricule_Med = Matricule_Med;
        this.commentaire = commentaire;
        this.idPreCons = idPreCons;
    }
}
// 
class preConsultation {
    constructor(idPreCons, dateCreation, motif, atcd, nbJourA, accepted, MATRICULE_PAT) {
        this.idPreCons = idPreCons;
        this.dateCreation = dateCreation;
        this.motif = motif;
        this.atcd = atcd;
        this.nbJourA = nbJourA;
        this.accepted = accepted;
        this.MATRICULE_PAT = MATRICULE_PAT;
    }
}
// 
class room {
    constructor(id, Matricule_Pat, Matricule_Med) {
        this.id = id;
        this.Matricule_Pat = Matricule_Pat;
        this.Matricule_Med = Matricule_Med;
    }
}
// 
class appUser {
    constructor(userId, userType, socket, online, linkedMedecinMatricule, roomId) {
        this.userId = userId;
        this.userType = userType;
        this.socket = socket;
        this.online = online;
        this.linkedMedecinMatricule = linkedMedecinMatricule;
        this.roomId = roomId;
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
    constructor(Matricule_emmeter, contenu, roomId, date_envoi, type, id_pieceJointes) {
        this.Matricule_emmeter = Matricule_emmeter;
        this.contenu = contenu;
        this.roomId = roomId;
        this.date_envoi = date_envoi;
        this.type = type;
        this.id_pieceJointes = id_pieceJointes;
    }
}
// 
module.exports = {
    medecin,
    patients,
    certification_medical,
    consultation,
    preConsultation,
    room,
    appUser,
    message
}