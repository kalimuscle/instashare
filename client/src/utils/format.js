export const fileSizeFormattedString = (size) => {

  if(!size) 
      return 0;

  if(size >= 1048576) // 1 MB'
      return (size / 1048576).toFixed(2) + ' MB'
  
  if(size >= 1024)  // 1 KB
      return (size / 1024).toFixed(2) + ' KB'

  return size + ' Bytes'
}