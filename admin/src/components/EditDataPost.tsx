import React, { ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import { HiOutlineXMark } from "react-icons/hi2";
import { updatePost } from "../api/ApiCollection";
import { useQueryClient } from "@tanstack/react-query";

interface EditDataPostProps {
  slug: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}

const EditDataPost: React.FC<EditDataPostProps> = ({
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
  const [images, setImages] = React.useState<string[]>([]);
  const [content, setContent] = React.useState(data?.content);
  // global
  const loadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUpload = e.target.files[0];
      setFile(imageUpload);
      setPreview(URL.createObjectURL(imageUpload));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await updatePost(data?.postId, {
        content,
        // media: images,
      });

      queryClient.invalidateQueries({ queryKey: ["allposts"] });
      setShowModal(false);
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  React.useEffect(() => {
    setShowModal(isOpen);
    setImages(data?.media);
  }, [isOpen]);

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
          <span className="text-2xl font-bold">Edit Post</span>
        </div>
        <div className="w-full flex justify-between items-center gap-3">
          <p>Created by: {data?.createdBy?.username}</p>
          <p>Likes: {data?.likes}</p>
          <p>Comments: {data?.comments}</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full grid grid-cols-1 lg:grid-cols-1 gap-4"
        >
          <input
            type="text"
            placeholder="Content"
            className="input input-bordered w-full"
            name="content"
            id="content"
            defaultValue={data?.content}
            onChange={(element) => setContent(element.target.value)}
          />

          <div className="w-full flex gap-2 overflow-x-auto py-2">
            {images.map((src: any, index) => (
              <div key={index} className="relative">
                <img
                  src={src?.url}
                  alt={`preview-${index}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 text-xs flex justify-center items-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
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
};

export default EditDataPost;
