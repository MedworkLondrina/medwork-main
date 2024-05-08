import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function Home() {

  const { checkSignIn } = useAuth(null);

  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const fetchImageURL = async () => {
      const tenant = await checkSignIn();
      const storage = getStorage();
      const storageRef = ref(storage, `logos/${tenant.tenant_code}.png`);
      try {
        const downloadURL = await getDownloadURL(storageRef);
        if (downloadURL) {
          setImageURL(downloadURL);
        }
      } catch (error) {
        console.error(`Erro ao carregar logo: ${error}`);
      }
    };

    fetchImageURL();
  }, []);

  return (
    <div>
      {/* Logo */}
      <div className="flex justify-center mb-8 mt-4">
        <div className="p-4 max-w-[50vh] max-h-[20vh]">
          <img src={imageURL} />
        </div>
      </div>

    </div>
  )
}

export default Home;