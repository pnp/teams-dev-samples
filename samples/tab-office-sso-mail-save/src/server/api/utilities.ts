export const createMailFileName = (subject: string): string => {
  let fileName = subject.replace(/ /g, '_').replace(/:/g, '_');
  return fileName;
};