import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const cleanupUserDataOnDelete = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;
  console.log(`Teljes takarítás indítása a törölt felhasználóhoz: ${uid}`);

  try {
    const batch = db.batch();

    // 1. Felhasználónév felszabadítása a 'Usernames' kollekcióból
    const userDocRef = db.collection("Users").doc(uid);
    const userDoc = await userDocRef.get();
    
    if (userDoc.exists) {
      const username = userDoc.data()?.username;
      if (username) {
        batch.delete(db.collection("Usernames").doc(username));
        console.log(`- Felhasználónév (${username}) törlésre jelölve.`);
      }
    }

    // 2. A 'Users' dokumentum törlése
    batch.delete(userDocRef);

    // 3. KARAKTEREK törlése (userId alapján)
    const charSnap = await db.collection("Characters").where("userId", "==", uid).get();
    charSnap.forEach(doc => batch.delete(doc.ref));
    console.log(`- ${charSnap.size} karakter törlésre jelölve.`);

    // 4. KALANDOK törlése (Adventures kollekció)
    // Megjegyzés: a kódod alapján itt 'userId' vagy 'creatorId' mezőt keressünk
    const advSnap = await db.collection("Adventures").where("userId", "==", uid).get();
    advSnap.forEach(doc => batch.delete(doc.ref));
    console.log(`- ${advSnap.size} saját készítésű kaland törlésre jelölve.`);

    // 5. AKTÍV JÁTÉKOK törlése (Games kollekció)
    // Amikor a felhasználó a házigazda
    const gameSnap = await db.collection("Games").where("ownerId", "==", uid).get();
    gameSnap.forEach(doc => batch.delete(doc.ref));
    console.log(`- ${gameSnap.size} aktív játékasztal törlésre jelölve.`);

    // 6. Minden művelet végrehajtása egyben
    await batch.commit();
    
    console.log(`A takarítás sikeresen befejeződött a(z) ${uid} azonosítóhoz.`);
    return null;

  } catch (error) {
    console.error("Hiba történt a háttérbeli takarítás során:", error);
    return null;
  }
});

// Ez a függvény automatikusan lefut, ha a Forums kollekcióban törlődik egy poszt
export const cleanupCommentsOnPostDelete = functions.firestore
  .document('Forums/{subForum}/Posts/{postId}')
  .onDelete(async (snap, context) => {
    // A context.params segítségével pontosan tudjuk, melyik fórum (characters/adventures) és melyik poszt
    const { subForum, postId } = context.params;
    console.log(`Takarítás indul a poszthoz: ${postId} (Fórum: ${subForum})`);

    const commentsRef = db.collection(`Forums/${subForum}/Posts/${postId}/Comments`);
    
    try {
      // Kommentek lekérése és kötegelt törlése a szerveren
      const commentsSnapshot = await commentsRef.get();
      
      if (!commentsSnapshot.empty) {
        const batch = db.batch();
        commentsSnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        
        console.log(`${commentsSnapshot.size} db komment sikeresen törölve a ${postId} poszt alól.`);
      } else {
        console.log(`A ${postId} posztnak nem voltak kommentjei, nincs mit törölni.`);
      }
      return null;
    } catch (error) {
      console.error('Hiba a kommentek háttérbeli törlésekor:', error);
      return null;
    }
  });