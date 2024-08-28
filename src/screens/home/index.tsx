import { Container } from "@components/container";
import { db } from "@services/index";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string;
  images: CarImagesProps[];
};

type CarImagesProps = {
  name: string;
  uid: string;
  url: string;
};

export function Home() {
  const [cars, setCars] = useState<Props[]>([]);

  useEffect(() => {
    function loadingCars() {
      const carsRef = collection(db, "cars");

      const queryRef = query(carsRef, orderBy("created", "desc"));
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
  }, []);

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl flex mx-auto justify-center items-center gap-2 ">
        <input
          placeholder="Digite o nome do carro"
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
        />
        <button className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg">
          Buscar
        </button>
      </section>
      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="grid grid-cols-1 gap-6 md: grid-cols-2 lg: grid-cols-3">
        {cars.map((car) => (
          <Link to={`/car/${car.id}`} key={car.id}>
            <section className="w-full bg-white rounded-lg">
              <img
                src={car.images[0].url}
                alt="carro"
                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
              />
              <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>
              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6">
                  Ano {car.year} | {car.km} km
                </span>
                <strong className="text-black font-medium text-xl">
                  R$ {car.price}
                </strong>
              </div>
              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-zinc-700">{car.city}</span>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  );
}
