// functions/index.js
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import admin from "firebase-admin";
admin.initializeApp();

export const notifyOnCountUpShofu = onDocumentUpdated(
  "residents_shofu/{residentId}",
  async (change, ctx) => {
    const before = change.before.data();
    const after  = change.after.data();
    const { residentId } = ctx.params;

    if ((after.luggage ?? 0) <= (before.luggage ?? 0) &&
        (after.mail    ?? 0) <= (before.mail    ?? 0)) return;

    const snap = await admin.firestore()
      .collection("fcm_tokens")
      .where("residentId","==",residentId)
      .get();
    if (snap.empty) return;

    const tokens = snap.docs.map(d => d.id);
    const res = await admin.messaging().sendMulticast({
      tokens,
      notification:{
        title:"📦 荷物到着",
        body :`${after.name}さんに新しい荷物/郵便があります！`
      }
    });
    console.log(`FCM success:${res.successCount} / fail:${res.failureCount}`);
    res.responses.forEach((r, idx) => {
      if (!r.success) {
        console.log(` token[${idx}] error: ${r.error.code}`);
      }
    });
  }
);

export const notifyOnCountUpMeizen = onDocumentUpdated(
  "residents_meizen/{residentId}",
  async (change, ctx) => {
    const before = change.before.data();
    const after  = change.after.data();
    const { residentId } = ctx.params;

    if ((after.luggage ?? 0) <= (before.luggage ?? 0) &&
        (after.mail    ?? 0) <= (before.mail    ?? 0)) return;

    const snap = await admin.firestore()
      .collection("fcm_tokens")
      .where("residentId","==",residentId)
      .get();
    if (snap.empty) return;

    const tokens = snap.docs.map(d => d.id);
    const res = await admin.messaging().sendMulticast({
      tokens,
      notification:{
        title:"📦 荷物到着",
        body :`${after.name}さんに新しい荷物/郵便があります！`
      }
    });
    console.log(`FCM success:${res.successCount} / fail:${res.failureCount}`);
    res.responses.forEach((r, idx) => {
      if (!r.success) {
        console.log(` token[${idx}] error: ${r.error.code}`);
      }
    });
  }
);