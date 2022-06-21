import { compress, decompress } from "lzw-compressor";

const compressFile = (file: Blob, callback: (size: number) => void) => {
  const reader = new FileReader();

  reader.onload = (fileData: ProgressEvent<FileReader>) => {
    if (fileData?.target?.result) {
      // @ts-ignore
      const encoded = compress(fileData.target.result as string);

      // TODO: поменять библиотеку т.к. encode файл не сжимается(сжимается, но encode файл равен исходному)

      const encodeFile = new Blob([encoded], { type: "text/plain" });

      callback(encodeFile.size);

      downloadFile(encoded, "compress.txt");
    }
  };

  reader.readAsText(file);
};

const decompressFile = (file: Blob, callback: (size: number) => void) => {
  let reader = new FileReader();

  reader.onload = (fileData) => {
    if (fileData?.target?.result) {
      // @ts-ignore
      const encoded = decompress(fileData.target.result as string);

      const encodeFile = new Blob([encoded], { type: "text/plain" });

      callback(encodeFile.size);

      downloadFile(encoded, "decompress.txt");
    }
  };

  reader.readAsText(file);
};

const downloadFile = (data: string, nameFile: string) => {
  const element = document.createElement("a");
  const file = new Blob([data], {
    type: "text/plain",
  });

  element.href = URL.createObjectURL(file);
  element.download = nameFile;

  document.body.appendChild(element);

  element.click();
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export { compressFile, decompressFile, formatBytes };
