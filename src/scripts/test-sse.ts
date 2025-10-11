// // scripts/simulate-notifications.js
//
// const clients = []; // clients SSE simulés
// let notifId = 1;
//
// // ⚡ Fonctions de broadcast simulées
// function broadcastNotification(notification) {
//   clients.forEach((c) => c({ type: "create", notification }));
// }
//
// function broadcastRemoveNotification(itemId, vehicleId, type) {
//   clients.forEach((c) => c({ type: "delete", itemId, vehicleId, notifType: type }));
// }
//
// // ⚡ Ajouter un “client” simulé qui reçoit les notifications
// function addClient(callback) {
//   clients.push(callback);
// }
//
// // ⚡ Générer une nouvelle dépense et sa notif
// function addDepense() {
//   const vehicleId = Math.floor(Math.random() * 5) + 1;
//   const newNotif = {
//     id: notifId++,
//     type: "Entretien",
//     message: `Nouvelle dépense véhicule #${vehicleId}`,
//     vehicleId,
//     priority: "normal",
//     seen: false,
//     date: new Date().toISOString(),
//   };
//
//   console.log("[Ajout dépense] Création notif :", newNotif);
//   broadcastNotification(newNotif);
//
//   // Supprimer la notif après 7 secondes pour simuler réparation
//   setTimeout(() => {
//     console.log("[Réparation effectuée] Suppression notif :", newNotif.id);
//     broadcastRemoveNotification(newNotif.id, newNotif.vehicleId, newNotif.type);
//   }, 7000);
// }
//
// // ⚡ Simulation SSE
// function simulateSSE() {
//   // Client simulé qui affiche toutes les notif reçues
//   addClient((data) => {
//     console.log("Client SSE reçoit :", data);
//   });
//
//   // Ajouter une dépense toutes les 5 secondes
//   setInterval(addDepense, 5000);
// }
//
// simulateSSE();
