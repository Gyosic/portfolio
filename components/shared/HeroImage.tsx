"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { FileType } from "@/lib/schema/file.schema";
import { UploadType } from "@/lib/schema/upload.schema";
import logo from "@/public/images/man.png";

const getFileProperties = (file?: File | FileType) => {
  if (!file) return { src: "", name: "" };

  if (file instanceof File) {
    const { type = "", name = "", size = 0, lastModified = Date.now() } = file;
    return {
      src: URL.createObjectURL(file),
      type,
      name,
      size,
      lastModified,
    };
  } else {
    const { type = "", src = "", originalname = "", size = 0, lastModified } = file || {};
    return {
      src: `/api/files${src}`,
      type,
      name: originalname,
      size,
      lastModified,
    };
  }
};

interface HeroImageProps {
  image?: UploadType;
}
const HeroImage = ({ image }: HeroImageProps) => {
  const session = useSession();

  const [files, setFiles] = useState<File[] | undefined>();

  const file = useMemo(() => {
    if (files?.length) return files[0];

    return image?.file;
  }, [files]);

  const handleDrop = async (files: File[]) => {
    setFiles(files);

    const formData = new FormData();

    if (files[0] instanceof File) formData.append("file", files[0]);
    formData.append("name", "메인 사진");
    formData.append("type", "main");

    await fetch("/api/files/upload", { method: "POST", body: formData });
  };

  const handleError = (err: Error) => {
    toast.error(err.message);
  };

  return (
    <div className="group relative">
      <Image
        src={getFileProperties(file).src || logo}
        alt="logo"
        loading="eager"
        priority
        height={1000}
        width={1000}
        unoptimized
        className="group"
      />
      {session.status === "authenticated" && (
        <Dropzone
          className="absolute top-0 z-100 h-full opacity-20 group-hover:opacity-50"
          accept={{ "image/*": [] }}
          maxFiles={1}
          maxSize={1024 * 1024 * 10}
          minSize={1024}
          onDrop={handleDrop}
          onError={handleError}
          src={files}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      )}
    </div>
  );
};

export default HeroImage;
