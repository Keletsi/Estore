import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const HERO_DOC_REF = () => doc(db, "settings", "hero");

export const getHeroSettings = async () => {
  try {
    const snap = await getDoc(HERO_DOC_REF());
    if (!snap.exists()) return { videoUrl: "", videoEnabled: false };
    const data = snap.data();
    return {
      videoUrl: data.videoUrl || "",
      videoEnabled: Boolean(data.videoEnabled && data.videoUrl),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt || null,
    };
  } catch (error) {
    // Most common cause: Firestore rules not yet published for /settings.
    // Fail silent to image-only hero so anonymous visitors never break.
    console.warn("Hero settings unavailable (check Firestore rules for /settings):", error?.code || error);
    return { videoUrl: "", videoEnabled: false };
  }
};

export const updateHeroSettings = async ({ videoUrl, videoEnabled }) => {
  await setDoc(
    HERO_DOC_REF(),
    {
      videoUrl: videoUrl || "",
      videoEnabled: Boolean(videoEnabled && videoUrl),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};
