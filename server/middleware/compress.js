import ffmpeg from "fluent-ffmpeg";
import path from "path";

const compressVideo = async (inputPath, outputFolder) => {
  const outputPath = path.join(outputFolder, `compressed_${Date.now()}.mp4`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec("libx264") 
      .size("640x?") 
      .outputOptions("-preset", "slow") 
      .outputOptions("-crf", "28")
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", (err) => {
        reject(err);
      })
      .run();
  });
};

export default compressVideo;