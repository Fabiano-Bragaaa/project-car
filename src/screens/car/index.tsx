import { Container } from "@components/container";
import { Props } from "@screens/home";
import { db } from "@services/index";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { FaWhatsapp } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";

type CarProps = Props & {
  whatsapp: string;
  model: string;
  description: string;
  owner: string;
  created: string;
};

export function CarDetails() {
  const [car, setCar] = useState<CarProps>();
  const [sliderPerView, setSliderPerView] = useState<number>(2);

  const { id } = useParams();

  useEffect(() => {
    async function loadingCar() {
      if (!id) {
        return;
      }

      const docRef = doc(db, "cars", id);

      getDoc(docRef).then((snapshot) => {
        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          year: snapshot.data().year,
          city: snapshot.data()?.city,
          km: snapshot.data()?.km,
          images: snapshot.data()?.images,
          price: snapshot.data().price,
          uid: snapshot.data()?.uid,
          whatsapp: snapshot.data()?.whatsapp,
          model: snapshot.data()?.model,
          description: snapshot.data()?.description,
          owner: snapshot.data()?.owner,
          created: snapshot.data().created,
        });
      });
    }

    loadingCar();
  }, [id]);

  useEffect(() => {
    function handleReize() {
      if (window.innerWidth < 720) {
        setSliderPerView(1);
      } else {
        setSliderPerView(2);
      }
    }
    handleReize();

    window.addEventListener("resize", handleReize);

    return () => {
      window.removeEventListener("resize", handleReize);
    };
  }, []);

  return (
    <Container>
      <Swiper
        slidesPerView={sliderPerView}
        pagination={{ clickable: true }}
        navigation
      >
        {car?.images.map((image) => (
          <SwiperSlide key={image.name}>
            <img
              src={image.url}
              className="w-full h-96 object-cover cursor-pointer"
              alt="foto do carro"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4 ">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-black text-3xl">{car?.name}</h1>
            <h1 className="font-bold text-black text-3xl">R$ {car?.price}</h1>
          </div>

          <p>{car?.model}</p>

          <div className="flex w-full gap-6 my-4 ">
            <div className="flex flex-col gap-4">
              <div>
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p>KM</p>
                <strong>{car?.km}</strong>
              </div>
            </div>
          </div>

          <strong>Descrição:</strong>
          <p className="mb-4">{car?.description}</p>

          <strong>Whatsapp</strong>
          <p>{car?.whatsapp}</p>

          <a className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer">
            Conversar com o vendedor
            <FaWhatsapp size={26} color="#fff" />
          </a>
        </main>
      )}
    </Container>
  );
}
