import { CustomResponse } from "@/models/CustomResponse";
import firebase_app from "./config";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  DocumentData,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ProjectType } from "@/models/Types";

const db = getFirestore(firebase_app);

export const addData = async (
  colllectionName: string,
  id: string,
  data: any
): Promise<CustomResponse> => {
  let result = null;
  let error = null;

  try {
    await setDoc(doc(db, colllectionName, id), data, {
      merge: true,
    });
    return { success: true };
  } catch (e) {
    error = e;
    return {
      success: false,
      error: JSON.stringify(e),
    };
  }
};

export const getMyProjects = async (
  myId: string
): Promise<CustomResponse<any[]>> => {
  const q = query(collection(db, "projects"), where("owner", "==", myId));
  try {
    const snapshot = await getDocs(q);
    if (snapshot.docs.length === 0)
      return {
        success: [],
      };

    const data = snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    }));
    return {
      success: data,
    };
  } catch (error) {
    return {
      error: JSON.stringify(error),
    };
  }
};

export const getProject = async (
  projectId: string
): Promise<CustomResponse<ProjectType>> => {
  try {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);

    const collectionRef = collection(db, `projects/${projectId}/components`);
    const componentsDocs = await getDocs(collectionRef);
    console.log(
      "collectionRef",
      componentsDocs.docs.map((item) => item.id)
    );

    let data: ProjectType | undefined;

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      data = {
        ...docSnap.data(),
        components: componentsDocs.docs.map((comp) => ({
          id: comp.id,
          ...comp.data(),
        })),
      } as ProjectType;
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    return {
      success: data,
    };
  } catch (error) {
    return {
      error: JSON.stringify(error),
    };
  }
};

export const updateProjectComponents = async (
  projectId: string,
  components: any[]
): Promise<CustomResponse> => {
  try {
    const docRef = doc(db, "projects", projectId);
    await updateDoc(docRef, {
      components: components,
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: JSON.stringify(error),
    };
  }
};

export const addComponent = async (projectId: string, component: any) => {
  try {
    const docRef = doc(
      db,
      `projects/${projectId}/components/${component.componentId}`
    );
    await setDoc(docRef, component);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: JSON.stringify(error),
    };
  }
};

export const updateComponent = async (
  projectId: string,
  component: any
): Promise<CustomResponse> => {
  try {
    const docRef = doc(db, `projects/${projectId}/components/${component.id}`);
    await updateDoc(docRef, component);

    const updatedDoc = await getDoc(docRef);

    return {
      success: true,
      detail: { id: updatedDoc.id, ...updatedDoc.data() },
    };
  } catch (error) {
    return {
      success: false,
      error: JSON.stringify(error),
    };
  }
};
