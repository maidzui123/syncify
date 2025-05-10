import React, { ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import { HiOutlineXMark } from "react-icons/hi2";

interface ShowDataUserProps {
  slug: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}

const ShowDataUser: React.FC<ShowDataUserProps> = ({
  slug,
  isOpen,
  //   columns,
  setIsOpen,
  data,
}) => {
  // global082
  const [showModal, setShowModal] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  // add user
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isVerified, setIsVerified] = React.useState("");
  const [formUserIsEmpty, setFormUserIsEmpty] = React.useState(true);

  // add product
  const [title, setTitle] = React.useState("");
  const [color, setColor] = React.useState("");
  const [producer, setProducer] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [inStock, setInStock] = React.useState("");
  const [formProductIsEmpty, setFormProductIsEmpty] = React.useState(true);

  // global
  const loadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUpload = e.target.files[0];
      setFile(imageUpload);
      setPreview(URL.createObjectURL(imageUpload));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast("Gabisa dong!", { icon: "😛" });
  };

  React.useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  // add user
  React.useEffect(() => {
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      phone === "" ||
      isVerified === "" ||
      file === null
    ) {
      setFormUserIsEmpty(true);
    }

    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      phone !== "" &&
      isVerified !== "" &&
      file !== null
    ) {
      setFormUserIsEmpty(false);
    }
  }, [email, file, firstName, isVerified, lastName, phone]);

  React.useEffect(() => {
    if (
      title === "" ||
      color === "" ||
      producer === "" ||
      price === "" ||
      inStock === "" ||
      file === null
    ) {
      setFormProductIsEmpty(true);
    }

    if (
      title !== "" &&
      color !== "" &&
      producer !== "" &&
      price !== "" &&
      inStock !== "" &&
      file !== null
    ) {
      setFormProductIsEmpty(false);
    }
  }, [color, file, inStock, price, producer, title]);

  if (slug === "user") {
    return (
      <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99]">
        <div
          className={`w-[80%] xl:w-[50%] rounded-lg p-7 bg-base-100 relative transition duration-300 flex flex-col items-stretch gap-5 ${
            showModal ? "translate-y-0" : "translate-y-full"
          }
            ${showModal ? "opacity-100" : "opacity-0"}`}
        >
          <div className="w-full flex justify-between pb-5 border-b border-base-content border-opacity-30">
            <button
              onClick={() => {
                setShowModal(false);
                setIsOpen(false);
              }}
              className="absolute top-5 right-3 btn btn-ghost btn-circle"
            >
              <HiOutlineXMark className="text-xl font-bold" />
            </button>
            <span className="text-2xl font-bold">{data?.displayName}</span>
          </div>
          <div className="w-full flex flex-col items-center gap-3">
            <div className="avatar">
              <div className="w-24 rounded-full">
                <img src={data?.avatar} alt="profile-upload" />
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              name="email"
              id="email"
              readOnly={true}
              defaultValue={data?.email}
              //   onChange={(element) => setFirstName(element.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full"
              name="username"
              id="username"
              readOnly={true}
              defaultValue={data?.username}
              //   onChange={(element) => setFirstName(element.target.value)}
            />
            <input
              type="text"
              placeholder="Display name"
              className="input input-bordered w-full"
              name="displayName"
              id="displayName"
              readOnly={true}
              defaultValue={data?.displayName}
              //   onChange={(element) => setFirstName(element.target.value)}
            />
            <input
              type="text"
              placeholder="Tag"
              className="input input-bordered w-full"
              name="tag"
              id="tag"
              readOnly={true}
              defaultValue={data?.tag}
              //   onChange={(element) => setEmail(element.target.value)}
            />
            <input
              type="text"
              placeholder="Phone"
              className="input input-bordered w-full"
              name="tel"
              id="tel"
              readOnly={true}
              defaultValue={data?.tel}
              //   onChange={(element) => setPhone(element.target.value)}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              className="input input-bordered w-full"
              name="dob"
              id="dob"
              readOnly={true}
              defaultValue={data?.dob}
              //   onChange={(element) => setPhone(element.target.value)}
            />
          </form>
        </div>
      </div>
    );
  }

  return null;
};

export default ShowDataUser;
