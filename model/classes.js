class medecin {
    constructor(MATRICULE_MED, ID_SPEC, ID_ADMIN, NOM_MED, TEL, EMAIL, DISPONIBLE, VILLE, PASSWORD) {
        this.MATRICULE_MED = MATRICULE_MED;
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
class patient {
    constructor(CIN, MATRICULE_PAT, NOM_PAT, PRENOM_PAT, PASSWORD, DATE_EMB, TEL, ADRESSE, DATE_RETRAIT, DIRECTION, SEXE) {
        this.CIN = CIN;
        this.MATRICULE_PAT = MATRICULE_PAT;
        this.NOM_PAT = NOM_PAT;
        this.PRENOM_PAT = PRENOM_PAT;
        this.PASSWORD = PASSWORD;
        this.DATE_EMB = DATE_EMB;
        this.DATE_NAISSENCE = DATE_NAISSENCE;
        this.TEL = TEL;
        this.ADRESSE = ADRESSE;
        this.DATE_RETRAIT = DATE_RETRAIT;
        this.DIRECTION = DIRECTION;
        this.SEXE = SEXE;
    }
}
// 
class consultation {
    constructor(JOUR_REPOS, DATE_CONSULTATION, MATRICULE_MED, COMMENTAIRE, ID_PRECONS) {
        this.JOUR_REPOS = JOUR_REPOS;
        this.DATE_CONSULTATION = DATE_CONSULTATION;
        this.MATRICULE_MED = MATRICULE_MED;
        this.COMMENTAIRE = COMMENTAIRE;
        this.ID_PRECONS = ID_PRECONS;
    }
}
// 
class preConsultation {
    constructor(ID_PRECONS, DATE_CREATION, MOTIF, ATCD, NB_JOUR_A, ACCEPTE, MATRICULE_PAT) {
        this.ID_PRECONS = ID_PRECONS;
        this.DATE_CREATION = DATE_CREATION;
        this.MOTIF = MOTIF;
        this.ATCD = ATCD;
        this.NB_JOUR_A = NB_JOUR_A;
        this.ACCEPTE = ACCEPTE;
        this.MATRICULE_PAT = MATRICULE_PAT;
    }
}
// 
class room {
    constructor(ID_ROOM, MATRICULE_PAT, MATRICULE_MED) {
        this.ID_ROOM = ID_ROOM;
        this.MATRICULE_PAT = MATRICULE_PAT;
        this.MATRICULE_MED = MATRICULE_MED;
    }
}
// 
class appUser {
    constructor(ID_USER, TYPE_USER, SOCKET, ONLINE, MATRICULE_MED = null, ID_ROOM = null) {
        this.ID_USER = ID_USER;
        this.TYPE_USER = TYPE_USER;
        this.SOCKET = SOCKET;
        this.ONLINE = ONLINE;
        this.MATRICULE_MED = MATRICULE_MED;
        this.ID_ROOM = ID_ROOM;
    }
    // 
    getStatus() {
        return {
            ID_USER: this.ID_USER,
            ONLINE: this.ONLINE
        }
    }
}
// 
class message {
    constructor(MATRICULE_EMETTEUR, CONTENU, ID_ROOM, DATE_ENVOI, TYPE, ID_PIECEJOINTES) {
        this.MATRICULE_EMETTEUR = MATRICULE_EMETTEUR;
        this.CONTENU = CONTENU;
        this.ID_ROOM = ID_ROOM;
        this.DATE_ENVOI = DATE_ENVOI;
        this.TYPE = TYPE;
        this.ID_PIECEJOINTES = ID_PIECEJOINTES;
    }
}
// 
class specialites {
    constructor(ID_SPEC, NOM_SPEC) {
        this.ID_SPEC = ID_SPEC;
        this.NOM_SPEC = NOM_SPEC;
    }
}
// 
module.exports = {
    medecin,
    patient,
    consultation,
    preConsultation,
    room,
    appUser,
    message,
    specialites
}