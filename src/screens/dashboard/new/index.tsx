import { Container } from "@components/container";
import { DashboardHeader } from "@components/panelHeader";
import { FiTrash, FiUpload } from "react-icons/fi";

import { useForm } from "react-hook-form";
import { Input } from "@components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "@contexts/AuthContext";

import { Ring } from "@uiball/loaders";

import { v4 as uuidv4 } from "uuid";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { db, storage } from "@services/index";
import { addDoc, collection } from "firebase/firestore";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const schema = z.object(
  {
    name: z.string().nonempty("O nome é obrigatório."),
    model: z.string().nonempty("O modelo é obrigatório."),
    year: z.string().nonempty("O ano do carro é obrigatório."),
    km: z.string().nonempty("O km do carro é obrigatório."),
    price: z.string().nonempty("O valor é obrigatório."),
    city: z.string().nonempty("O cidade é obrigatório."),
    description: z.string().nonempty("A descrição é obrigatória. "),
    whatsapp: z
      .string()
      .min(1, "O telefone é obrigatório")
      .refine((value) => /^(\d{10,15})$/.test(value)),
  },
  {
    message: "Numero de telefone inválido",
  }
);

type FormProps = z.infer<typeof schema>;

type ImageItemProps = {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
};

export function New() {
  const [carImages, setCarImages] = useState<ImageItemProps[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const navigation = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormProps>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/png" || image.type === "image/jpeg") {
        //enviar pro meu storage
        await handleUpload(image);
      } else {
        toast.error("envie uma imagem jpg ou png");
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }
    const currentUid = user?.uid;
    const uidImage = uuidv4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

    uploadBytes(uploadRef, image)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((dowloadUrl) => {
            const imageItem = {
              name: uidImage,
              uid: currentUid,
              previewUrl: URL.createObjectURL(image),
              url: dowloadUrl,
            };

            setCarImages((images) => [...images, imageItem]);
          })
          .catch((err) => {
            console.log("erro ao baixar a foto", err);
          });
      })
      .catch((err) => {
        console.log("erro ao enviar a foto", err);
      });
  }

  async function handleDelete(item: ImageItemProps) {
    console.log(item);

    const imagePath = `images/${item.uid}/${item.name}`;

    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setCarImages(carImages.filter((car) => car.url !== item.url));
    } catch (err) {
      console.log("error ao deleter", err);
    }
  }

  function onSubmit({
    name,
    city,
    description,
    km,
    model,
    price,
    whatsapp,
    year,
  }: FormProps) {
    if (carImages.length <= 1) {
      toast.error("envie pelo menos duas imagem desse carro");
      return;
    }

    const carListImages = carImages.map((car) => {
      return {
        uid: car.uid,
        name: car.name,
        url: car.url,
      };
    });

    setLoading(true);

    addDoc(collection(db, "cars"), {
      name: name.toUpperCase(),
      city,
      description,
      km,
      model,
      price,
      whatsapp,
      year,
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: carListImages,
    })
      .then(() => {
        toast.success("Cadastrado com sucesso");
        setLoading(false);
        reset();
        setCarImages([]);
        navigation("/dashboard");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <Container>
      <DashboardHeader />
      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row  items-center gap-2 ">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={20} color="#000" />
          </div>
          <div className="cursor-pointer ">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer"
              onChange={handleFile}
            />
          </div>
        </button>

        {carImages.map((item) => (
          <div
            key={item.name}
            className=" h-32 flex items-center justify-center z"
          >
            <button className="absolute" onClick={() => handleDelete(item)}>
              <FiTrash size={28} color="#FFF" />
            </button>
            <img
              src={item.previewUrl}
              className="rounded-lg w-full h-32 object-cover"
              alt="Foto do carro"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <p className="mb-2 font-medium ">Nome do Carro</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex: Onix 1.0"
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium ">Modelo do Carro</p>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="Ex: 1.0 flex PLUS MANUAL"
            />
          </div>

          <div className="w-full flex mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium ">Ano do Carro</p>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Ex: 2016/2016"
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium ">KM rodados</p>
              <Input
                type="text"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="Ex: 23.978"
              />
            </div>
          </div>

          <div className="w-full flex mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium ">Whatsapp</p>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Ex:5585992189912"
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium ">Cidade</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex: Fortaleza - CE"
              />
            </div>
          </div>
          <div className="mb-3">
            <p className="mb-2 font-medium ">Preço</p>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Ex: 69.000"
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h-36 px-2 resize-none"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o carro"
            />
            {errors.description && (
              <p className="mb-1 text-red-500">{errors.description?.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 text-white font-medium w-full h-10"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Ring size={22} color="#fff" lineWeight={4} speed={2} />
              </div>
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
      </div>
    </Container>
  );
}
