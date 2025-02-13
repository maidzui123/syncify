import React, { ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import { HiOutlineXMark } from "react-icons/hi2";
import { updateUserInfo } from "../api/ApiCollection";
import { useQueryClient } from "@tanstack/react-query";

interface EditDataUserProps {
  slug: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}

const EditDataUser: React.FC<EditDataUserProps> = ({
  slug,
  isOpen,
  //   columns,
  setIsOpen,
  data,
}) => {
  const queryClient = useQueryClient();
  // global082
  const [showModal, setShowModal] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  // add user
  const [email, setEmail] = React.useState(data?.email);
  const [username, setUsername] = React.useState(data?.username);
  const [tag, setTag] = React.useState(data?.tag);
  const [displayName, setDisplayName] = React.useState(data?.displayName);
  const [tel, setTel] = React.useState(data?.tel);
  const [dob, setDob] = React.useState(data?.dob);

  // global
  const loadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUpload = e.target.files[0];
      setFile(imageUpload);
      setPreview(URL.createObjectURL(imageUpload));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await updateUserInfo(data?._id, {
        email,
        username,
        displayName,
        tag,
        tel,
        dob,
      });

      queryClient.invalidateQueries({ queryKey: ["allusers"] });

      setShowModal(false);
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  React.useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

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
              defaultValue={data?.email}
              onChange={(element) => setEmail(element.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full"
              name="username"
              id="username"
              defaultValue={data?.username}
              onChange={(element) => setUsername(element.target.value)}
            />
            <input
              type="text"
              placeholder="Display name"
              className="input input-bordered w-full"
              name="displayName"
              id="displayName"
              defaultValue={data?.displayName}
              onChange={(element) => setDisplayName(element.target.value)}
            />
            <input
              type="text"
              placeholder="Tag"
              className="input input-bordered w-full"
              name="tag"
              id="tag"
              defaultValue={data?.tag}
              onChange={(element) => setTag(element.target.value)}
            />
            <input
              type="text"
              placeholder="Phone"
              className="input input-bordered w-full"
              name="tel"
              id="tel"
              defaultValue={data?.tel}
              onChange={(element) => setTel(element.target.value)}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              className="input input-bordered w-full"
              name="dob"
              id="dob"
              defaultValue={
                data?.dob ? new Date(data.dob).toISOString().split("T")[0] : ""
              }
              onChange={(element) => setDob(element.target.value)}
            />
            <button
              className={`mt-5 btn btn-primary
              btn-block col-span-full font-semibold`}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
};

export default EditDataUser;
