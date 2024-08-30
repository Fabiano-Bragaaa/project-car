import { Container } from "@components/container";
import { DashboardHeader } from "@components/panelHeader";
import { AuthContext } from "@contexts/AuthContext";
import { Props } from "@screens/home";
import { db, storage } from "@services/index";
import { Ring } from "@uiball/loaders";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useContext, useEffect, useState } from "react";

import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

export function Dashboard() {
  const [cars, setCars] = useState<Props[]>([]);
  const [loadingImages, setLoadingImages] = useState<string[]>([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    function loadingCars() {
      if (!user?.uid) {
        return;
      }

      const carsRef = collection(db, "cars");

      const queryRef = query(carsRef, where("uid", "==", user.uid));
      getDocs(queryRef).then((snapshot) => {
        let listCars = [] as Props[];

        snapshot.forEach((doc) => {
          listCars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid,
          });
        });

        setCars(listCars);
      });
    }

    loadingCars();
  }, [user]);

  function handleImageLoading(id: string) {
    setLoadingImages((imagesLoaded) => [...imagesLoaded, id]);
  }

  async function handleDeleteCar(car: Props) {
    const itemCar = car;

    const docRef = doc(db, "cars", itemCar.id);
    await deleteDoc(docRef);

    itemCar.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;

      const imageRef = ref(storage, imagePath);
      try {
        await deleteObject(imageRef);
        setCars(cars.filter((car) => car.id !== itemCar.id));
        toast.success("Carro deletado com sucesso.");
      } catch (err) {
        console.log("erro ao excluir a imagem", err);
      }
    });
  }

  return (
    <Container>
      <DashboardHeader />
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <section
            key={car.uid}
            className="w-full bg-white rounded-lg relative"
          >
            <button
              onClick={() => handleDeleteCar(car)}
              className="absolute bg-white w-14 h-14 rounded-full flex justify-center items-center right-2 top-2 drop-shadow "
            >
              <FiTrash2 size={26} color="#000" />
            </button>
            <div
              className="w-full h-72 rounded-lg bg-slate-200"
              style={{
                display: loadingImages.includes(car.id) ? "none" : "block",
              }}
            >
              <div className="w-full h-72 flex items-center justify-center">
                <Ring size={22} color="#000" lineWeight={4} speed={2} />
              </div>
            </div>
            <img
              src={car.images[0].url}
              alt="carro"
              onLoad={() => handleImageLoading(car.id)}
              style={{
                display: loadingImages.includes(car.id) ? "block" : "none",
              }}
              className="w-full rounded-lg mb-2 max-h-72"
            />
            <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>
            <div className="flex flex-col px-2">
              <span className="text-zinc-700">
                Ano {car.year} | {car.km} km
              </span>
              <strong className="text-black font-bold mt-4 ">
                R$ {car.price}
              </strong>
            </div>
            <div className="w-full h-px bg-slate-200 my-2"></div>
            <div className="px-2 pb-2">
              <span className="text-black">{car.city}</span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
}
