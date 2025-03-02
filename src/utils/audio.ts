export const getFftFromStream = (
  stream: MediaStream,
  dataArray: Uint8Array
) => {
  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaStreamSource(stream);
  source.connect(analyser);

  analyser.fftSize = dataArray.length;

  return () => {
    analyser.getByteTimeDomainData(dataArray);
  };
};
