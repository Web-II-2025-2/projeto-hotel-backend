import { Guest } from "./Guest";
import { Credential } from "./Credential";
import { Employee } from "./Employee";
import { Room } from "./Room";
import { Reservation } from "./Reservation";

Guest.belongsTo(Credential, { foreignKey: "credentialId", as: "credential" });
Employee.belongsTo(Credential, { foreignKey: "credentialId", as: "credential" });
Reservation.belongsTo(Guest, { foreignKey: "guestId", as: "guest" });
Reservation.belongsTo(Room, { foreignKey: "roomId", as: "room" });